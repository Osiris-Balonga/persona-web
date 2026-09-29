import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PersonaSlider } from "@/components/persona-slider";
import { requireLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  return localizedMetadata(locale, "", t("title"), t("description"));
}

const benefits = [
  { key: "keyless", imagePosition: "0%" },
  { key: "seed", imagePosition: "33.333%" },
  { key: "coverage", imagePosition: "66.667%" },
  { key: "portraits", imagePosition: "100%" },
] as const;

export default async function Home({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="bg-white">
      <section className="mx-auto grid w-full max-w-7xl items-center gap-7 px-5 pb-9 pt-8 md:grid-cols-[1fr_1fr] md:px-8 md:pb-7 md:pt-7 lg:gap-10">
        <div className="max-w-[570px]">
          <p className="mb-5 text-[0.64rem] font-medium uppercase tracking-[0.28em] text-[#4d5675]">{t("eyebrow")}</p>
          <h1 className="max-w-[620px] text-[clamp(2.65rem,4.4vw,4rem)] font-bold leading-[1.08] tracking-[-0.035em] text-foreground">
            {t("titleStart")} <span className="text-primary">{t("titleBlue")}</span> <span className="text-[#19c991]">{t("titleGreen")}</span>
          </h1>
          <p className="mt-4 max-w-[490px] text-[0.96rem] leading-[1.55] text-[#687082]">{t("description")}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="h-10 min-w-35 rounded-none px-5 text-xs">
              <Link href="/docs">{t("readDocs")} <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline" className="h-10 min-w-35 rounded-none border-[#323745] px-5 text-xs">
              <Link href="/playground">{t("tryApi")} <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
          <p className="mt-3 text-[0.68rem] text-[#8b92a0]">{t("note")}</p>
        </div>
        <PersonaSlider locale={locale} label={t("sliderLabel")} loading={t("sliderLoading")} error={t("sliderError")} retry={t("sliderRetry")} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-9 pt-5 md:px-8" aria-label={t("benefitsLabel")}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {benefits.map(({ key, imagePosition }) => (
            <div key={key} className="flex min-w-0 items-center gap-3">
              <div aria-hidden="true" className="h-28 w-[42%] shrink-0 bg-no-repeat sm:h-32 lg:h-28" style={{ backgroundImage: "url('/benefits-strip.png')", backgroundSize: "400% auto", backgroundPosition: `${imagePosition} center` }} />
              <div className="min-w-0">
                <h2 className="text-[0.79rem] font-semibold leading-5 text-[#1f222c]">{t(`${key}Title`)}</h2>
                <p className="mt-1 text-[0.7rem] leading-[1.5] text-[#767e8e]">{t(`${key}Description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
