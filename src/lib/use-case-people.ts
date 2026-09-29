import { featuredCountries } from "@/lib/featured-geography";

export type UseCasePerson = {
  id: string;
  name: string;
  email: string;
  city: string;
  countryCode: string;
  portrait: string | null;
};

type ApiPerson = {
  id?: unknown;
  name?: { full?: unknown };
  email?: unknown;
  location?: { city?: unknown; country?: { code?: unknown } };
  picture?: { medium?: unknown } | null;
};

const cache = new Map<string, { expires: number; people: UseCasePerson[] }>();
const pending = new Map<string, Promise<UseCasePerson[]>>();

export function resolveUseCaseCountry(rawCountry: string | null) {
  return featuredCountries(
    /^[a-z]{2}$/i.test(rawCountry ?? "") ? rawCountry : null,
  )[1];
}

export async function getUseCasePeople(
  rawCountry: string | null,
): Promise<UseCasePerson[]> {
  const country = resolveUseCaseCountry(rawCountry);
  const cached = cache.get(country);
  if (cached && cached.expires > Date.now()) return cached.people;
  const inFlight = pending.get(country);
  if (inFlight) return inFlight;

  const request = (async () => {
    const query = new URLSearchParams({
      count: "36",
      nationality: country,
      emailDomain: "example.test",
      seed: `persona-web-use-cases-v1-${country}`,
    });
    const origin =
      process.env.NEXT_PUBLIC_PERSONA_API_URL ||
      "https://persona-dev.onrender.com";
    const response = await fetch(
      `${origin.replace(/\/$/, "")}/people?${query}`,
      {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok) throw new Error(`Persona API ${response.status}`);
    const data: unknown = await response.json();
    const results = (data as { results?: unknown }).results;
    if (!Array.isArray(results)) throw new Error("Invalid Persona response");
    const people = results.flatMap((raw: ApiPerson) => {
      if (typeof raw.id !== "string" || typeof raw.name?.full !== "string")
        return [];
      return [
        {
          id: raw.id,
          name: raw.name.full,
          email: typeof raw.email === "string" ? raw.email : "",
          city: typeof raw.location?.city === "string" ? raw.location.city : "",
          countryCode:
            typeof raw.location?.country?.code === "string"
              ? raw.location.country.code
              : country,
          portrait:
            typeof raw.picture?.medium === "string" ? raw.picture.medium : null,
        },
      ];
    });
    if (people.length < 10) throw new Error("Not enough Persona profiles");
    cache.set(country, { expires: Date.now() + 86400000, people });
    return people;
  })().finally(() => pending.delete(country));
  pending.set(country, request);
  return request;
}
