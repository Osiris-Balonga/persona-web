"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Database,
  MessageSquareQuote,
  Paperclip,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UseCasePerson } from "@/lib/use-case-people";
import { examples, useCaseCopy, type Example } from "./copy";
import { ExampleResult } from "./results";
import styles from "./use-cases.module.css";

const icons = {
  landing: ShoppingBag,
  testimonials: MessageSquareQuote,
  team: UsersRound,
  table: Database,
};

export function UseCases({
  locale,
  country,
}: {
  locale: string;
  country: string;
}) {
  const t = useCaseCopy(locale);
  const [selected, setSelected] = useState<Example>("landing");
  const [phase, setPhase] = useState<
    "prompt" | "leaving" | "loading" | "result" | "error"
  >("prompt");
  const [people, setPeople] = useState<UseCasePerson[]>([]);
  const requestId = useRef(0);

  async function reveal() {
    const id = ++requestId.current;
    setPhase("leaving");
    const transition = new Promise((resolve) =>
      setTimeout(() => {
        if (id === requestId.current) setPhase("loading");
        resolve(undefined);
      }, 260),
    );
    try {
      const [fetchResult] = await Promise.allSettled([
        fetch(`/api/use-cases?country=${encodeURIComponent(country)}`, {
          cache: "force-cache",
        }),
        transition,
      ]);
      if (fetchResult.status === "rejected") throw fetchResult.reason;
      const response = fetchResult.value;
      if (!response.ok) throw new Error("Persona API unavailable");
      const payload: { people?: UseCasePerson[] } = await response.json();
      if (!payload.people || payload.people.length < 10)
        throw new Error("Persona profiles unavailable");
      if (id !== requestId.current) return;
      setPeople(payload.people);
      setPhase("result");
    } catch {
      if (id === requestId.current) setPhase("error");
    }
  }

  function reset() {
    requestId.current += 1;
    setPhase("prompt");
  }

  return (
    <main className={styles.page}>
      {phase === "prompt" || phase === "leaving" ? (
        <div
          className={`${styles.promptStage} ${phase === "leaving" ? styles.promptLeaving : ""}`}
        >
          <div className={styles.orb} aria-hidden="true">
            <span />
            <span />
          </div>
          <h1>{t.heading}</h1>
          <div className={styles.chatBox}>
            <div
              className={styles.promptText}
              role="textbox"
              aria-readonly="true"
              tabIndex={0}
              title={t.unavailable}
            >
              {t.cards[selected].prompt}
            </div>
            <div className={styles.chatActions}>
              <div className={styles.unavailableActions}>
                <span
                  className={styles.unavailableAction}
                  title={t.unavailable}
                  aria-disabled="true"
                >
                  <Paperclip size={15} aria-hidden="true" />
                  {t.attach}
                </span>
                <span
                  className={styles.unavailableAction}
                  title={t.unavailable}
                  aria-disabled="true"
                >
                  {t.style}
                  <span aria-hidden="true">⌄</span>
                </span>
              </div>
              <Button
                type="button"
                aria-label={t.send}
                title={t.send}
                onClick={reveal}
                className={styles.sendButton}
              >
                <ArrowUp size={20} aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className={styles.examples}>
            <p>{t.explore}</p>
            <div className={styles.exampleGrid}>
              {examples.map((example) => {
                const Icon = icons[example];
                return (
                  <button
                    type="button"
                    key={example}
                    onClick={() => setSelected(example)}
                    aria-pressed={selected === example}
                    className={`${styles.exampleCard} ${selected === example ? styles.exampleSelected : ""}`}
                  >
                    <span className={styles.exampleIcon}>
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className={styles.exampleContent}>
                      <strong>{t.cards[example].title}</strong>
                      <span>{t.cards[example].description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.resultStage}>
          <div className={styles.resultBar}>
            <Button
              type="button"
              variant="ghost"
              onClick={reset}
              className={styles.backButton}
            >
              <ArrowLeft size={17} />
              {t.back}
            </Button>
            <span className={styles.resultLabel}>
              <Sparkles size={14} />
              {t.cards[selected].title}
            </span>
          </div>
          {phase === "result" ? (
            <div className={styles.resultReveal} key={selected}>
              <ExampleResult
                example={selected}
                people={people}
                locale={locale}
              />
            </div>
          ) : phase === "error" ? (
            <div role="alert" className={styles.error}>
              <p>{t.error}</p>
              <Button onClick={reveal}>{t.retry}</Button>
            </div>
          ) : (
            <div role="status" className={styles.loading}>
              <div className={styles.loadingLine} />
              <div className={styles.loadingPanel} />
              <p>{t.loading}</p>
            </div>
          )}
          {phase === "result" && (
            <p className={styles.dataNote}>{t.dataNote}</p>
          )}
        </div>
      )}
    </main>
  );
}
