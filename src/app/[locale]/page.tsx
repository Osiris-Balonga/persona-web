import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { requireLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  return localizedMetadata(locale, "", t("title"), t("description"));
}

export default async function Home({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="mx-auto flex min-h-[calc(100vh-190px)] w-full max-w-7xl flex-col justify-center px-5 py-20 md:px-8">
      <div className="max-w-3xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">{t("eyebrow")}</p>
        <h1 className="text-4xl font-bold leading-[1.13] tracking-tight sm:text-6xl">{t("title")}</h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{t("description")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href="/docs">{t("readDocs")} <ArrowRight aria-hidden="true" /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/playground">{t("tryApi")}</Link></Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">{t("note")}</p>
      </div>
    </main>
  );
}
