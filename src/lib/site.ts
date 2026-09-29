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
  const url = `${siteOrigin}/${locale}${pathname}`;
  const image = `${siteOrigin}/${locale}/opengraph-image`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((language) => [language, `${siteOrigin}/${language}${pathname}`]),
        ),
        "x-default": `${siteOrigin}/en${pathname}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Persona",
      title,
      description,
      url,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
