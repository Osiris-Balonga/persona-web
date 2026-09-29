import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { requireLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Playground" });
  return localizedMetadata(locale, "/playground", t("title"), t("description"));
}

export default async function PlaygroundPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations("Playground");
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t("eyebrow")}</p>
      <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{t("description")}</p>
      <Button asChild className="mt-8"><a href="https://github.com/Osiris-Balonga/persona/blob/dev/docs/api.md" target="_blank" rel="noreferrer">{t("guide")}</a></Button>
    </main>
  );
}
