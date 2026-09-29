import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import EnglishQuickstart from "@/content/en/quickstart.mdx";
import FrenchQuickstart from "@/content/fr/quickstart.mdx";
import EnglishPeople from "@/content/en/people.mdx";
import FrenchPeople from "@/content/fr/people.mdx";
import EnglishResponse from "@/content/en/response.mdx";
import FrenchResponse from "@/content/fr/response.mdx";
import EnglishErrors from "@/content/en/errors.mdx";
import FrenchErrors from "@/content/fr/errors.mdx";
import EnglishReplay from "@/content/en/replay.mdx";
import FrenchReplay from "@/content/fr/replay.mdx";
import { requireLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

const articles = {
  quickstart: { namespace: "Quickstart", en: EnglishQuickstart, fr: FrenchQuickstart },
  people: { namespace: "PeopleReference", en: EnglishPeople, fr: FrenchPeople },
  response: { namespace: "ResponseReference", en: EnglishResponse, fr: FrenchResponse },
  errors: { namespace: "ErrorsReference", en: EnglishErrors, fr: FrenchErrors },
  replay: { namespace: "ReplayReference", en: EnglishReplay, fr: FrenchReplay },
} as const;

function articleFor(slug: string) {
  if (!(slug in articles)) notFound();
  return articles[slug as keyof typeof articles];
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: value, slug } = await params;
  const locale = requireLocale(value);
  const article = articleFor(slug);
  const t = await getTranslations({ locale, namespace: article.namespace });
  return localizedMetadata(locale, `/docs/${slug}`, t("title"), t("description"));
}

export default async function DocArticle({ params }: Props) {
  const { locale: value, slug } = await params;
  const locale = requireLocale(value);
  setRequestLocale(locale);
  const article = articleFor(slug);
  const t = await getTranslations(article.namespace);
  const Article = article[locale];
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("description")}</p>
      <div className="prose prose-slate mt-10 max-w-none text-foreground prose-a:text-primary prose-code:break-words prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto"><Article /></div>
    </article>
  );
}
