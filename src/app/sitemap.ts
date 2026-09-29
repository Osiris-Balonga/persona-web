import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteOrigin } from "@/lib/site";

const paths = ["", "/docs", "/docs/quickstart", "/playground", "/coverage"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteOrigin}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((language) => [
            language,
            `${siteOrigin}/${language}${path}`,
          ]),
        ),
      },
    })),
  );
}
