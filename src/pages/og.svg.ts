import type { APIRoute } from "astro";
import { generateOGImage } from "@lib/og";
import { SITE } from "@consts";

export const GET: APIRoute = async () => {
  const svg = generateOGImage({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    type: "Home",
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
