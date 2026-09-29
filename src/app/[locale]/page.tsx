import type { Metadata } from "next";
import { ArrowRight, Braces, Globe2, RotateCcw } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ExamplePortrait } from "@/components/example-portrait";
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
    <main className="overflow-hidden bg-white">
      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-18 pt-16 md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:px-8 md:pb-24 md:pt-24 lg:gap-14 lg:pt-16">
        <div className="relative z-10 max-w-[660px]">
          <p className="mb-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">{t("eyebrow")}</p>
          <h1 className="text-[clamp(2.7rem,5.4vw,4.75rem)] font-bold leading-[1.08] tracking-[-0.055em] text-foreground">
            {t("titleStart")} <span className="text-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="mt-7 max-w-[575px] text-[0.98rem] leading-7 text-muted-foreground sm:text-[1.08rem] sm:leading-8">{t("description")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 rounded-sm px-6 text-sm">
              <Link href="/docs">{t("readDocs")} <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 rounded-sm border-foreground/70 px-6 text-sm">
              <Link href="/playground">{t("tryApi")} <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">{t("note")}</p>
        </div>

        <div className="relative mx-auto h-[430px] w-full max-w-[550px] sm:h-[500px] md:h-[475px] lg:h-[530px]" aria-label={t("exampleLabel")}>
          <div aria-hidden="true" className="absolute left-[7%] top-[13%] h-[78%] w-[76%] bg-[#eaf0ff]" />
          <div aria-hidden="true" className="absolute right-[2%] top-[3%] h-[28%] w-[29%] bg-[#e7fff6]" />
          <div aria-hidden="true" className="absolute left-[3%] top-[25%] w-[43%] -rotate-6 border border-[#e0e5f2] bg-white p-3 shadow-[0_6px_16px_#1d34710f] sm:p-4">
            <div className="mb-5 h-17 bg-[#dce4fa] sm:h-22" />
            <div className="h-2 w-3/4 bg-[#d6ddec]" />
            <div className="mt-2 h-2 w-1/2 bg-[#edf0f6]" />
            <div className="mt-5 h-1.5 w-full bg-[#edf0f6]" />
            <div className="mt-2 h-1.5 w-4/5 bg-[#edf0f6]" />
          </div>
          <div aria-hidden="true" className="absolute bottom-[4%] right-[1%] w-[43%] rotate-5 border border-[#e0e5f2] bg-white p-3 shadow-[0_6px_16px_#1d34710f] sm:p-4">
            <Braces aria-hidden="true" className="mb-4 size-5 text-primary" />
            <div className="space-y-2.5">
              <div className="h-1.5 w-[70%] bg-[#dce4fa]" />
              <div className="h-1.5 w-[88%] bg-[#e8edfa]" />
              <div className="h-1.5 w-[64%] bg-[#dce4fa]" />
              <div className="h-1.5 w-[76%] bg-[#e8edfa]" />
              <div className="h-1.5 w-[48%] bg-[#dce4fa]" />
            </div>
          </div>
          <div className="absolute left-[19%] top-[3%] w-[65%] border border-[#e4e8f0] bg-white p-3 shadow-[0_8px_24px_#1d347119] sm:p-4">
            <ExamplePortrait alt={t("portraitAlt")} />
            <div className="pt-4 sm:pt-5">
              <p className="text-lg font-semibold tracking-tight sm:text-xl">Christian Arnaud</p>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">33 · {t("exampleNationality")}</p>
              <p className="mt-3 text-xs text-muted-foreground sm:text-sm">Brazzaville, Congo</p>
            </div>
          </div>
          <span aria-hidden="true" className="absolute bottom-[7%] left-[9%] size-2 rounded-full bg-primary" />
        </div>
      </section>

      <section className="border-y border-border bg-[#f7f9fe]" aria-label={t("benefitsLabel")}>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3 md:gap-0 md:px-8 md:py-14">
          <div className="md:pr-8">
            <Braces aria-hidden="true" className="mb-5 size-6 text-primary" />
            <h2 className="text-base font-semibold">{t("keylessTitle")}</h2>
            <p className="mt-2 max-w-[320px] text-sm leading-6 text-muted-foreground">{t("keylessDescription")}</p>
          </div>
          <div className="border-t border-border pt-7 md:border-l md:border-t-0 md:px-8 md:pt-0">
            <RotateCcw aria-hidden="true" className="mb-5 size-6 text-primary" />
            <h2 className="text-base font-semibold">{t("seedTitle")}</h2>
            <p className="mt-2 max-w-[320px] text-sm leading-6 text-muted-foreground">{t("seedDescription")}</p>
          </div>
          <div className="border-t border-border pt-7 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <Globe2 aria-hidden="true" className="mb-5 size-6 text-primary" />
            <h2 className="text-base font-semibold">{t("coverageTitle")}</h2>
            <p className="mt-2 max-w-[320px] text-sm leading-6 text-muted-foreground">{t("coverageDescription")}</p>
            <Link href="/coverage" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">{t("exploreCoverage")} <ArrowRight aria-hidden="true" className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[1fr_auto] md:items-center md:px-8 md:py-20">
        <div>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{t("closingTitle")}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{t("closingDescription")}</p>
          <a className="mt-2 inline-block text-xs text-primary underline-offset-4 hover:underline" href="https://github.com/Osiris-Balonga/persona/blob/dev/docs/beta-coverage.md" target="_blank" rel="noreferrer">{t("auditSource")}</a>
        </div>
        <Button asChild size="lg" className="h-11 w-fit rounded-sm px-6"><Link href="/docs/quickstart">{t("quickstart")} <ArrowRight aria-hidden="true" /></Link></Button>
      </section>
    </main>
  );
}
