"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Brand } from "@/components/brand";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const pathname = usePathname();

  if (pathname === "/coverage") {
    return (
      <footer className="border-t border-[#e9ebef] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-6 md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" aria-label="Persona">
              <Brand />
            </Link>
            <span className="hidden h-7 w-px bg-[#d8dce5] sm:block" />
            <span className="text-xs text-[#777f8f]">{t("tagline")}</span>
          </div>
          <nav
            aria-label={nav("menu")}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#596174]"
          >
            <Link href="/" className="hover:text-primary">
              {nav("product")}
            </Link>
            <Link href="/docs/quickstart" className="hover:text-primary">
              {nav("api")}
            </Link>
            <Link href="/coverage" className="hover:text-primary">
              {nav("coverage")}
            </Link>
            <Link href="/docs" className="hover:text-primary">
              {nav("docs")}
            </Link>
            <a
              href="https://github.com/Osiris-Balonga/persona"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Image src="/github.svg" alt="" width={21} height={21} />
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[#e9ebef] bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-9 px-5 pb-8 pt-9 text-xs md:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] md:gap-7 md:px-8">
        <div>
          <Link href="/" aria-label="Persona">
            <Brand />
          </Link>
          <p className="mt-1 pl-[42px] text-[#777f8f]">{t("tagline")}</p>
        </div>
        <div className="flex flex-col gap-2 text-[#777f8f]">
          <h2 className="font-semibold text-[#272b36]">{t("product")}</h2>
          <Link href="/" className="hover:text-primary">
            {t("overview")}
          </Link>
          <Link href="/playground" className="hover:text-primary">
            {t("useCases")}
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-[#777f8f]">
          <h2 className="font-semibold text-[#272b36]">API</h2>
          <Link href="/docs" className="hover:text-primary">
            {t("documentation")}
          </Link>
          <Link href="/coverage" className="hover:text-primary">
            {t("coverage")}
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-[#777f8f]">
          <h2 className="font-semibold text-[#272b36]">{t("resources")}</h2>
          <a
            href="https://github.com/Osiris-Balonga/persona"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://github.com/Osiris-Balonga/persona/releases"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            {t("changelog")}
          </a>
        </div>
        <a
          href="https://github.com/Osiris-Balonga/persona"
          target="_blank"
          rel="noreferrer"
          className="flex items-start gap-3 text-[#777f8f] hover:text-primary"
        >
          <Image src="/github.svg" alt="" width={22} height={22} />
          <span>
            <strong className="block font-semibold text-[#272b36]">
              {t("star")}
            </strong>
            {t("starDescription")}
          </span>
        </a>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-wrap justify-between gap-4 px-5 pb-5 text-[0.68rem] text-[#8a90a0] md:px-8">
        <span>© 2026 Persona. {t("rights")}</span>
        <span>{t("tagline")}</span>
      </div>
    </footer>
  );
}
