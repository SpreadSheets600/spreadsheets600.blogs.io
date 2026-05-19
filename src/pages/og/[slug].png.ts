import { getCollection } from "astro:content";
import { generateOGImage } from "@lib/og";
import { SITE } from "@consts";
import sharp from "sharp";
import type { APIRoute, GetStaticPaths } from "astro";

type OGProps = {
  title: string;
  type: "Blog" | "Link" | "Prompt" | "Home";
  tags: string[];
};

export const getStaticPaths = (async () => {
  const [blog, links, prompts] = await Promise.all([
    getCollection("blog"),
    getCollection("links"),
    getCollection("prompts"),
  ]);

  const blogPaths = blog
    .filter((p) => !p.data.draft)
    .map((p) => ({
      params: { slug: `blog--${p.id}` },
      props: {
        title: p.data.title,
        type: "Blog" as const,
        tags: p.data.tags || [],
      } satisfies OGProps,
    }));

  const linkPaths = links
    .filter((p) => !p.data.draft)
    .map((p) => ({
      params: { slug: `link--${p.id}` },
      props: {
        title: p.data.title,
        type: "Link" as const,
        tags: p.data.tags || [],
      } satisfies OGProps,
    }));

  const promptPaths = prompts
    .filter((p) => !p.data.draft)
    .map((p) => ({
      params: { slug: `prompt--${p.id}` },
      props: {
        title: p.data.title,
        type: "Prompt" as const,
        tags: p.data.tags || [],
      } satisfies OGProps,
    }));

  const homePath = {
    params: { slug: "home" },
    props: {
      title: SITE.TITLE,
      type: "Home" as const,
      tags: [],
    } satisfies OGProps,
  };

  return [homePath, ...blogPaths, ...linkPaths, ...promptPaths];
}) satisfies GetStaticPaths;

export const GET: APIRoute<OGProps> = async ({ props }) => {
  const { title, type, tags } = props;

  const svg = generateOGImage({ title, type, tags });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
