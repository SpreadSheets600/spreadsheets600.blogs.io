interface OGOptions {
  title: string;
  type: "Blog" | "Link" | "Prompt" | "Home";
  tags?: string[];
  description?: string;
}

const FONT_STACK = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

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

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const PALETTES = [
  ["#FF0080", "#7928CA", "#FF0080"],
  ["#00DFD8", "#007CF0", "#00DFD8"],
  ["#FF4D4D", "#F9CB28", "#FF4D4D"],
  ["#00F260", "#0575E6", "#00F260"],
  ["#8A2387", "#E94057", "#F27121"],
  ["#4158D0", "#C850C0", "#FFCC70"],
  ["#0093E9", "#80D0C7", "#0093E9"],
  ["#85FFBD", "#FFFB7D", "#85FFBD"],
  ["#fa709a", "#fee140", "#fa709a"],
];

function getDynamicBlobs(title: string): string {
  const hash = stringToHash(title);
  const colors = PALETTES[hash % PALETTES.length];
  
  // Deterministic random positions based on hash
  const cx1 = 150 + (hash % 300);
  const cy1 = 100 + ((hash >> 2) % 200);
  const r1 = 300 + ((hash >> 4) % 150);

  const cx2 = 800 + ((hash >> 6) % 300);
  const cy2 = 400 + ((hash >> 8) % 200);
  const r2 = 350 + ((hash >> 10) % 150);

  const cx3 = 600 + ((hash >> 12) % 200) * (hash % 2 === 0 ? 1 : -1);
  const cy3 = 250 + ((hash >> 14) % 200);
  const r3 = 250 + ((hash >> 16) % 150);

  return `
    <circle cx="${cx1}" cy="${cy1}" r="${r1}" fill="${colors[0]}" opacity="0.65" filter="url(#blur)" />
    <circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="${colors[1]}" opacity="0.65" filter="url(#blur)" />
    <circle cx="${cx3}" cy="${cy3}" r="${r3}" fill="${colors[2] || colors[0]}" opacity="0.5" filter="url(#blur)" />
  `;
}

function getTypeIcon(type: string): string {
  switch (type) {
    case "Blog":
      return `<svg width="20" height="20" viewBox="0 0 256 256" fill="none"><path d="M88 176h80M88 128h80M88 80h48" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M160 40h40a8 8 0 0 1 8 8v160a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h40" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case "Link":
      return `<svg width="20" height="20" viewBox="0 0 256 256" fill="none"><path d="M132 96h24a36 36 0 0 1 0 72h-24M124 160h-24a36 36 0 0 1 0-72h24" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M92 128h72" stroke="currentColor" stroke-width="16" stroke-linecap="round"/></svg>`;
    case "Prompt":
      return `<svg width="20" height="20" viewBox="0 0 256 256" fill="none"><polyline points="96 64 160 128 96 192" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    default:
      return `<svg width="20" height="20" viewBox="0 0 256 256" fill="none"><path d="M128 48v160M48 128h160" stroke="currentColor" stroke-width="16" stroke-linecap="round"/></svg>`;
  }
}

export function generateOGImage(options: OGOptions): string {
  const { title, type, tags = [], description } = options;
  const escapedTitle = escapeXml(title);
  const escapedDesc = description ? escapeXml(description) : "";

  let maxChars = 28;
  let titleFontSize = 72;
  let lineHeight = 88;

  if (title.length > 50) {
    maxChars = 38;
    titleFontSize = 54;
    lineHeight = 68;
  }

  const wrappedTitle = wrapText(escapedTitle, maxChars);
  const titleLines = wrappedTitle.split("\n").slice(0, 4);

  const titleY = titleLines.length >= 3 ? 200 : 250;

  const typeColors: Record<string, string> = {
    Blog: "#60a5fa",
    Link: "#a78bfa",
    Prompt: "#34d399",
    Home: "#fbbf24",
  };
  const accent = typeColors[type] || "#ffffff";

  // Use string interpolation properly, escaping any SVG backticks or dollars that aren't variables
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="100" />
    </filter>
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="rgba(255,255,255,0.12)" />
    </pattern>
    <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)" />
    </linearGradient>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E4E4E7" />
    </linearGradient>
  </defs>

  <!-- Base dark background -->
  <rect width="1200" height="630" fill="#09090b" />

  <!-- Colorful blurred blobs -->
  ${getDynamicBlobs(title)}

  <!-- Dot pattern overlay -->
  <rect width="1200" height="630" fill="url(#dots)" />

  <!-- Main Glass Card -->
  <g>
    <!-- Dark semi-transparent base for readability -->
    <rect x="60" y="60" width="1080" height="510" rx="32" fill="rgba(9, 9, 11, 0.65)" />
    <!-- Glass sheen -->
    <rect x="60" y="60" width="1080" height="510" rx="32" fill="url(#glassGradient)" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
    
    <!-- Accent Top Line -->
    <rect x="110" y="60" width="120" height="3" fill="${accent}" />
    
    <!-- Header / Type Badge -->
    <g transform="translate(120, 120)">
      <rect x="0" y="0" width="130" height="36" rx="18" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-opacity="0.3" stroke-width="1" />
      <g transform="translate(14, 8)" color="${accent}">${getTypeIcon(type)}</g>
      <text x="42" y="24" font-family="${FONT_STACK}" font-size="15" font-weight="600" fill="${accent}" letter-spacing="1.5">${type.toUpperCase()}</text>
    </g>

    <!-- Site Branding -->
    <text x="1020" y="142" font-family="${FONT_STACK}" font-size="20" font-weight="600" fill="rgba(255,255,255,0.4)" text-anchor="end" letter-spacing="1">SpreadSheets600</text>

    <!-- Title -->
    <g transform="translate(120, ${titleY})">
      ${titleLines
        .map(
          (line, i) =>
            `<text x="0" y="${i * lineHeight}" font-family="${FONT_STACK}" font-size="${titleFontSize}" font-weight="800" fill="url(#textGradient)" letter-spacing="-0.02em">${line}</text>`
        )
        .join("\\n      ")}
    </g>

    <!-- Description (Home only usually) -->
    ${
      escapedDesc && type === "Home"
        ? `<text x="120" y="${titleY + titleLines.length * lineHeight + 10}" font-family="${FONT_STACK}" font-size="28" font-weight="400" fill="rgba(255,255,255,0.6)" width="840">${wrapText(escapedDesc, 70).split("\\n")[0]}</text>`
        : ""
    }

    <!-- Tags -->
    ${
      tags.length > 0
        ? `<g transform="translate(120, 480)">
        ${tags
          .slice(0, 5)
          .map((tag, i) => {
            const tagW = tag.length * 10 + 32;
            const xPos = i > 0 ? tags.slice(0, i).reduce((sum, t) => sum + t.length * 10 + 32 + 16, 0) : 0;
            return `
          <g transform="translate(${xPos}, 0)">
            <rect x="0" y="0" width="${tagW}" height="32" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <text x="${tagW / 2}" y="21" font-family="${FONT_STACK}" font-size="14" font-weight="500" fill="rgba(255,255,255,0.7)" text-anchor="middle">${escapeXml(tag)}</text>
          </g>`;
          })
          .join("")}
      </g>`
        : ""
    }
  </g>
</svg>`;
}
