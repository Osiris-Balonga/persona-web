import snapshot from "@/content/coverage-snapshot.json";

export type CoverageStatus =
  | "available"
  | "pending-name-review"
  | "unavailable";
export type PhoneStatus =
  | "reserved-range"
  | "format-valid"
  | "unavailable"
  | "not-applicable";

export type CoverageRow = {
  code: string;
  name: string;
  status: CoverageStatus;
  postcodeCities: number;
  sampledCities: number;
  phone: PhoneStatus;
  continent: string | null;
  subregion: string | null;
};

export const coverageSnapshot = snapshot;
export const coverageRows = snapshot.countries as CoverageRow[];
export const coverageTotals = {
  all: coverageRows.length,
  available: coverageRows.filter((row) => row.status === "available").length,
  pending: coverageRows.filter((row) => row.status === "pending-name-review")
    .length,
  unavailable: coverageRows.filter((row) => row.status === "unavailable")
    .length,
  postcodeCities: coverageRows
    .filter((row) => row.status === "available")
    .reduce((sum, row) => sum + row.postcodeCities, 0),
  sampledCities: coverageRows
    .filter((row) => row.status === "available")
    .reduce((sum, row) => sum + row.sampledCities, 0),
};
