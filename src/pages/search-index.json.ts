import type { APIRoute } from "astro";
import { buildSearchIndex } from "@/lib/search-index";

export const GET: APIRoute = async () => {
  const items = await buildSearchIndex("zh");
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
