"use client";

import { Check, ChevronDown, Copy, Play, Search, Square } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { countryDisplayName } from "@/lib/country-display-name";
import { coverageRows } from "@/lib/coverage-data";
import type { PlaygroundOptions, QueryProblem } from "@/lib/playground-query";

const ageGroups = ["child", "teen", "adult", "senior"] as const;
const continents = ["africa", "americas", "asia", "europe", "oceania"] as const;
const selectableFields = ["id", "gender", "name", "nationality", "dob", "location", "email", "phone", "picture", "login"] as const;
const noSubscription = () => () => {};

function flag(code: string) {
  return [...code].map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join("");
}

type Props = {
  options: PlaygroundOptions;
  onChange: (options: PlaygroundOptions) => void;
  requestUrl: string;
  problem: QueryProblem | null;
  loading: boolean;
  onRun: () => void;
  onCancel: () => void;
};

export function PlaygroundForm({ options, onChange, requestUrl, problem, loading, onRun, onCancel }: Props) {
  const t = useTranslations("Playground");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const hydrated = useSyncExternalStore(noSubscription, () => true, () => false);
  const countries = coverageRows
    .filter((row) => row.status !== "unavailable")
    .map((row) => ({ ...row, label: hydrated ? countryDisplayName(row.code, locale, row.name) : row.name }))
    .sort((a, b) => a.code.localeCompare(b.code, "en"));

  function update<Key extends keyof PlaygroundOptions>(key: Key, value: PlaygroundOptions[Key]) {
    onChange({ ...options, [key]: value });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) onCancel();
    else onRun();
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(requestUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const inputClass = "h-9 w-full min-w-0 rounded-none border border-[#d9dde5] bg-white px-3 text-xs text-[#303746] outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-[#f6f7fa] disabled:text-[#9aa1b0]";
  const labelClass = "mb-1.5 block text-xs font-semibold text-[#292e39]";

  return (
    <form onSubmit={submit} className="border border-[#e4e8ef] bg-white p-4 sm:p-5">
      <h2 className="text-lg font-semibold tracking-tight">{t("configuration")}</h2>
      <p className="mt-0.5 text-xs text-[#747c8e]">{t("configurationHint")}</p>

      <div className="mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2">
        <label><span className={labelClass}>{t("count")}</span><input className={inputClass} type="number" min={1} max={100} value={options.count} onChange={(event) => update("count", Number(event.target.value))} /><span className="mt-1 block text-[0.68rem] text-[#8a92a0]">{t("countHint")}</span></label>
        <label><span className={labelClass}>{t("gender")}</span><select className={inputClass} value={options.gender} onChange={(event) => update("gender", event.target.value as PlaygroundOptions["gender"])}><option value="">{t("any")}</option><option value="female">{t("female")}</option><option value="male">{t("male")}</option></select></label>

        <fieldset className="sm:col-span-2"><legend className={labelClass}>{t("ageGroup")}</legend><div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">{ageGroups.map((group) => <label key={group} className={`flex cursor-pointer items-center justify-center gap-1.5 border px-2 py-2 text-xs ${options.ageGroups.includes(group) ? "border-primary bg-primary/5 text-primary" : "border-[#d9dde5] text-[#51596c]"}`}><input type="checkbox" checked={options.ageGroups.includes(group)} onChange={() => update("ageGroups", options.ageGroups.includes(group) ? options.ageGroups.filter((item) => item !== group) : [...options.ageGroups, group])} className="accent-primary" />{t(group)}</label>)}</div></fieldset>

        <label><span className={labelClass}>{t("continent")}</span><select className={inputClass} value={options.continent} onChange={(event) => update("continent", event.target.value)}><option value="">{t("allContinents")}</option>{continents.map((continent) => <option key={continent} value={continent}>{t(continent)}</option>)}</select><span className="mt-1 block text-[0.68rem] text-[#8a92a0]">{t("continentHint")}</span></label>
        <label><span className={labelClass}>{t("nationality")}</span><select className={inputClass} value={options.nationality} onChange={(event) => update("nationality", event.target.value)}><option value="">{t("anyNationality")}</option>{countries.filter((row) => row.status === "available").map((row) => <option key={row.code} value={row.code}>{flag(row.code)} {row.label}</option>)}</select><span className="mt-1 block text-[0.68rem] text-[#8a92a0]">{t("nationalityHint")}</span></label>

        <label><span className={labelClass}>{t("residenceCountry")}</span><select className={inputClass} value={options.residenceCountry} onChange={(event) => update("residenceCountry", event.target.value)}><option value="">{t("anyResidence")}</option>{countries.map((row) => <option key={row.code} value={row.code}>{flag(row.code)} {row.label}</option>)}</select><span className="mt-1 block text-[0.68rem] text-[#8a92a0]">{t("residenceHint")}</span></label>
        <label><span className={labelClass}>{t("city")}</span><span className="relative block"><Search aria-hidden="true" className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#8a92a0]" /><input className={`${inputClass} pl-9`} value={options.city} maxLength={100} disabled={!options.residenceCountry && !options.nationality} placeholder={t("cityPlaceholder")} onChange={(event) => update("city", event.target.value)} /></span><span className="mt-1 block text-[0.68rem] text-[#8a92a0]">{t("cityHint")}</span></label>

        <label><span className={labelClass}>{t("emailDomain")}</span><input className={inputClass} value={options.emailDomain} placeholder="example.test" onChange={(event) => update("emailDomain", event.target.value)} /></label>
        <label><span className={labelClass}>{t("seed")}</span><input className={inputClass} value={options.seed} maxLength={128} placeholder="demo" onChange={(event) => update("seed", event.target.value)} /><span className="mt-1 block text-[0.68rem] text-[#8a92a0]">{t("seedHint")}</span></label>
        <label><span className={labelClass}>{t("asOf")}</span><input className={inputClass} type="date" value={options.asOf} onChange={(event) => update("asOf", event.target.value)} /><span className="mt-1 block text-[0.68rem] text-[#8a92a0]">{t("asOfHint")}</span></label>

        <details className="sm:col-span-2"><summary className="flex cursor-pointer list-none items-center justify-between border border-[#d9dde5] px-3 py-2 text-xs font-medium text-[#303746]"><span>{t("fields")} · {options.fields.length ? t("selectedFields", { count: options.fields.length }) : t("allFields")}</span><ChevronDown aria-hidden="true" className="size-4" /></summary><div className="grid grid-cols-2 gap-2 border border-t-0 border-[#d9dde5] p-3 sm:grid-cols-5">{selectableFields.map((field) => <label key={field} className="flex items-center gap-1.5 text-xs text-[#51596c]"><input type="checkbox" className="accent-primary" checked={options.fields.includes(field)} onChange={() => update("fields", options.fields.includes(field) ? options.fields.filter((item) => item !== field) : [...options.fields, field])} />{field}</label>)}</div></details>
      </div>

      {problem && <p role="alert" className="mt-4 border border-[#f2c7c7] bg-[#fff7f7] px-3 py-2 text-xs text-[#ad3333]">{t(`problem${problem[0].toUpperCase()}${problem.slice(1)}`)}</p>}

      <div className="mt-5 bg-[#f6f8fc] p-3 text-xs"><div className="mb-2 flex items-center justify-between"><strong className="font-semibold">{t("requestPreview")}</strong><button type="button" onClick={copyUrl} aria-label={t("copyUrl")} className="text-primary hover:opacity-70">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button></div><div className="flex gap-3"><span className="font-semibold text-primary">GET</span><code className="min-w-0 break-all text-[#4b5672]">{requestUrl}</code></div></div>
      <button type="submit" className="mt-4 flex h-10 w-full items-center justify-center gap-2 bg-primary text-xs font-semibold text-white transition-colors hover:bg-[#2636a9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{loading ? <Square aria-hidden="true" className="size-3.5" /> : <Play aria-hidden="true" className="size-3.5 fill-current" />}{loading ? t("cancelRequest") : t("runRequest")}</button>
    </form>
  );
}
