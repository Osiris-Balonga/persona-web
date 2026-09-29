import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import EnglishQuickstart from "@/content/en/quickstart.mdx";
import FrenchQuickstart from "@/content/fr/quickstart.mdx";
import { requireLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [{ slug: "quickstart" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value, slug } = await params;
  if (slug !== "quickstart") notFound();
  const locale = requireLocale(value);
  const t = await getTranslations({ locale, namespace: "Quickstart" });
  return localizedMetadata(locale, "/docs/quickstart", t("title"), t("description"));
}

export default async function DocArticle({ params }: Props) {
  const { locale: value, slug } = await params;
  if (slug !== "quickstart") notFound();
  const locale = requireLocale(value);
  setRequestLocale(locale);
  const t = await getTranslations("Quickstart");
  const Article = locale === "fr" ? FrenchQuickstart : EnglishQuickstart;
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("description")}</p>
      <div className="prose prose-slate mt-10 max-w-none text-foreground prose-a:text-primary prose-pre:overflow-x-auto"><Article /></div>
    </article>
  );
}
