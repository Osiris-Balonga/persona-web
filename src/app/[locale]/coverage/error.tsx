"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const columns = [
  "columnCountry",
  "columnRegion",
  "columnProfiles",
  "columnPostcodes",
  "columnPhone",
  "columnAddresses",
  "columnNotes",
] as const;

export default function CoverageError({ reset }: { reset: () => void }) {
  const t = useTranslations("Coverage");

  const feedback = (
    <div className="flex min-h-80 flex-col items-center justify-center px-5 py-10 text-center">
      <Image
        src="/coverage-error.webp"
        alt=""
        width={319}
        height={240}
        className="h-auto w-36"
      />
      <h2 className="mt-1 text-lg font-semibold text-[#20242d]">
        {t("errorTitle")}
      </h2>
      <p className="mt-1 text-sm text-[#687082]">{t("errorDescription")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2636a9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("retry")}
      </button>
    </div>
  );

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
        <div className="mt-8 grid gap-3 opacity-60 sm:grid-cols-[minmax(230px,1fr)_repeat(2,minmax(150px,190px))] lg:grid-cols-[minmax(280px,1fr)_170px_170px_auto]">
          <input
            disabled
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
            className="h-10 border border-[#d9dde5] bg-white px-4 text-sm"
          />
          <select
            disabled
            aria-label={t("regionLabel")}
            className="h-10 border border-[#d9dde5] bg-white px-3 text-sm"
          >
            <option>{t("allRegions")}</option>
          </select>
          <select
            disabled
            aria-label={t("availabilityLabel")}
            className="h-10 border border-[#d9dde5] bg-white px-3 text-sm"
          >
            <option>{t("allAvailability")}</option>
          </select>
        </div>
        <div className="mt-6 hidden overflow-hidden border border-[#e2e6ec] lg:block">
          <table className="w-full border-collapse text-left text-[0.75rem]">
            <thead className="bg-[#f6f8fc] text-[#303746]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="border-b border-r border-[#e5e8ee] px-3 py-3 font-semibold last:border-r-0"
                  >
                    {t(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7}>{feedback}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 border border-[#e2e6ec] lg:hidden">{feedback}</div>
      </div>
    </main>
  );
}
