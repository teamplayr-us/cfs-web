import type { MetadataRoute } from "next";
import { EVENTS } from "@/data/events";

const BASE = "https://collegeflagshowcase.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/sponsors`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE}/colleges`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE}/about`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE}/media`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...EVENTS.map((event) => ({
      url: `${BASE}/events/${event.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
