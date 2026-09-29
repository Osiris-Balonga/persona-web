import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/brand";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><Link href="/" aria-label="Persona"><Brand /></Link><span>{t("tagline")}</span></div>
        <a className="hover:text-primary" href="https://github.com/Osiris-Balonga/persona" target="_blank" rel="noreferrer">{t("source")}</a>
      </div>
    </footer>
  );
}
