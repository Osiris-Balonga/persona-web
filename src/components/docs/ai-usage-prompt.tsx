import { countryDisplayName } from "@/lib/country-display-name";
import type { DocLocale } from "@/lib/docs-content";
import { CodeBlock } from "./code-block";

type Props = {
  locale: DocLocale;
  country: string;
  kind: "testimonials" | "table";
  copyLabel: string;
  copiedLabel: string;
  announcement: string;
};

function exampleRequest(country: string, kind: Props["kind"], asOf: string) {
  return [
    "GET https://persona-dev.onrender.com/people",
    `count=${kind === "testimonials" ? 4 : 10}`,
    `nationality=${country}`,
    `residenceCountry=${country}`,
    ...(kind === "testimonials" ? ["ageGroup=adult"] : []),
    `fields=${kind === "testimonials" ? "name.full,nationality,location.city,location.country,picture.thumbnail" : "name.full,email,nationality,location.city,location.country"}`,
    `seed=docs-ai-${country.toLowerCase()}-${kind}`,
    `asOf=${asOf}`,
  ].join("\n");
}

export function AiUsagePrompt({
  locale,
  country,
  kind,
  copyLabel,
  copiedLabel,
  announcement,
}: Props) {
  const name = countryDisplayName(country, locale);
  const request = exampleRequest(
    country,
    kind,
    new Date().toISOString().slice(0, 10),
  );
  const value =
    locale === "fr"
      ? kind === "testimonials"
        ? `Crée une section de témoignages fictifs pour une boutique de démonstration en ${name}.\n\nRécupère 4 profils avec cette requête (les lignes après GET sont les paramètres de l’URL) :\n${request}\n\nUtilise uniquement les noms, les villes, les pays et les portraits présents dans results. Rédige de courts avis fictifs et affiche clairement « Témoignages de démonstration ». Si picture est null, montre les initiales. Si l’API est inaccessible, demande-moi la réponse JSON au lieu d’inventer des profils.`
        : `Crée une table de 10 utilisateurs fictifs de ${name} pour tester une interface CRM.\n\nRécupère les profils avec cette requête (les lignes après GET sont les paramètres de l’URL) :\n${request}\n\nUtilise uniquement les champs renvoyés dans results pour les colonnes Nom, E-mail, Ville et Pays. Ajoute une recherche par nom et une pagination. N’invente pas de statut, de solde ou d’autres champs absents de la réponse. Si l’API est inaccessible, demande-moi la réponse JSON.`
      : kind === "testimonials"
        ? `Create a fictional testimonials section for a demo shop in ${name}.\n\nFetch 4 profiles with this request (the lines after GET are URL query parameters):\n${request}\n\nUse only the names, cities, countries and portraits returned in results. Write short fictional quotes and clearly label the section “Demo testimonials”. If picture is null, show initials. If the API is unavailable, ask me for the JSON response instead of inventing profiles.`
        : `Create a table of 10 fictional users from ${name} to test a CRM interface.\n\nFetch the profiles with this request (the lines after GET are URL query parameters):\n${request}\n\nUse only fields returned in results for the Name, Email, City and Country columns. Add name search and pagination. Do not invent status, balance or other fields missing from the response. If the API is unavailable, ask me for the JSON response.`;

  return (
    <div className="mt-4">
      <p className="mb-2 flex items-center gap-2 text-xs text-[var(--persona-copy)]">
        <span className={`fi fi-${country.toLowerCase()}`} aria-hidden="true" />
        {locale === "fr" ? `Exemple pour ${name}` : `Example for ${name}`}
      </p>
      <CodeBlock
        value={value}
        language="text"
        label="PROMPT"
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
        announcement={announcement}
        wrap
      />
    </div>
  );
}
