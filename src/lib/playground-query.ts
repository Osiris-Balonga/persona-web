export type PlaygroundOptions = {
  count: number;
  gender: "" | "female" | "male";
  ageGroups: string[];
  continent: string;
  nationality: string;
  residenceCountry: string;
  city: string;
  emailDomain: string;
  seed: string;
  asOf: string;
  fields: string[];
};

export const defaultPlaygroundOptions: PlaygroundOptions = {
  count: 3,
  gender: "",
  ageGroups: [],
  continent: "",
  nationality: "",
  residenceCountry: "",
  city: "",
  emailDomain: "example.test",
  seed: "playground-demo",
  asOf: "",
  fields: [],
};

export type QueryProblem =
  | "count"
  | "city"
  | "nationality"
  | "emailDomain"
  | "seed"
  | "asOf"
  | "url";

export const continentCodes: Record<string, string> = {
  africa: "002",
  americas: "019",
  asia: "142",
  europe: "150",
  oceania: "009",
};

export const playgroundAgeGroups = [
  "child",
  "teen",
  "adult",
  "senior",
] as const;
export const playgroundFields = [
  "id",
  "gender",
  "name",
  "nationality",
  "dob",
  "location",
  "email",
  "phone",
  "picture",
  "login",
] as const;

const optionKeys = [
  "count",
  "gender",
  "ageGroup",
  "continent",
  "nationality",
  "residenceCountry",
  "city",
  "emailDomain",
  "seed",
  "asOf",
  "fields",
] as const;

export function parsePlaygroundOptions(
  params: Pick<URLSearchParams, "get">,
): PlaygroundOptions {
  const count = Number(params.get("count"));
  const gender = params.get("gender");
  const continent = params.get("continent") ?? "";
  const ageGroups = (params.get("ageGroup") ?? "")
    .split(",")
    .filter((group) =>
      playgroundAgeGroups.includes(
        group as (typeof playgroundAgeGroups)[number],
      ),
    );
  const fields = (params.get("fields") ?? "")
    .split(",")
    .filter((field) =>
      playgroundFields.includes(field as (typeof playgroundFields)[number]),
    );
  return {
    count:
      params.get("count") !== null && Number.isFinite(count)
        ? count
        : defaultPlaygroundOptions.count,
    gender: gender === "female" || gender === "male" ? gender : "",
    ageGroups: [...new Set(ageGroups)],
    continent: continent in continentCodes ? continent : "",
    nationality: (params.get("nationality") ?? "").toUpperCase(),
    residenceCountry: (params.get("residenceCountry") ?? "").toUpperCase(),
    city: params.get("city") ?? "",
    emailDomain:
      params.get("emailDomain") ?? defaultPlaygroundOptions.emailDomain,
    seed: params.get("seed") ?? defaultPlaygroundOptions.seed,
    asOf: params.get("asOf") ?? "",
    fields: [...new Set(fields)],
  };
}

export function buildPlaygroundPageUrl(
  currentUrl: string,
  options: PlaygroundOptions,
): string {
  const url = new URL(currentUrl);
  const query = url.searchParams;
  for (const key of optionKeys) query.delete(key);
  if (options.count !== defaultPlaygroundOptions.count)
    query.set("count", String(options.count));
  if (options.gender) query.set("gender", options.gender);
  if (options.ageGroups.length)
    query.set("ageGroup", options.ageGroups.join(","));
  if (options.continent) query.set("continent", options.continent);
  if (options.nationality) query.set("nationality", options.nationality);
  if (options.residenceCountry)
    query.set("residenceCountry", options.residenceCountry);
  if (options.city) query.set("city", options.city);
  if (options.emailDomain !== defaultPlaygroundOptions.emailDomain)
    query.set("emailDomain", options.emailDomain);
  if (options.seed !== defaultPlaygroundOptions.seed)
    query.set("seed", options.seed);
  if (options.asOf) query.set("asOf", options.asOf);
  if (options.fields.length) query.set("fields", options.fields.join(","));
  return `${url.pathname}${url.search}${url.hash}`;
}

export function validatePlaygroundOptions(
  options: PlaygroundOptions,
  nationalityContinent?: string | null,
): QueryProblem | null {
  if (
    !Number.isInteger(options.count) ||
    options.count < 1 ||
    options.count > 100
  )
    return "count";
  if (options.city.trim() && !options.residenceCountry && !options.nationality)
    return "city";
  if (
    options.continent &&
    options.nationality &&
    nationalityContinent !== continentCodes[options.continent]
  )
    return "nationality";
  if (
    options.emailDomain.trim() &&
    !/^(?=.{4,253}$)[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(
      options.emailDomain.trim(),
    )
  )
    return "emailDomain";
  if (options.seed.trim().length > 128) return "seed";
  if (options.asOf && !/^\d{4}-\d{2}-\d{2}$/.test(options.asOf)) return "asOf";
  return null;
}

export function buildPeopleUrl(
  apiOrigin: string,
  options: PlaygroundOptions,
): URL {
  const url = new URL("/people", apiOrigin);
  const query = url.searchParams;
  query.set("count", String(options.count));
  if (options.gender) query.set("gender", options.gender);
  if (options.ageGroups.length)
    query.set("ageGroup", options.ageGroups.join(","));
  if (options.continent) query.set("continent", options.continent);
  if (options.nationality) query.set("nationality", options.nationality);
  if (options.residenceCountry)
    query.set("residenceCountry", options.residenceCountry);
  if (options.city.trim()) query.set("city", options.city.trim());
  if (options.emailDomain.trim())
    query.set("emailDomain", options.emailDomain.trim().toLowerCase());
  if (options.seed.trim()) query.set("seed", options.seed.trim());
  if (options.asOf) query.set("asOf", options.asOf);
  if (options.fields.length) query.set("fields", options.fields.join(","));
  return url;
}
