import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CoverageExplorer } from "@/components/coverage-explorer";
import { coverageSnapshot, coverageTotals } from "@/lib/coverage-data";
import { requireLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Coverage" });
  return localizedMetadata(locale, "/coverage", t("title"), t("description"));
}

export default async function CoveragePage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations("Coverage");
  return (
    <main className="w-full bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-9 md:px-8 md:pt-12">
        <p className="mb-3 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-[#7a8394]">
          {t("eyebrow")}
        </p>
        <h1 className="text-[clamp(2.35rem,4.7vw,3.6rem)] font-bold leading-[1.12] tracking-[-0.035em]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-4xl text-[0.95rem] leading-6 text-[#687082]">
          {t("description")}
        </p>
        <CoverageExplorer />
        <div className="mt-10 space-y-2 border-t border-[#e7eaf0] pt-5 text-xs leading-5 text-[#667083]">
          <p>
            {t("summary", {
              available: coverageTotals.available,
              pending: coverageTotals.pending,
              unavailable: coverageTotals.unavailable,
              postcodes: coverageTotals.postcodeCities,
              cities: coverageTotals.sampledCities,
            })}
          </p>
          <p>{t("caveat")}</p>
          <p>
            {t("snapshot", {
              date: coverageSnapshot.sourceDate,
              version: coverageSnapshot.dataVersion,
            })}{" "}
            <a
              className="font-medium text-primary underline-offset-2 hover:underline"
              href={`https://github.com/Osiris-Balonga/persona/blob/${coverageSnapshot.sourceCommit}/${coverageSnapshot.sourcePath}`}
              target="_blank"
              rel="noreferrer"
            >
              {t("source")}
            </a>{" "}
            · <code>{coverageSnapshot.sourceCommit.slice(0, 8)}</code>
          </p>
        </div>
      </div>
    </main>
  );
}
