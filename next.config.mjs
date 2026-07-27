/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

// CSP grows as modules add browser-direct connections (M07 Binance WS, M08 AISStream — pre-whitelisted).
const cspDirectives = {
  "default-src": ["'self'"],
  // Next.js requires 'unsafe-inline'/'unsafe-eval' for dev HMR and styled-jsx; tightened in M13.
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://s3.tradingview.com"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "connect-src": [
    "'self'",
    "wss://stream.binance.com:9443",
    "wss://stream.aisstream.io",
    "https://*.googleapis.com",
    "wss://*.googleapis.com",
    "https://*.firebaseio.com",
    "wss://*.firebaseio.com",
    "https://*.firebaseapp.com",
  ],
  "frame-src": ["https://s.tradingview.com", "https://*.tradingview.com", "https://www.youtube-nocookie.com"],
  "worker-src": ["'self'", "blob:"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  ...(isProd ? { "upgrade-insecure-requests": [] } : {}),
};

const csp = Object.entries(cspDirectives)
  .map(([key, values]) => (values.length ? `${key} ${values.join(" ")}` : key))
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // microphone reserved for the M12 voice assistant
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "a.basemaps.cartocdn.com" },
      { protocol: "https", hostname: "b.basemaps.cartocdn.com" },
      { protocol: "https", hostname: "c.basemaps.cartocdn.com" },
      { protocol: "https", hostname: "d.basemaps.cartocdn.com" },
      { protocol: "https", hostname: "tile.openstreetmap.org" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;