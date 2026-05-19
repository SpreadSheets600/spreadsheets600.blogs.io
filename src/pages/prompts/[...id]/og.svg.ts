import { getCollection, type CollectionEntry } from "astro:content";
import { generateOGImage } from "@lib/og";
import type { APIRoute, GetStaticPaths } from "astro";

export const getStaticPaths = (async () => {
  const posts = await getCollection("prompts");
  return posts
    .filter((post) => !post.data.draft)
    .map((post) => ({
      params: { id: post.id },
      props: post,
    }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const post = props as CollectionEntry<"prompts">;
  const svg = generateOGImage({
    title: post.data.title,
    type: "Prompt",
    tags: post.data.tags,
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
