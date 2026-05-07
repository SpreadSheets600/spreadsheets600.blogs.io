import rss from "@astrojs/rss";
import { SITE } from "@consts";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blog = (await getCollection("blog")).filter((post) => !post.data.draft);

  const links = (await getCollection("links")).filter(
    (link) => !link.data.draft,
  );

  const prompts = (await getCollection("prompts")).filter(
    (prompt) => !prompt.data.draft,
  );

  const items = [...blog, ...links, ...prompts].sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );

  return rss({
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    site: context.site,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      link: `/${item.collection}/${item.id}/`,
    })),
  });
}

