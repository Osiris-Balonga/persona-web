"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const endpoint = "https://persona-dev.onrender.com/people?count=3&ageGroup=adult";

type Person = {
  id: string;
  gender: string;
  name: { first: string; last: string; full: string };
  nationality: string;
  dob: { age: number };
  location: { city: string | null; country: { name: string } };
  email: string | null;
  phone: string | null;
  picture: { medium: string } | null;
};

function isPerson(value: unknown): value is Person {
  if (!value || typeof value !== "object") return false;
  const person = value as Partial<Person>;
  return typeof person.id === "string" && typeof person.name?.full === "string"
    && typeof person.dob?.age === "number" && typeof person.location?.country?.name === "string";
}

function flag(code: string) {
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((letter) => letter.charCodeAt(0) + 127397));
}

function ProfileCard({ person, prominent, locale }: { person: Person; prominent?: boolean; locale: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const nationality = useMemo(() => {
    try { return new Intl.DisplayNames([locale], { type: "region" }).of(person.nationality) ?? person.nationality; }
    catch { return person.nationality; }
  }, [locale, person.nationality]);

  return (
    <article className={`overflow-hidden border border-[#e7eaf2] bg-white shadow-[0_18px_48px_rgba(44,62,191,0.13)] ${prominent ? "persona-card-main" : "persona-card-side"}`}>
      <div className="relative aspect-[1.2] bg-[#edf1fa]">
        {person.picture?.medium && !imageFailed ? (
          <Image src={person.picture.medium} alt="" fill sizes={prominent ? "(max-width: 640px) 62vw, 260px" : "150px"} className="object-cover object-top" onError={() => setImageFailed(true)} />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-semibold text-primary/45" aria-hidden="true">{person.name.first[0]}{person.name.last[0]}</div>
        )}
      </div>
      <div className={prominent ? "px-4 pb-4 pt-3.5" : "px-3 pb-3 pt-2.5"}>
        <p className={`truncate font-semibold tracking-tight ${prominent ? "text-lg" : "text-sm"}`}>{person.name.full}</p>
        <p className="mt-0.5 truncate text-xs text-[#515971]">{person.dob.age} · <span aria-hidden="true">{flag(person.nationality)}</span> {nationality}</p>
        <p className="mt-2 truncate text-xs text-[#515971]">⌖ &nbsp;{person.location.city ? `${person.location.city}, ` : ""}{person.location.country.name}</p>
        {prominent && <>
          {person.email && <p className="mt-1 truncate text-xs text-[#515971]">✉ &nbsp;{person.email}</p>}
          {person.phone && <p className="mt-1 truncate text-xs text-[#515971]">⌕ &nbsp;{person.phone}</p>}
        </>}
      </div>
    </article>
  );
}

export function PersonaSlider({ locale, label, loading, error, retry }: { locale: string; label: string; loading: string; error: string; retry: string }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const loadPeople = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(endpoint, { signal, cache: "no-store" });
      if (!response.ok) throw new Error(`Persona API: ${response.status}`);
      const body: unknown = await response.json();
      const results = (body as { results?: unknown }).results;
      if (!Array.isArray(results) || results.length < 3 || !results.every(isPerson)) throw new Error("Invalid Persona API response");
      setPeople(results.slice(0, 3));
      activeRef.current = 0;
      setActive(0);
      setStatus("ready");
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setStatus((current) => current === "ready" ? current : "error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void loadPeople(controller.signal), 0);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [loadPeople]);

  useEffect(() => {
    if (status !== "ready") return;
    const timer = window.setInterval(() => {
      const next = (activeRef.current + 1) % 3;
      activeRef.current = next;
      setActive(next);
      if (next === 0) void loadPeople();
    }, 9000);
    return () => window.clearInterval(timer);
  }, [loadPeople, status]);

  const visible = people.length === 3 ? [people[(active + 2) % 3], people[active], people[(active + 1) % 3]] : [];

  return (
    <figure className="persona-slider relative mx-auto w-full max-w-[540px]" aria-label={label}>
      <div aria-hidden="true" className="absolute left-[10%] top-[18%] h-[64%] w-[73%] bg-[#eef2ff]" />
      <div aria-hidden="true" className="absolute right-[4%] top-[2%] h-[27%] w-[31%] bg-[#e7fff6]" />
      {visible.length ? (
        <div className="relative flex h-[370px] items-center justify-center sm:h-[410px]">
          <div className="absolute left-[1%] top-[21%] w-[37%] -rotate-6"><ProfileCard key={visible[0].id} person={visible[0]} locale={locale} /></div>
          <div className="absolute right-[0%] top-[22%] w-[37%] rotate-6"><ProfileCard key={visible[2].id} person={visible[2]} locale={locale} /></div>
          <div className="absolute left-1/2 top-[1%] z-10 w-[57%] -translate-x-1/2"><ProfileCard key={visible[1].id} person={visible[1]} locale={locale} prominent /></div>
        </div>
      ) : (
        <div className="relative flex h-[370px] items-center justify-center sm:h-[410px]">
          <div className="flex min-h-48 w-[58%] flex-col items-center justify-center border border-[#e7eaf2] bg-white p-5 text-center shadow-lg">
            <p className="text-sm text-[#515971]" role="status">{status === "error" ? error : loading}</p>
            {status === "error" && <button className="mt-4 text-sm font-semibold text-primary underline" onClick={() => { setStatus("loading"); void loadPeople(); }}>{retry}</button>}
          </div>
        </div>
      )}
      <div className="relative mt-1 flex justify-center gap-2.5" aria-label={label}>
        {[0, 1, 2].map((index) => <button key={index} type="button" aria-label={`${label} ${index + 1}`} aria-current={active === index ? "true" : undefined} onClick={() => { activeRef.current = index; setActive(index); }} disabled={status !== "ready"} className={`size-2 rounded-full transition-colors ${active === index ? "bg-primary" : "bg-[#dfe3ed]"}`} />)}
      </div>
    </figure>
  );
}
