export type PlaygroundPerson = {
  id?: string;
  gender?: string;
  name?: { first?: string; last?: string; full?: string };
  nationality?: string;
  dob?: { date?: string; age?: number; ageGroup?: string };
  location?: {
    city?: string | null;
    state?: string | null;
    country?: { code?: string; name?: string };
    formatted?: string;
  };
  email?: string | null;
  phone?: string | null;
  picture?: { large?: string; medium?: string; thumbnail?: string } | null;
};

export type PlaygroundResponse = {
  results: PlaygroundPerson[];
  meta?: {
    count?: number;
    asOf?: string;
    seed?: string | null;
    schemaVersion?: string;
    dataVersion?: string;
    catalogVersion?: string;
  };
};

export type ApiError = {
  error?: { code?: string; message?: string; parameter?: string };
};

export function isPlaygroundResponse(value: unknown): value is PlaygroundResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Partial<PlaygroundResponse>;
  return Array.isArray(response.results) && response.results.every((person) => person && typeof person === "object");
}
