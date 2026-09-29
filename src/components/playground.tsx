"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PlaygroundForm } from "@/components/playground-form";
import { PlaygroundResult } from "@/components/playground-result";
import { coverageRows } from "@/lib/coverage-data";
import {
  buildPeopleUrl,
  defaultPlaygroundOptions,
  validatePlaygroundOptions,
  type PlaygroundOptions,
  type QueryProblem,
} from "@/lib/playground-query";
import {
  isPlaygroundResponse,
  type ApiError,
  type PlaygroundResponse,
} from "@/lib/playground-response";

const apiOrigin =
  process.env.NEXT_PUBLIC_PERSONA_API_URL || "https://persona-dev.onrender.com";
const requestTimeoutMs = 20000;

export function Playground() {
  const t = useTranslations("Playground");
  const [options, setOptions] = useState<PlaygroundOptions>(
    defaultPlaygroundOptions,
  );
  const [problem, setProblem] = useState<QueryProblem | null>(null);
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const requestUrl = buildPeopleUrl(apiOrigin, options).toString();

  const run = useCallback(
    async (currentOptions: PlaygroundOptions) => {
      const nationalityContinent = coverageRows.find(
        (row) => row.code === currentOptions.nationality,
      )?.continent;
      const validation = validatePlaygroundOptions(
        currentOptions,
        nationalityContinent,
      );
      const url = buildPeopleUrl(apiOrigin, currentOptions);
      if (validation || url.toString().length > 2048) {
        setProblem(validation || "url");
        return;
      }
      setProblem(null);
      setError(null);
      setResponse(null);
      controller.current?.abort();
      const abortController = new AbortController();
      controller.current = abortController;
      setLoading(true);
      const timer = window.setTimeout(
        () => abortController.abort("timeout"),
        requestTimeoutMs,
      );
      try {
        if (!navigator.onLine) throw new Error("offline");
        const result = await fetch(url, {
          signal: abortController.signal,
          cache: "no-store",
        });
        if (!result.ok) {
          const body = (await result
            .json()
            .catch(() => null)) as ApiError | null;
          const message = body?.error?.message;
          if (result.status === 429)
            throw new Error(
              `rateLimit:${result.headers.get("Retry-After") || ""}`,
            );
          if (result.status === 400)
            throw new Error(`badRequest:${message || ""}`);
          if (result.status === 503) throw new Error("unavailable");
          throw new Error(`http:${result.status}`);
        }
        const body: unknown = await result.json();
        if (!isPlaygroundResponse(body)) throw new Error("invalidResponse");
        if (controller.current === abortController) setResponse(body);
      } catch (cause) {
        if (controller.current !== abortController) return;
        const message = cause instanceof Error ? cause.message : "unknown";
        if (
          abortController.signal.aborted &&
          abortController.signal.reason !== "timeout"
        )
          return;
        const errorText =
          message === "offline"
            ? t("errorOffline")
            : message === "unavailable"
              ? t("errorUnavailable")
              : message === "invalidResponse"
                ? t("errorInvalidResponse")
                : message.startsWith("badRequest:")
                  ? t("errorBadRequest", {
                      detail: message.slice(11) || t("unknownError"),
                    })
                  : message.startsWith("rateLimit:")
                    ? t("errorRateLimit", { seconds: message.slice(10) || "?" })
                    : abortController.signal.reason === "timeout"
                      ? t("errorTimeout")
                      : t("errorGeneric");
        setError(errorText);
      } finally {
        window.clearTimeout(timer);
        if (controller.current === abortController) {
          controller.current = null;
          setLoading(false);
        }
      }
    },
    [t],
  );

  useEffect(() => {
    // One sample request makes the result panel useful immediately. It is aborted on navigation.
    const timer = window.setTimeout(
      () => void run(defaultPlaygroundOptions),
      0,
    );
    return () => {
      window.clearTimeout(timer);
      controller.current?.abort();
    };
  }, [run]);

  function cancel() {
    controller.current?.abort();
    controller.current = null;
    setLoading(false);
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="playground-enter playground-enter-delay-1">
        <PlaygroundForm
          options={options}
          onChange={setOptions}
          requestUrl={requestUrl}
          problem={problem}
          loading={loading}
          onRun={() => void run(options)}
          onCancel={cancel}
        />
      </div>
      <div className="min-w-0 playground-enter playground-enter-delay-2">
        <PlaygroundResult
          response={response}
          loading={loading}
          error={error}
          onRetry={() => void run(options)}
        />
      </div>
    </div>
  );
}
