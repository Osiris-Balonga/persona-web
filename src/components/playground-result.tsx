"use client";

import { Check, ChevronLeft, ChevronRight, Copy, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { countryDisplayName } from "@/lib/country-display-name";
import type { PlaygroundPerson, PlaygroundResponse } from "@/lib/playground-response";

type Props = {
  response: PlaygroundResponse | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

function Portrait({ person, className, eager = false }: { person: PlaygroundPerson; className: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const photo = person.picture?.medium ?? person.picture?.large ?? person.picture?.thumbnail;
  const initials = (person.name?.full ?? `${person.name?.first ?? ""} ${person.name?.last ?? ""}`).trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
  return <div className={`relative overflow-hidden bg-[#edf1f8] ${className}`}>{photo && !failed ? <Image src={photo} alt="" fill sizes="(max-width: 640px) 100vw, 320px" loading={eager ? "eager" : "lazy"} className="object-cover object-top" onError={() => setFailed(true)} /> : <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-primary/40">{initials || "P"}</span>}</div>;
}

function Profile({ person }: { person: PlaygroundPerson }) {
  const t = useTranslations("Playground");
  const locale = useLocale();
  const countryCode = person.location?.country?.code;
  const country = countryCode ? countryDisplayName(countryCode, locale, person.location?.country?.name) : person.location?.country?.name;
  const nationality = person.nationality ? countryDisplayName(person.nationality, locale) : null;
  const residence = [person.location?.city, country].filter(Boolean).join(", ") || person.location?.formatted;
  const name = person.name?.full || [person.name?.first, person.name?.last].filter(Boolean).join(" ") || t("unnamed");
  const formattedPhone = person.phone ? parsePhoneNumberFromString(person.phone)?.formatInternational() ?? person.phone : null;

  return <article className="grid min-h-48 border border-[#e6e9ef] bg-white sm:grid-cols-[minmax(150px,36%)_1fr]">
    <Portrait person={person} eager className="aspect-[1.25] sm:aspect-auto sm:h-full" />
    <div className="min-w-0 px-5 py-4">
      <div className="flex items-start justify-between gap-3"><h3 className="truncate text-lg font-semibold tracking-tight" title={name}>{name}</h3>{person.id && <span className="max-w-28 truncate pt-1 text-[0.65rem] text-[#929aab]" title={person.id}>ID {person.id}</span>}</div>
      {(person.dob?.age !== undefined || person.gender) && <p className="mt-0.5 text-xs text-[#7a8294]">{person.dob?.age !== undefined && `${person.dob.age} ${t("ageUnit")}`}{person.dob?.age !== undefined && person.gender && " · "}{person.gender && t(person.gender === "female" ? "female" : person.gender === "male" ? "male" : "other")}</p>}
      {nationality && <p className="mt-4 flex items-center gap-2 text-xs text-[#404b6c]">{person.nationality?.length === 2 && <span className={`fi fi-${person.nationality.toLowerCase()} text-base`} aria-hidden="true" />}<span>{nationality}</span></p>}
      {residence && <p className="mt-3 flex items-start gap-2 text-xs text-[#404b6c]"><MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" /><span>{residence}</span></p>}
      {person.email && <p className="mt-3 flex items-start gap-2 break-all border-t border-[#e9ecf1] pt-3 text-xs text-[#404b6c]"><Mail className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />{person.email}</p>}
      {formattedPhone && <p className="mt-2 flex items-start gap-2 text-xs text-[#404b6c]"><Phone className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />{formattedPhone}</p>}
    </div>
  </article>;
}

export function PlaygroundResult({ response, loading, error, onRetry }: Props) {
  const t = useTranslations("Playground");
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<"preview" | "json">("preview");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const people = response?.results ?? [];
  const index = Math.min(active, Math.max(people.length - 1, 0));
  const current = people[index];
  const json = response ? JSON.stringify(response, null, 2) : "";
  const thumbnailStart = Math.min(Math.max(index - 2, 0), Math.max(people.length - 5, 0));
  const visible = people.slice(thumbnailStart, thumbnailStart + 5);

  async function copyJson() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <section className="min-w-0 border border-[#e4e8ef] bg-white p-4 sm:p-5" aria-label={t("result")}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-lg font-semibold tracking-tight">{t("result")}</h2><p className="mt-0.5 text-xs text-[#747c8e]">{response ? t("resultCount", { count: people.length }) : t("resultHint")}</p></div>
      {people.length > 0 && <div className="flex items-center gap-3 text-xs text-[#414b61]"><button type="button" aria-label={t("previousPerson")} disabled={index === 0} onClick={() => setActive(index - 1)} className="border border-[#e0e4eb] p-1.5 text-primary disabled:opacity-35"><ChevronLeft className="size-4" /></button><span>{index + 1} {t("of")} {people.length}</span><button type="button" aria-label={t("nextPerson")} disabled={index === people.length - 1} onClick={() => setActive(index + 1)} className="border border-[#e0e4eb] p-1.5 text-primary disabled:opacity-35"><ChevronRight className="size-4" /></button></div>}
    </div>

    {loading ? <div className="mt-5 animate-pulse space-y-4" role="status" aria-label={t("loading")}><div className="flex justify-end gap-2">{[1, 2, 3].map((item) => <div key={item} className="size-10 bg-[#ebedf4]" />)}</div><div className="grid min-h-48 border border-[#e6e9ef] sm:grid-cols-[36%_1fr]"><div className="h-44 bg-[#e7eaf2] sm:h-auto" /><div className="space-y-4 p-5">{[70, 42, 55, 85, 60].map((width) => <div key={width} className="h-3 bg-[#ebedf4]" style={{ width: `${width}%` }} />)}</div></div><div className="h-52 bg-[#f4f6fa]" /></div> : error ? <div className="mt-5 border border-[#f0d1d1] bg-[#fff9f9] px-5 py-8 text-center" role="alert"><p className="font-semibold text-[#a63131]">{t("requestFailed")}</p><p className="mt-2 text-sm text-[#674d4d]">{error}</p><button type="button" onClick={onRetry} className="mt-4 border border-[#a63131] px-4 py-2 text-xs font-semibold text-[#a63131]">{t("retry")}</button></div> : !response ? <div className="mt-5 flex min-h-48 items-center justify-center border border-dashed border-[#d9dfe9] bg-[#fafbfe] px-5 text-center text-sm text-[#71798a]">{t("runToSeeResults")}</div> : people.length === 0 ? <div className="mt-5 flex min-h-48 items-center justify-center border border-dashed border-[#d9dfe9] bg-[#fafbfe] px-5 text-center text-sm text-[#71798a]">{t("noResults")}</div> : <>
      <div className="mt-4 flex min-h-11 flex-wrap items-center justify-end gap-2 border-b border-[#e9ecf1] pb-3">
        {visible.map((person, offset) => { const personIndex = thumbnailStart + offset; return <button key={`${person.id ?? "person"}-${personIndex}`} type="button" onClick={() => setActive(personIndex)} aria-label={t("selectPerson", { number: personIndex + 1 })} aria-current={personIndex === index ? "true" : undefined} className={`size-10 border p-0.5 ${personIndex === index ? "border-primary" : "border-[#e1e5ec]"}`}><Portrait person={person} className="h-full w-full" /></button>; })}
        {people.length > 5 && <button type="button" onClick={() => setPickerOpen(!pickerOpen)} aria-expanded={pickerOpen} className="h-10 border border-[#e1e5ec] px-2 text-xs text-primary">{t("allPeople", { count: people.length })}</button>}
      </div>
      {pickerOpen && <div className="max-h-32 overflow-y-auto border-b border-[#e9ecf1] py-2"><div className="flex flex-wrap gap-1">{people.map((person, personIndex) => <button type="button" key={`${person.id ?? "person"}-picker-${personIndex}`} onClick={() => { setActive(personIndex); setPickerOpen(false); }} aria-label={t("selectPerson", { number: personIndex + 1 })} aria-current={personIndex === index ? "true" : undefined} className={`min-w-8 px-1 py-1 text-xs ${personIndex === index ? "bg-primary text-white" : "bg-[#f2f4f8] text-[#445071]"}`}>{personIndex + 1}</button>)}</div></div>}
      <div className="mt-4"><Profile person={current} /></div>
      <div className="mt-5 flex items-center justify-between border-b border-[#e9ecf1]"><div className="flex gap-4"><button type="button" onClick={() => setTab("preview")} className={`border-b-2 px-1 pb-2 text-xs ${tab === "preview" ? "border-primary font-semibold text-primary" : "border-transparent text-[#7a8294]"}`}>{t("preview")}</button><button type="button" onClick={() => setTab("json")} className={`border-b-2 px-1 pb-2 text-xs ${tab === "json" ? "border-primary font-semibold text-primary" : "border-transparent text-[#7a8294]"}`}>JSON</button></div><button type="button" onClick={copyJson} className="flex items-center gap-1 pb-2 text-xs text-[#5d6681] hover:text-primary">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? t("copied") : t("copyJson")}</button></div>
      {tab === "json" ? <pre className="max-h-[440px] overflow-auto bg-[#fafbfe] p-4 text-[0.7rem] leading-5 text-[#354267]">{json}</pre> : <div className="bg-[#fafbfe] p-4 text-xs text-[#59637b]"><p>{t("selectedResult", { number: index + 1, count: people.length })}</p><dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1"><dt>{t("schemaVersion")}</dt><dd>{response.meta?.schemaVersion ?? "—"}</dd><dt>{t("asOf")}</dt><dd>{response.meta?.asOf ?? "—"}</dd><dt>{t("seed")}</dt><dd className="break-all">{response.meta?.seed ?? "—"}</dd></dl></div>}
    </>}
  </section>;
}
