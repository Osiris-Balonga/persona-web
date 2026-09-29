"use client";

import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FeaturedPerson } from "@/lib/featured-personas";

function ProfileCard({ person, locale, ageLabel }: { person: FeaturedPerson; locale: string; ageLabel: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const nationality = useMemo(() => {
    try { return new Intl.DisplayNames([locale], { type: "region" }).of(person.nationality) ?? person.nationality; }
    catch { return person.nationality; }
  }, [locale, person.nationality]);

  return (
    <article className="persona-profile overflow-hidden border border-[#e7eaf2] bg-white shadow-[0_18px_48px_rgba(44,62,191,0.13)]">
      <div className="relative aspect-[1.2] bg-[#edf1fa]">
        {person.picture?.medium && !imageFailed ? (
          <Image src={person.picture.medium} alt="" fill sizes="(max-width: 640px) 62vw, 280px" className="object-cover object-top" onError={() => setImageFailed(true)} />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-semibold text-primary/45" aria-hidden="true">{person.name.first[0]}{person.name.last[0]}</div>
        )}
      </div>
      <div className="px-4 pb-4 pt-3.5">
        <p className="truncate text-lg font-semibold tracking-tight">{person.name.full}</p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#515971]">
          <span>{person.dob.age} {ageLabel}</span><span aria-hidden="true">·</span>
          <span className={`fi fi-${person.nationality.toLowerCase()} inline-block shrink-0 text-[1rem] leading-none`} role="img" aria-label={nationality} />
          <span className="truncate">{nationality}</span>
        </p>
        <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-[#515971]"><MapPin aria-hidden="true" className="size-3 shrink-0 text-primary" /><span className="truncate">{person.location.city ? `${person.location.city}, ` : ""}{person.location.country.name}</span></p>
        {person.email && <p className="persona-card-contact mt-1 flex items-center gap-1.5 truncate text-xs text-[#515971]"><Mail aria-hidden="true" className="size-3 shrink-0 text-primary" /><span className="truncate">{person.email}</span></p>}
        {person.phoneDisplay && <p className="persona-card-contact mt-1 flex items-center gap-1.5 truncate text-xs text-[#515971]"><Phone aria-hidden="true" className="size-3 shrink-0 text-primary" /><span className="truncate">{person.phoneDisplay}</span></p>}
      </div>
    </article>
  );
}

function SliderBackdrop() {
  return <div aria-hidden="true" className="persona-slider-backdrop absolute inset-0" />;
}

export function PersonaSliderSkeleton({ label, loading }: { label: string; loading: string }) {
  return (
    <figure className="persona-slider persona-reveal relative mx-auto w-full max-w-[540px]" aria-label={label}>
      <SliderBackdrop />
      <div className="relative h-[370px] sm:h-[410px]" aria-hidden="true">
        {(["left", "right", "center"] as const).map((slot) => <div key={slot} className={`persona-slot persona-slot-${slot}`}><div className="persona-profile border border-[#e7eaf2] bg-white shadow-[0_18px_48px_rgba(44,62,191,0.13)]"><div className="aspect-[1.2] animate-pulse bg-[#e6eaf3]" /><div className="space-y-2 px-4 pb-5 pt-4"><div className="h-4 w-3/4 animate-pulse bg-[#e5e9f1]" /><div className="h-2.5 w-1/2 animate-pulse bg-[#eef0f5]" /><div className="h-2.5 w-5/6 animate-pulse bg-[#eef0f5]" /><div className="h-2.5 w-2/3 animate-pulse bg-[#eef0f5]" /></div></div></div>)}
      </div>
      <div className="relative mt-1 flex justify-center gap-2.5" aria-hidden="true"><span className="size-2 rounded-full bg-primary" /><span className="size-2 rounded-full bg-[#dfe3ed]" /><span className="size-2 rounded-full bg-[#dfe3ed]" /></div>
      <span className="sr-only" role="status">{loading}</span>
    </figure>
  );
}

export function PersonaSlider({ people, locale, label, ageLabel, error }: { people: FeaturedPerson[]; locale: string; label: string; ageLabel: string; error: string }) {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (people.length !== 3 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % 3), 7000);
    return () => window.clearInterval(timer);
  }, [people.length, paused]);

  if (people.length !== 3) {
    return <figure className="persona-slider relative mx-auto flex h-[370px] w-full max-w-[540px] items-center justify-center" aria-label={label}><SliderBackdrop /><p className="relative bg-white px-5 py-4 text-center text-sm text-[#515971]" role="status">{error}</p></figure>;
  }

  return (
    <figure className="persona-slider persona-reveal relative mx-auto w-full max-w-[540px]" aria-label={label} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      <SliderBackdrop />
      <div className="relative h-[370px] sm:h-[410px]">
        {people.map((person, index) => {
          const position = (index - active + 3) % 3;
          const slot = position === 0 ? "center" : position === 1 ? "right" : "left";
          return <div key={person.id} className={`persona-slot persona-slot-${slot}`} aria-hidden={slot !== "center"}><ProfileCard person={person} locale={locale} ageLabel={ageLabel} /></div>;
        })}
      </div>
      <div className="relative mt-1 flex justify-center gap-2.5" aria-label={label}>
        {people.map((person, index) => <button key={person.id} type="button" aria-label={`${label} ${index + 1}`} aria-current={active === index ? "true" : undefined} onClick={() => setActive(index)} className={`size-2 rounded-full transition-colors ${active === index ? "bg-primary" : "bg-[#dfe3ed]"}`} />)}
      </div>
    </figure>
  );
}
