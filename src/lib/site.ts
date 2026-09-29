import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteOrigin = (
  configuredOrigin ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/$/, "");

export function localizedMetadata(
  locale: Locale,
  pathname: string,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${pathname}`,
      languages: Object.fromEntries(
        routing.locales.map((language) => [language, `/${language}${pathname}`]),
      ),
    },
  };
}
