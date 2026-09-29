"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "home" },
  { href: "/docs", label: "docs" },
  { href: "/coverage", label: "coverage" },
  { href: "/playground", label: "playground" },
] as const;

export function SiteHeader() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" aria-label={`Persona — ${t("home")}`} className="flex items-center gap-2.5 text-base font-bold tracking-tight">
          <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-sm bg-primary text-sm font-bold text-white shadow-[inset_7px_0_0_#2ee6a6]">P</span>
          PERSONA
        </Link>

        <nav aria-label={t("menu")} className="hidden items-center gap-7 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href || (href === "/docs" && pathname.startsWith("/docs/")) ? "page" : undefined}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary aria-[current=page]:text-primary"
            >
              {t(label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button asChild variant="outline" size="sm">
            <a href="https://github.com/Osiris-Balonga/persona" target="_blank" rel="noreferrer">
              {t("github")} <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label={t("menu")} variant="ghost" size="icon" className="md:hidden">
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent showCloseButton={false} className="md:hidden">
            <SheetHeader className="flex-row items-center justify-between border-b border-border">
              <SheetTitle>PERSONA</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon-sm" aria-label={t("closeMenu")}><X aria-hidden="true" /></Button>
              </SheetClose>
            </SheetHeader>
            <nav aria-label={t("menu")} className="flex flex-col gap-2 px-4">
              {links.map(({ href, label }) => (
                <SheetClose asChild key={href}>
                  <Link href={href} className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted">{t(label)}</Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex items-center justify-between border-t border-border p-4">
              <LanguageSwitcher />
              <a className="text-sm font-medium text-primary" href="https://github.com/Osiris-Balonga/persona" target="_blank" rel="noreferrer">{t("github")}</a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
