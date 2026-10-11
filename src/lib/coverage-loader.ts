import { config } from "@/lib/config";
import { coverageRows, coverageSnapshot, decodeCoveragePayload } from "@/lib/coverage-data";
import { loadCoverageData, type CoverageData } from "@/lib/coverage-load";

export type { CoverageData } from "@/lib/coverage-load";

export async function getCoverageData(): Promise<CoverageData> {
  return loadCoverageData(
    () => fetch(`${config.apiOrigin}/coverage`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    }),
    Array.isArray(coverageSnapshot.countries) && coverageRows.length > 0
      ? { rows: coverageRows, date: coverageSnapshot.sourceDate }
      : null,
    decodeCoveragePayload,
  );
}
