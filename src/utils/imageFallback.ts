import { EventCategory } from '../types/campus';

/**
 * Generates an offline-safe SVG data URL with high-contrast geometric collegiate graphics.
 */
export function getGeometricBannerFallback(title: string, category: EventCategory): string {
  const bgColors: Record<EventCategory, string> = {
    Technical: '#1e3a8a',
    Cultural: '#581c87',
    Workshop: '#78350f',
    Competition: '#881337',
    Seminar: '#064e3b',
  };

  const bg = bgColors[category] || '#0f172a';
  const cleanTitle = title.replace(/[<>&"]/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="800" height="400" fill="url(#g)" />
    <rect width="800" height="400" fill="url(#grid)" />
    <circle cx="700" cy="80" r="140" fill="rgba(255,255,255,0.04)" />
    <circle cx="100" cy="320" r="180" fill="rgba(255,255,255,0.03)" />
    <rect x="50" y="50" width="120" height="28" rx="6" fill="rgba(255,255,255,0.15)" />
    <text x="110" y="69" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1">${category.toUpperCase()}</text>
    <text x="50" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="800">${cleanTitle.slice(0, 36)}</text>
    <text x="50" y="195" fill="rgba(255,255,255,0.75)" font-family="system-ui, sans-serif" font-size="14" font-weight="500">IIIT Manipur Campus Event</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
