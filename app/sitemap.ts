import type { MetadataRoute } from "next";

import { createAbsoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/timeline", "/recommendations"].map((path) => ({
    url: createAbsoluteUrl(path),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
    lastModified: new Date()
  }));
}
