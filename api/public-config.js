"use strict";

const PRODUCTION_HOSTS = new Set(["escrowless.net", "www.escrowless.net"]);

function hostFromRequest(req) {
  const forwardedHost = String(req.headers["x-forwarded-host"] || "");
  const host = forwardedHost.split(",")[0].trim() || String(req.headers.host || "").trim();
  return host.toLowerCase().replace(/:\d+$/, "");
}

module.exports = function publicConfigHandler(req, res) {
  const host = hostFromRequest(req);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  const turnstileRequired = process.env.VERCEL_ENV === "production" || PRODUCTION_HOSTS.has(host);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(
    `window.ESCROWLESS_PUBLIC_CONFIG = Object.freeze(${JSON.stringify({
      turnstileSiteKey: turnstileSiteKey || null,
      turnstileRequired,
      turnstileAction: "contact_form",
    })});\n`,
  );
};
