"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { skinToneSwatches } from "@/lib/skin-tone-swatches";

export function PlaygroundSkinTone({
  selected,
  onChange,
  disabled = false,
}: {
  selected: number | null;
  onChange: (selected: number | null) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("Playground.PortraitTypes");
  const hintId = useId();
  const groupName = useId();

  return (
    <fieldset aria-describedby={hintId} disabled={disabled}>
      <legend className="mb-1.5 text-xs font-semibold text-[var(--persona-ink)]">
        {t("skinToneLabel")}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        <label
          className={`flex h-9 min-w-12 cursor-pointer items-center justify-center border px-2 text-[0.68rem] font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${selected === null ? "border-primary bg-primary/5 text-primary" : "border-[var(--persona-line)] text-[var(--persona-copy)] hover:border-primary/60"} ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
        >
          <input
            type="radio"
            name={groupName}
            checked={selected === null}
            disabled={disabled}
            onChange={() => onChange(null)}
            className="sr-only"
          />
          {t("skinToneAll")}
        </label>
        {skinToneSwatches.map(({ value, color }) => (
          <label
            key={value}
            className={`grid size-9 cursor-pointer place-items-center border text-xs font-semibold transition-[outline-color,transform] hover:-translate-y-0.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${selected === value ? "border-primary outline-2 outline-offset-2 outline-primary" : "border-[var(--persona-line)]"} ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
            style={{ backgroundColor: color, color: value >= 7 ? "white" : "#111111" }}
          >
            <input
              type="radio"
              name={groupName}
              value={value}
              aria-label={t("skinToneOption", { number: value })}
              checked={selected === value}
              disabled={disabled}
              onChange={() => onChange(value)}
              className="sr-only"
            />
            {value}
          </label>
        ))}
      </div>
      <p id={hintId} className="mt-2 text-xs text-[var(--persona-copy)]">
        {disabled ? t("skinToneNoPortraits") : t("skinToneHint")}
      </p>
    </fieldset>
  );
}
