"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Filter,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { countryDisplayName } from "@/lib/country-display-name";
import type { UseCasePerson } from "@/lib/use-case-people";
import { Portrait } from "./portrait";
import { useCaseCopy, type Example } from "./copy";
import styles from "./use-cases.module.css";

function LandingResult({
  people,
  locale,
}: {
  people: UseCasePerson[];
  locale: string;
}) {
  const t = useCaseCopy(locale).landing;
  const portraits = [
    ...people.filter((person) => person.portrait),
    ...people.filter((person) => !person.portrait),
  ].slice(0, 10);
  return (
    <section className={styles.landing} aria-label={t.title}>
      {portraits.map((person, index) => (
        <Portrait
          key={person.id}
          person={person}
          size={120}
          className={`${styles.floatingPortrait} ${styles[`portrait${index + 1}`]}`}
        />
      ))}
      <div className={styles.landingContent}>
        <span className={styles.landingEyebrow}>{t.eyebrow}</span>
        <h2>{t.title}</h2>
        <p>{t.description}</p>
        <span className={styles.sampleCta}>
          {t.action}
          <ArrowRight aria-hidden="true" size={18} />
        </span>
      </div>
    </section>
  );
}

function TestimonialResult({
  people,
  locale,
}: {
  people: UseCasePerson[];
  locale: string;
}) {
  const t = useCaseCopy(locale).testimonials;
  const chosen = [
    ...people.filter((person) => person.portrait),
    ...people.filter((person) => !person.portrait),
  ].slice(0, 2);
  return (
    <section className={styles.testimonials} aria-label={t.title}>
      <div className={styles.testimonialsInner}>
        <h2 className={styles.visuallyHidden}>{t.title}</h2>
        {[t.first, t.second].map((quote, index) => (
          <article className={styles.quoteCard} key={quote}>
            <div className={styles.quoteTop}>
              <div
                className={styles.stars}
                aria-label={`${index === 0 ? 5 : 4} / 5`}
              >
                {Array.from({ length: 5 }, (_, star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={
                      star < (index === 0 ? 5 : 4) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <span aria-hidden="true" className={styles.quoteMark}>
                ”
              </span>
            </div>
            <blockquote>{quote}</blockquote>
            <div className={styles.quotePerson}>
              <Portrait
                person={chosen[index]}
                size={58}
                className={styles.quoteAvatar}
              />
              <div>
                <strong>{chosen[index].name}</strong>
                <span>{t.roles[index]}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TeamResult({
  people,
  locale,
}: {
  people: UseCasePerson[];
  locale: string;
}) {
  const t = useCaseCopy(locale).team;
  const chosen = [
    ...people.filter((person) => person.portrait),
    ...people.filter((person) => !person.portrait),
  ].slice(0, 6);
  return (
    <section className={styles.team} aria-label={t.title}>
      <div className={styles.teamHead}>
        <h2>{t.title}</h2>
        <p>{t.description}</p>
      </div>
      <div className={styles.teamGrid}>
        {chosen.map((person, index) => (
          <div className={styles.teamMember} key={person.id}>
            <Portrait person={person} size={64} className={styles.teamAvatar} />
            <div className={styles.teamIdentity}>
              <strong>{person.name}</strong>
              <span>{t.roles[index]}</span>
            </div>
            <div aria-hidden="true" className={styles.socials}>
              <span>𝕏</span>
              <Image
                src="/github.svg"
                alt=""
                width={19}
                height={19}
                className="dark:invert"
              />
              {index % 2 === 0 && <span>in</span>}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.teamFoot}>
        <div>
          <h3>{t.joinTitle}</h3>
          <p>{t.joinDescription}</p>
        </div>
        <span className={styles.sampleOutline}>{t.joinAction}</span>
      </div>
    </section>
  );
}

function TableResult({
  people,
  locale,
}: {
  people: UseCasePerson[];
  locale: string;
}) {
  const t = useCaseCopy(locale).table;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [compact, setCompact] = useState(false);
  const filtered = useMemo(
    () =>
      people.filter((person, index) => {
        const matchesQuery = `${person.name} ${person.email} ${person.city}`
          .toLocaleLowerCase(locale)
          .includes(query.toLocaleLowerCase(locale));
        const matchesStatus =
          status === "all" ||
          (index % 4 === 1 ? "inactive" : "active") === status;
        return matchesQuery && matchesStatus;
      }),
    [people, query, status, locale],
  );
  const maxPage = Math.max(0, Math.ceil(filtered.length / perPage) - 1);
  const current = Math.min(page, maxPage);
  const visible = filtered.slice(current * perPage, (current + 1) * perPage);
  const cycleStatus = () => {
    setStatus(
      status === "all" ? "active" : status === "active" ? "inactive" : "all",
    );
    setPage(0);
  };

  return (
    <section
      className={styles.tableResult}
      aria-label={useCaseCopy(locale).cards.table.title}
    >
      <div className={styles.tableToolbar}>
        <label className={styles.tableSearch}>
          <Search size={18} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder={t.search}
            aria-label={t.search}
          />
        </label>
        <Button
          type="button"
          variant="outline"
          onClick={cycleStatus}
          className={styles.toolbarButton}
        >
          <Filter size={17} />
          {status === "all" ? t.status : t[status]}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setCompact(!compact)}
          aria-pressed={compact}
          className={styles.toolbarButton}
        >
          <Columns3 size={17} />
          {t.view}
        </Button>
        <span className={styles.toolbarSpacer} />
        <span className={styles.sampleOutline}>
          <Plus size={18} />
          {t.add}
        </span>
      </div>
      <div className={styles.tableScroll}>
        <table
          className={`${styles.dataTable} ${compact ? styles.compactTable : ""}`}
        >
          <thead>
            <tr>
              <th>{t.name}</th>
              <th>{t.email}</th>
              <th>{t.location}</th>
              <th>{t.status}</th>
              <th>{t.performance}</th>
              <th>{t.balance}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((person) => {
              const index = people.indexOf(person);
              const active = index % 4 !== 1;
              return (
                <tr key={person.id}>
                  <td className={styles.personName}>{person.name}</td>
                  <td>{person.email}</td>
                  <td>
                    <span
                      className={`fi fi-${person.countryCode.toLowerCase()} ${styles.locationFlag}`}
                      aria-label={person.countryCode}
                    />
                    {person.city ? `${person.city}, ` : ""}
                    {countryDisplayName(person.countryCode, locale)}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${active ? styles.active : styles.inactive}`}
                    >
                      {active ? t.active : t.inactive}
                    </span>
                  </td>
                  <td>
                    {index % 3 === 0
                      ? t.high
                      : index % 3 === 1
                        ? t.medium
                        : t.low}
                  </td>
                  <td>
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format((index * 173 + 890) % 3200)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className={styles.noRows}>
            0 {t.of} {people.length}
          </p>
        )}
      </div>
      <div className={styles.tableFoot}>
        <label>
          {t.rows}
          <select
            value={perPage}
            onChange={(event) => {
              setPerPage(Number(event.target.value));
              setPage(0);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
        <div>
          <span>
            {filtered.length ? current * perPage + 1 : 0}–
            {Math.min((current + 1) * perPage, filtered.length)} {t.of}{" "}
            {filtered.length}
          </span>
          <Button
            aria-label={t.previous}
            variant="outline"
            size="icon"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label={t.next}
            variant="outline"
            size="icon"
            disabled={current >= maxPage}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <p className={styles.tableNote}>{t.example}</p>
    </section>
  );
}

export function ExampleResult({
  example,
  people,
  locale,
}: {
  example: Example;
  people: UseCasePerson[];
  locale: string;
}) {
  if (example === "landing")
    return <LandingResult people={people} locale={locale} />;
  if (example === "testimonials")
    return <TestimonialResult people={people} locale={locale} />;
  if (example === "team") return <TeamResult people={people} locale={locale} />;
  return <TableResult people={people} locale={locale} />;
}
