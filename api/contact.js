"use strict";

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const DESTINATION_EMAIL = "info@escrowless.net";
const FROM_NAME = "EscrowLess Contact Form";
const SOURCE_LABEL = "escrowless.net contact form";
const ESCROWLESS_EMAIL_PATTERN = /^[a-z0-9._%+-]+@escrowless\.net$/i;
const MAX_BODY_BYTES = 12 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMITS = Object.freeze({
  ip: 8,
  email: 4,
});
const CONTACT_CATEGORIES = new Set([
  "General",
  "Partnerships",
  "Investors",
  "Press",
  "Careers",
  "Billing",
  "Support",
  "Legal",
  "Compliance",
]);
const ALLOWED_FIELDS = new Set([
  "name",
  "email",
  "phone",
  "category",
  "message",
  "consent",
  "website",
  "botToken",
]);

const ipRateLimit = new Map();
const emailRateLimit = new Map();

class PublicInputError extends Error {
  constructor(statusCode, publicMessage, code = "invalid_request") {
    super(publicMessage);
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
    this.code = code;
  }
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function createSubmissionId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `ELC-${date}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function getClientIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "");
  return forwardedFor.split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

function applyRateLimit(store, key, limit) {
  const now = Date.now();
  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  if (current.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

function removeExpiredRateLimitEntries(store) {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) store.delete(key);
  }
}

function validateOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return;
  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== req.headers.host) {
      throw new PublicInputError(403, "This request origin is not allowed.", "origin_denied");
    }
  } catch (error) {
    if (error instanceof PublicInputError) throw error;
    throw new PublicInputError(403, "This request origin is not allowed.", "origin_invalid");
  }
}

function validateHttps(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "");
  if (process.env.VERCEL_ENV === "production" && forwardedProto && forwardedProto !== "https") {
    throw new PublicInputError(400, "Secure HTTPS is required.", "https_required");
  }
}

function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  if (typeof req.body === "string" || Buffer.isBuffer(req.body)) {
    try {
      return Promise.resolve(JSON.parse(req.body.toString() || "{}"));
    } catch {
      return Promise.reject(new PublicInputError(400, "The request body must be valid JSON.", "invalid_json"));
    }
  }

  return new Promise((resolve, reject) => {
    let body = "";
    let tooLarge = false;

    req.on("data", (chunk) => {
      if (tooLarge) return;
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        tooLarge = true;
        body = "";
      }
    });

    req.on("end", () => {
      if (tooLarge) {
        reject(new PublicInputError(413, "The message is too large.", "body_too_large"));
        return;
      }
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new PublicInputError(400, "The request body must be valid JSON.", "invalid_json"));
      }
    });

    req.on("error", () => {
      reject(new PublicInputError(400, "The request could not be read.", "body_read_failed"));
    });
  });
}

function normalizeText(value, field, { min = 1, max, multiline = false, optional = false } = {}) {
  if (optional && (value === undefined || value === null || value === "")) return "";
  if (typeof value !== "string") {
    throw new PublicInputError(400, `${field} is invalid.`, `${field}_invalid`);
  }

  let normalized = value.normalize("NFKC").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  normalized = normalized.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ");
  if (!multiline) normalized = normalized.replace(/[\n\t]+/g, " ");
  normalized = normalized.replace(/[ \t]+/g, " ").trim();

  if (normalized.length < min) {
    throw new PublicInputError(400, `${field} is required.`, `${field}_required`);
  }
  if (normalized.length > max) {
    throw new PublicInputError(400, `${field} is too long.`, `${field}_too_long`);
  }
  return normalized;
}

function normalizeEmail(value) {
  const email = normalizeText(value, "email", { max: 254 }).toLowerCase();
  if (/[\r\n]/.test(email) || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
    throw new PublicInputError(400, "Email is invalid.", "email_invalid");
  }
  return email;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new PublicInputError(400, "The request body is invalid.", "payload_invalid");
  }

  const unexpectedFields = Object.keys(payload).filter((field) => !ALLOWED_FIELDS.has(field));
  if (unexpectedFields.length) {
    throw new PublicInputError(400, "Unexpected fields are not accepted.", "unexpected_fields");
  }

  const website = normalizeText(payload.website || "", "website", { max: 200, optional: true });
  if (website) return { botSubmission: true };

  const category = normalizeText(payload.category, "category", { max: 40 });
  if (!CONTACT_CATEGORIES.has(category)) {
    throw new PublicInputError(400, "Category is invalid.", "category_invalid");
  }

  if (payload.consent !== true) {
    throw new PublicInputError(400, "Consent confirmation is required.", "consent_required");
  }

  return {
    botSubmission: false,
    name: normalizeText(payload.name, "name", { max: 100 }),
    email: normalizeEmail(payload.email),
    phone: normalizeText(payload.phone || "", "phone", { max: 40, optional: true }),
    category,
    message: normalizeText(payload.message, "message", { min: 1, max: 2000, multiline: true }),
    consent: true,
    botToken: normalizeText(payload.botToken || "", "botToken", { max: 1200, optional: true }),
  };
}

async function verifyBotToken(submission, clientIp) {
  const provider = String(process.env.CONTACT_BOT_PROVIDER || "").toLowerCase();
  const secret = process.env.CONTACT_BOT_SECRET;
  if (!provider && !secret) return;
  if (!provider || !secret || !submission.botToken) {
    throw new PublicInputError(400, "Bot verification failed.", "bot_verification_missing");
  }

  const endpoints = {
    turnstile: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    hcaptcha: "https://hcaptcha.com/siteverify",
  };
  const endpoint = endpoints[provider];
  if (!endpoint) {
    throw new PublicInputError(500, "Contact form is not configured.", "bot_provider_invalid");
  }

  const body = new URLSearchParams({
    secret,
    response: submission.botToken,
    remoteip: clientIp,
  });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await response.json().catch(() => ({}));
  if (!result.success) {
    throw new PublicInputError(400, "Bot verification failed.", "bot_verification_failed");
  }
}

function buildEmailText(submission, submissionId, timestamp) {
  return [
    `Timestamp: ${timestamp}`,
    `Submission ID: ${submissionId}`,
    `Destination mailbox: ${DESTINATION_EMAIL}`,
    `Source: ${SOURCE_LABEL}`,
    `Category: ${submission.category}`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    "",
    "Message:",
    submission.message,
    "",
    "User consent confirmation: The sender confirmed they will not submit SSNs, bank information, identity documents, proof-of-funds documents, escrow instructions, legal complaints, private case facts, purchase agreements, or other sensitive financial/private information through this basic contact form.",
    "Warning: No sensitive documents or financial information should be submitted through this basic contact form.",
  ].filter((line) => line !== null).join("\n");
}

function createTransport(port, secure) {
  const smtpUser = process.env.CONTACT_SMTP_USER?.trim();
  return nodemailer.createTransport({
    host: process.env.CONTACT_SMTP_HOST || "mail.privateemail.com",
    port,
    secure,
    requireTLS: !secure,
    auth: {
      user: smtpUser,
      pass: process.env.CONTACT_SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

function smtpConnectionDetails(port) {
  return {
    host: process.env.CONTACT_SMTP_HOST || "mail.privateemail.com",
    port,
    secure: port === 465,
    userDomain: process.env.CONTACT_SMTP_USER?.trim().split("@").at(-1) || "missing",
  };
}

function sanitizeSmtpError(error, port) {
  return {
    ...smtpConnectionDetails(port),
    transportCode: error?.code || "unknown",
    responseCode: error?.responseCode || null,
    command: error?.command || null,
  };
}

async function sendContactEmail(submission, submissionId, timestamp) {
  const smtpUser = process.env.CONTACT_SMTP_USER?.trim();
  if (!smtpUser || !process.env.CONTACT_SMTP_PASSWORD) {
    throw new Error("smtp_config_missing");
  }
  if (!ESCROWLESS_EMAIL_PATTERN.test(smtpUser)) {
    throw new Error("smtp_config_invalid_user");
  }

  const subject = `EscrowLess contact form submission — ${submission.category} — ${submissionId}`;
  const mail = {
    to: DESTINATION_EMAIL,
    from: { name: FROM_NAME, address: smtpUser },
    replyTo: submission.email,
    subject,
    text: buildEmailText(submission, submissionId, timestamp),
  };

  const configuredPort = Number(process.env.CONTACT_SMTP_PORT || 465);
  const primaryPort = Number.isFinite(configuredPort) ? configuredPort : 465;
  const primarySecure = primaryPort === 465;

  try {
    await createTransport(primaryPort, primarySecure).sendMail(mail);
  } catch (error) {
    if (primaryPort === 587 || process.env.CONTACT_SMTP_DISABLE_587_FALLBACK === "true") {
      error.safeSmtpDetails = sanitizeSmtpError(error, primaryPort);
      throw error;
    }
    try {
      await createTransport(587, false).sendMail(mail);
    } catch (fallbackError) {
      fallbackError.safeSmtpDetails = sanitizeSmtpError(fallbackError, 587);
      fallbackError.primarySmtpDetails = sanitizeSmtpError(error, primaryPort);
      throw fallbackError;
    }
  }
}

function classifyError(error) {
  if (error instanceof PublicInputError) return error.code;
  if (String(error?.message || "").includes("smtp_config")) return "smtp_config";
  if (String(error?.code || "").startsWith("E")) return "smtp_transport";
  return "contact_delivery_failed";
}

module.exports = async function contactHandler(req, res) {
  const submissionId = createSubmissionId();
  const timestamp = new Date().toISOString();
  const clientIp = getClientIp(req);

  try {
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }
    if (req.method !== "POST") {
      throw new PublicInputError(405, "Method not allowed.", "method_not_allowed");
    }
    if (!String(req.headers["content-type"] || "").toLowerCase().includes("application/json")) {
      throw new PublicInputError(415, "JSON is required.", "content_type_invalid");
    }

    validateHttps(req);
    validateOrigin(req);

    removeExpiredRateLimitEntries(ipRateLimit);
    removeExpiredRateLimitEntries(emailRateLimit);

    const ipLimit = applyRateLimit(ipRateLimit, clientIp, RATE_LIMITS.ip);
    if (!ipLimit.allowed) {
      res.setHeader("Retry-After", String(ipLimit.retryAfter));
      throw new PublicInputError(429, "Too many contact attempts. Please wait and try again.", "ip_rate_limited");
    }

    const payload = await readJsonBody(req);
    const submission = validatePayload(payload);

    if (submission.botSubmission) {
      console.info("contact_submission_accepted", { submissionId, timestamp, result: "honeypot" });
      sendJson(res, 200, { ok: true, submissionId });
      return;
    }

    const emailLimit = applyRateLimit(emailRateLimit, submission.email, RATE_LIMITS.email);
    if (!emailLimit.allowed) {
      res.setHeader("Retry-After", String(emailLimit.retryAfter));
      throw new PublicInputError(429, "Too many contact attempts. Please wait and try again.", "email_rate_limited");
    }

    await verifyBotToken(submission, clientIp);
    await sendContactEmail(submission, submissionId, timestamp);

    console.info("contact_submission_sent", {
      submissionId,
      timestamp,
      category: submission.category,
      result: "sent",
    });
    sendJson(res, 200, { ok: true, submissionId });
  } catch (error) {
    const statusCode = error instanceof PublicInputError ? error.statusCode : 500;
    console.warn("contact_submission_failed", {
      submissionId,
      timestamp,
      errorClass: classifyError(error),
      smtp: error?.safeSmtpDetails || null,
      primarySmtp: error?.primarySmtpDetails || null,
      result: "failed",
    });
    sendJson(res, statusCode, {
      ok: false,
      message: statusCode >= 500 ? "The message could not be sent right now." : error.publicMessage,
      submissionId,
    });
  }
};
