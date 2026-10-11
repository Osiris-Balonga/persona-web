"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { selectedSkinTones, skinToneSwatches, toggleSkinTone, type SkinToneSelection } from "@/lib/skin-tone-swatches";

export function PlaygroundSkinTone({
  selected,
  onChange,
  disabled = false,
}: {
  selected: SkinToneSelection;
  onChange: (selected: SkinToneSelection) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("Playground.PortraitTypes");
  const tones = selectedSkinTones(selected);

  return (
    <fieldset disabled={disabled}>
      <legend className="mb-1.5 text-xs font-semibold text-[var(--persona-ink)]">
        {t("skinToneLabel")}
      </legend>
      <div className="grid grid-cols-[auto_repeat(10,minmax(0,2.25rem))] items-center gap-0.5 sm:gap-1.5">
        <button
          type="button"
          aria-pressed={selected === null}
          disabled={disabled}
          onClick={() => onChange(null)}
          className={`h-9 border px-1 text-[0.68rem] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45 ${selected === null ? "border-primary bg-primary/5 text-primary" : "border-[var(--persona-line)] text-[var(--persona-copy)] hover:border-primary/60"}`}
        >
          {t("skinToneAll")}
        </button>
        {skinToneSwatches.map(({ value, color }) => {
          const checked = tones.includes(value);
          return (
            <label
              key={value}
              className={`grid aspect-square w-full min-w-0 cursor-pointer place-items-center border text-xs font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${checked ? "border-primary outline-1 outline-primary" : "border-[var(--persona-line)]"} ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
              style={{ backgroundColor: color, color: value >= 7 ? "white" : "#111111" }}
            >
              <input
                type="checkbox"
                aria-label={t("skinToneOption", { number: value })}
                checked={checked}
                disabled={disabled || (checked && tones.length === 1)}
                onChange={() => onChange(toggleSkinTone(selected, value))}
                className="sr-only"
              />
              {checked ? <Check className="size-4" aria-hidden="true" strokeWidth={2.5} /> : value}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
