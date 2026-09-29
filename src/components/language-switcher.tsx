"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")} className="flex items-center gap-1 text-xs font-semibold">
      {routing.locales.map((language) => (
        <Link
          key={language}
          href={pathname}
          locale={language}
          aria-current={locale === language ? "true" : undefined}
          className="rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground aria-[current=true]:bg-secondary aria-[current=true]:text-primary"
        >
          {language.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
