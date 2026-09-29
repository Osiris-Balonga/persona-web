import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UseCases } from "@/components/use-cases/use-cases";
import { requireLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/site";
import { resolveUseCaseCountry } from "@/lib/use-case-people";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "UseCases" });
  return localizedMetadata(
    locale,
    "/use-cases",
    t("metadataTitle"),
    t("metadataDescription"),
  );
}

export default async function UseCasesPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const country = resolveUseCaseCountry(
    (await headers()).get("x-vercel-ip-country"),
  );
  return <UseCases locale={locale} country={country} />;
}
