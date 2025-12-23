import { continentLabelKo } from "./labels.js";

export function metricValue(value) {
  if (value === null || value === undefined || value === "") return "정보 없음";
  return String(value);
}

export function formatScore(score) {
  const value = Number(score);
  if (!Number.isFinite(value)) return "정보 없음";
  return `${value.toFixed(1)}/5`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function placeholderSvgDataUrl({ title, subtitle }) {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <radialGradient id="glow" cx="55%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#60a5fa" stop-opacity="0.0"/>
    </radialGradient>
    <pattern id="p" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.2" fill="#93c5fd" opacity="0.22"/>
    </pattern>
  </defs>
  <rect width="1280" height="720" fill="url(#g)"/>
  <rect width="1280" height="720" fill="url(#glow)"/>
  <rect width="1280" height="720" fill="url(#p)" opacity="0.6"/>
  <g opacity="0.9">
    <text x="72" y="520" font-family="Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" font-size="64" font-weight="800" fill="#ffffff">${safeTitle}</text>
    <text x="72" y="585" font-family="Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" font-size="30" font-weight="600" fill="#dbeafe">${safeSubtitle}</text>
  </g>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function cityImageSrc(city) {
  if (city?.image) return city.image;
  const subtitleParts = [
    city?.country ?? "",
    continentLabelKo(city?.continent ?? ""),
  ].filter(Boolean);
  return placeholderSvgDataUrl({
    title: city?.name ?? "도시",
    subtitle: subtitleParts.join(" · "),
  });
}
