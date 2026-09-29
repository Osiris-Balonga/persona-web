import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import EnglishOverview from "@/content/en/overview.mdx";
import FrenchOverview from "@/content/fr/overview.mdx";
import { requireLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Docs" });
  return localizedMetadata(locale, "/docs", t("title"), t("description"));
}

export default async function DocsPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations("Docs");
  const Overview = locale === "fr" ? FrenchOverview : EnglishOverview;
  return (
    <>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t("eyebrow")}</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("description")}</p>
      <div className="prose prose-slate mt-10 max-w-none text-foreground prose-a:text-primary prose-code:break-words"><Overview /></div>
      <Link href="/docs/quickstart" className="mt-8 inline-block font-medium text-primary underline-offset-4 hover:underline">{t("readQuickstart")} →</Link>
    </>
  );
}
