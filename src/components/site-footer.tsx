"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");

  return (
    <footer className="border-t border-[#e9ebef] bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-6 md:px-8">
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/" aria-label="Persona"><Brand /></Link>
          <span className="hidden h-7 w-px bg-[#d8dce5] sm:block" />
          <span className="text-xs text-[#777f8f]">{t("tagline")}</span>
        </div>
        <nav aria-label={nav("menu")} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#596174]">
          <Link href="/coverage" className="hover:text-primary">{nav("coverage")}</Link>
          <Link href="/docs" className="hover:text-primary">{nav("docs")}</Link>
          <a href="https://github.com/Osiris-Balonga/persona" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Image src="/github.svg" alt="" width={21} height={21} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
