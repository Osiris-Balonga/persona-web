"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { UsagePoint } from "@/lib/usage-stats-core";
import styles from "./activity.module.css";

const left = 58;
const right = 720;
const top = 28;
const bottom = 198;

function niceCeiling(value: number) {
  if (value <= 1) return 1;
  const roughStep = value / 4;
  const unit = 10 ** Math.floor(Math.log10(roughStep));
  const step = [1, 2, 2.5, 5, 10].map((multiple) => multiple * unit).find((candidate) => candidate >= roughStep) ?? unit * 10;
  return step * 4;
}

export function ActivityChart({ points, locale }: { points: UsagePoint[]; locale: string }) {
  const t = useTranslations("Activity");
  const [selected, setSelected] = useState<number | null>(null);
  const dates = points.map((point) => Date.parse(`${point.period}T00:00:00Z`));
  const first = dates[0];
  const span = Math.max(1, dates.at(-1)! - first);
  const ceiling = niceCeiling(Math.max(...points.map((point) => point.profiles)));
  const x = (index: number) => points.length === 1 ? (left + right) / 2 : left + ((dates[index] - first) / span) * (right - left);
  const y = (value: number) => bottom - (value / ceiling) * (bottom - top);
  const dateFormatter = new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "short", timeZone: "UTC" });
  const dateLabel = (period: string) => dateFormatter.format(new Date(`${period}T12:00:00Z`));
  const numberFormatter = new Intl.NumberFormat(locale);

  const segments: number[][] = [];
  points.forEach((_, index) => {
    if (index === 0 || dates[index] - dates[index - 1] > 86_400_000) segments.push([]);
    segments.at(-1)!.push(index);
  });

  const tickIndexes = points.map((_, index) => index).filter((index) =>
    points.length <= 7 || index === 0 || index === points.length - 1 || index % 5 === 0,
  );
  const selectedPoint = selected === null ? null : points[selected];

  return (
    <div className={styles.chart}>
      <svg viewBox="0 0 760 242" preserveAspectRatio="none" role="img" aria-label={t("chartAccessibility")}>
        <defs>
          <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2ee6a6" stopOpacity=".27" />
            <stop offset="100%" stopColor="#2ee6a6" stopOpacity=".015" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((index) => {
          const value = (ceiling / 4) * index;
          const position = y(value);
          return (
            <g key={index}>
              <line x1={left} x2={right} y1={position} y2={position} className={styles.gridLine} />
              <text x={left - 11} y={position + 4} textAnchor="end" className={styles.axisText}>{numberFormatter.format(value)}</text>
            </g>
          );
        })}
        {segments.map((segment, index) => {
          if (segment.length < 2) return null;
          const coordinates = segment.map((pointIndex) => `${x(pointIndex)},${y(points[pointIndex].profiles)}`);
          return (
            <g key={index}>
              <path d={`M ${x(segment[0])} ${bottom} L ${coordinates.join(" L ")} L ${x(segment.at(-1)!)} ${bottom} Z`} fill="url(#activity-fill)" />
              <polyline points={coordinates.join(" ")} className={styles.seriesLine} />
            </g>
          );
        })}
        {tickIndexes.map((index) => (
          <text key={points[index].period} x={x(index)} y="231" textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"} className={styles.axisText}>
            {dateLabel(points[index].period)}
          </text>
        ))}
        {points.map((point, index) => (
          <g key={point.period} onMouseEnter={() => setSelected(index)} onMouseLeave={() => setSelected(null)} onClick={() => setSelected(index)}>
            <circle cx={x(index)} cy={y(point.profiles)} r="16" fill="transparent" />
            <circle cx={x(index)} cy={y(point.profiles)} r={selected === index || index === points.length - 1 ? 5.5 : 3.5} className={styles.dataPoint} />
          </g>
        ))}
        {selectedPoint && selected !== null && (
          <g aria-hidden="true" className={styles.tooltip}>
            <rect x={Math.max(58, Math.min(x(selected) - 62, 596))} y={Math.max(1, y(selectedPoint.profiles) - 49)} width="124" height="40" rx="4" />
            <text x={Math.max(58, Math.min(x(selected) - 62, 596)) + 10} y={Math.max(1, y(selectedPoint.profiles) - 49) + 16} className={styles.tooltipValue}>
              {numberFormatter.format(selectedPoint.profiles)}
            </text>
            <text x={Math.max(58, Math.min(x(selected) - 62, 596)) + 10} y={Math.max(1, y(selectedPoint.profiles) - 49) + 31} className={styles.tooltipDate}>
              {dateLabel(selectedPoint.period)}
            </text>
          </g>
        )}
      </svg>
      <ul className="sr-only">
        {points.map((point) => <li key={point.period}>{t("pointAccessibility", { date: dateLabel(point.period), count: point.profiles })}</li>)}
      </ul>
    </div>
  );
}
