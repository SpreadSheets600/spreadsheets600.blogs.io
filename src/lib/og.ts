interface OGOptions {
  title: string;
  type: "Blog" | "Link" | "Prompt" | "Home";
  tags?: string[];
  description?: string;
}

const FONT_STACK =
  "'Poppins', 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.join("\n");
}

function getTypeIcon(type: string): string {
  switch (type) {
    case "Blog":
      return `<svg width="24" height="24" viewBox="0 0 256 256" fill="none"><rect width="256" height="256" rx="48" fill="rgba(255,255,255,0.1)"/><path d="M88 176h80M88 128h80M88 80h48" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M160 40h40a8 8 0 0 1 8 8v160a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h40" stroke="rgba(255,255,255,0.6)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
    case "Link":
      return `<svg width="24" height="24" viewBox="0 0 256 256" fill="none"><rect width="256" height="256" rx="48" fill="rgba(255,255,255,0.1)"/><path d="M132 96h24a36 36 0 0 1 0 72h-24M124 160h-24a36 36 0 0 1 0-72h24" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M92 128h72" stroke="rgba(255,255,255,0.6)" stroke-width="12" stroke-linecap="round" fill="none"/></svg>`;
    case "Prompt":
      return `<svg width="24" height="24" viewBox="0 0 256 256" fill="none"><rect width="256" height="256" rx="48" fill="rgba(255,255,255,0.1)"/><polyline points="96 64 160 128 96 192" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
    default:
      return `<svg width="24" height="24" viewBox="0 0 256 256" fill="none"><rect width="256" height="256" rx="48" fill="rgba(255,255,255,0.1)"/><path d="M128 48v160M48 128h160" stroke="white" stroke-width="12" stroke-linecap="round" fill="none"/></svg>`;
  }
}

export function generateOGImage(options: OGOptions): string {
  const { title, type, tags = [], description } = options;
  const escapedTitle = escapeXml(title);
  const escapedDesc = description ? escapeXml(description) : "";

  const typeColors: Record<string, { badge: string; accent: string }> = {
    Blog: { badge: "#3b82f6", accent: "#60a5fa" },
    Link: { badge: "#8b5cf6", accent: "#a78bfa" },
    Prompt: { badge: "#10b981", accent: "#34d399" },
    Home: { badge: "#f59e0b", accent: "#fbbf24" },
  };

  const { badge, accent } = typeColors[type];

  // Wrap title to fit within ~25 chars per line max for OG image
  const wrappedTitle = wrapText(escapedTitle, 28);
  const titleLines = wrappedTitle.split("\n");
  const titleFontSize = titleLines.length <= 2 ? 56 : 48;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="50%" stop-color="#0f0f1a"/>
      <stop offset="100%" stop-color="#14142a"/>
    </linearGradient>
    <linearGradient id="glow1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${badge}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="glow2" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${badge}" stop-opacity="0.02"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${badge}"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
    <clipPath id="rounded">
      <rect width="1200" height="630" rx="0"/>
    </clipPath>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.04"/>
      </feComponentTransfer>
    </filter>
  </defs>

  <g clip-path="url(#rounded)">
    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGrad)"/>

    <!-- Noise overlay -->
    <rect width="1200" height="630" filter="url(#noise)" opacity="0.5"/>

    <!-- Glow orbs -->
    <circle cx="200" cy="200" r="300" fill="url(#glow1)"/>
    <circle cx="1000" cy="450" r="250" fill="url(#glow2)"/>

    <!-- Grid pattern -->
    <g stroke="rgba(255,255,255,0.03)" stroke-width="1" fill="none">
      ${Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 52.5}" x2="1200" y2="${i * 52.5}"/>`).join("\n      ")}
      ${Array.from({ length: 25 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="630"/>`).join("\n      ")}
    </g>

    <!-- Accent line top -->
    <rect x="0" y="0" width="1200" height="4" fill="url(#accentLine)"/>

    <!-- Type badge -->
    <g transform="translate(48, 48)">
      <rect x="0" y="0" width="176" height="48" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <g transform="translate(14, 12)">${getTypeIcon(type)}</g>
      <text x="48" y="31" font-family="${FONT_STACK}" font-size="18" font-weight="600" fill="white">${type}</text>
    </g>

    <!-- Site name -->
    <text x="1104" y="78" font-family="${FONT_STACK}" font-size="16" font-weight="500" fill="rgba(255,255,255,0.4)" text-anchor="end">SpreadSheets600</text>

    <!-- Title -->
    <g transform="translate(80, 240)">
      ${titleLines
        .map(
          (line, i) =>
            `<text x="0" y="${i * (titleFontSize + 8)}" font-family="${FONT_STACK}" font-size="${titleFontSize}" font-weight="700" fill="white">${line}</text>`,
        )
        .join("\n      ")}
    </g>

    <!-- Description if present -->
    ${
      escapedDesc && type === "Home"
        ? `<text x="80" y="400" font-family="${FONT_STACK}" font-size="22" font-weight="400" fill="rgba(255,255,255,0.6)" width="1040">${wrapText(escapedDesc, 80).split("\n")[0]}</text>`
        : ""
    }

    <!-- Tags -->
    ${
      tags.length > 0
        ? `<g transform="translate(80, ${Math.max(380, 240 + titleLines.length * (titleFontSize + 8) + 40)})">
        ${tags
          .slice(0, 4)
          .map((tag, i) => {
            const tagW = tag.length * 12 + 32;
            const xPos = i > 0 ? tags.slice(0, i).reduce((sum, t) => sum + t.length * 12 + 32 + 10, 0) : 0;
            return `
          <g transform="translate(${xPos}, 0)">
            <rect x="0" y="0" width="${tagW}" height="34" rx="17" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <text x="${tagW / 2}" y="23" font-family="${FONT_STACK}" font-size="15" font-weight="500" fill="rgba(255,255,255,0.85)" text-anchor="middle">${escapeXml(tag)}</text>
          </g>`;
          })
          .join("")}
      </g>`
        : ""
    }

    <!-- Decorative bottom accent -->
    <rect x="48" y="570" width="200" height="2" rx="1" fill="rgba(255,255,255,0.08)"/>
    <circle cx="268" cy="571" r="3" fill="rgba(255,255,255,0.12)"/>
    <circle cx="280" cy="571" r="2" fill="rgba(255,255,255,0.06)"/>
  </g>
</svg>`;
}
