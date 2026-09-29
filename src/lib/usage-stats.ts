import "server-only";
import { summarizeUsage, usageWindow } from "@/lib/usage-stats-core";

const analyticsOrigin = "https://persona-analytics.osirisbalonga.workers.dev";

export async function getUsageStats(now = new Date()) {
  const token = process.env.ANALYTICS_READ_TOKEN;
  if (!token) throw new Error("Analytics read token is not configured");

  const window = usageWindow(now);
  const environment = process.env.ANALYTICS_ENVIRONMENT === "production" ? "production" : "staging";
  const query = new URLSearchParams({
    environment,
    from: window.from,
    to: window.to,
    granularity: "day",
  });
  const response = await fetch(`${analyticsOrigin}/v1/stats?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) throw new Error(`Analytics responded with ${response.status}`);
  return { ...summarizeUsage(await response.json(), window.today), window, environment };
}
