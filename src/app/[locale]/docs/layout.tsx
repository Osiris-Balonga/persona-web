import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("Docs");
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 md:grid-cols-[220px_minmax(0,1fr)] md:px-8">
      <aside>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("eyebrow")}</p>
        <nav aria-label={t("eyebrow")} className="flex flex-wrap gap-2 md:flex-col">
          <Link href="/docs" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{t("overview")}</Link>
          <Link href="/docs/quickstart" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{t("quickstart")}</Link>
          <Link href="/docs/people" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{t("people")}</Link>
          <Link href="/docs/response" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{t("response")}</Link>
          <Link href="/docs/errors" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{t("errors")}</Link>
          <Link href="/docs/replay" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{t("replay")}</Link>
        </nav>
      </aside>
      <main className="min-w-0 max-w-3xl">{children}</main>
    </div>
  );
}
