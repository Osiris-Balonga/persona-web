export const docSlugs = [
  "overview", "people", "parameters", "response", "errors", "coverage", "replay", "limits",
] as const;

export type DocSlug = "quickstart" | (typeof docSlugs)[number];
export type DocLocale = "fr" | "en";

type Table = { headers: string[]; rows: string[][] };
type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  code?: { language: string; value: string; label?: string };
  bullets?: string[];
  table?: Table;
  note?: string;
};
type Page = { title: string; description: string; sections: Section[] };
type NavigationGroup = { title: string; items: { slug: DocSlug; label: string }[] };

export type DocsDictionary = {
  label: string;
  onThisPage: string;
  copy: string;
  copied: string;
  copiedDescription: string;
  openPlayground: string;
  navigation: NavigationGroup[];
  pages: Record<DocSlug, Page>;
};

export const docs: Record<DocLocale, DocsDictionary> = {
  fr: {
    label: "Documentation",
    onThisPage: "Sur cette page",
    copy: "Copier",
    copied: "Copié",
    copiedDescription: "Code copié dans le presse-papiers",
    openPlayground: "Essayer /people",
    navigation: [
      { title: "Démarrer", items: [{ slug: "overview", label: "Vue d’ensemble" }, { slug: "quickstart", label: "Première requête" }] },
      { title: "Référence", items: [{ slug: "people", label: "GET /people" }, { slug: "parameters", label: "Paramètres" }, { slug: "response", label: "Réponse" }, { slug: "errors", label: "Erreurs" }] },
      { title: "Comprendre les données", items: [{ slug: "coverage", label: "Pays et couverture" }, { slug: "replay", label: "Résultats reproductibles" }, { slug: "limits", label: "Limites et sécurité" }] },
    ],
    pages: {
      quickstart: {
        title: "Première requête",
        description: "Récupérez des personnes fictives cohérentes depuis l’API publique en une seule requête. Aucune clé API n’est nécessaire.",
        sections: [
          { id: "request", title: "Faire une requête", paragraphs: ["Envoyez une requête GET à l’endpoint public. Cet exemple fixe la graine et la date de référence pour pouvoir rejouer le résultat."], code: { language: "bash", value: "curl 'https://persona-dev.onrender.com/people?count=1&seed=guide-v2&asOf=2026-09-28'" } },
          { id: "response", title: "Lire la réponse", paragraphs: ["La réponse contient un tableau `results` et un objet `meta`. Le nom, la date de naissance et le lieu sont structurés. Cet extrait correspond à la requête ci-dessus avec les versions de données indiquées dans `meta` ; il peut évoluer après une mise à jour."], code: { language: "json", label: "Extrait de la réponse v2", value: `{
  "results": [
    {
      "id": "per_b79c5a19b88f5f1ff40446c1",
      "gender": "male",
      "name": { "first": "Edwin", "last": "Fernández", "full": "Edwin Fernández" },
      "nationality": "PR",
      "dob": { "date": "1992-12-29", "age": 33, "ageGroup": "adult" },
      "location": { "city": "Caguas", "country": { "code": "PR", "name": "Puerto Rico" } },
      "email": "e.fernandez.3yx00@example.test",
      "phone": "+17875550116",
      "picture": { "thumbnail": "https://persona-portraits.osirisbalonga.workers.dev/portraits/v1/thumbnail/p_1166.webp" }
    }
  ],
  "meta": { "count": 1, "asOf": "2026-09-28", "seed": "guide-v2", "dataVersion": "geo-2026-09-26.1", "catalogVersion": "v1", "schemaVersion": "2" }
}` } },
          { id: "replay", title: "Reproduire le résultat", paragraphs: ["Fournissez explicitement `seed` et `asOf`. Les mêmes filtres produisent alors les mêmes personnes tant que les versions des données, du catalogue et de l’algorithme ne changent pas."], bullets: ["`count` accepte de 1 à 100 profils et vaut 1 par défaut.", "`seed` est une chaîne non vide de 128 caractères maximum.", "`asOf` est une date au format YYYY-MM-DD ; sans ce paramètre, l’API utilise la date UTC du jour."] },
        ],
      },
      overview: {
        title: "Comprendre Persona",
        description: "Une API HTTP publique pour générer des profils fictifs cohérents, avec des données réalistes pour vos produits et vos tests.",
        sections: [
          { id: "what", title: "Ce que renvoie Persona", paragraphs: ["`GET /people` génère un nom, une nationalité, une date de naissance, un lieu et des coordonnées. Un portrait WebP peut être présent lorsqu’une image approuvée correspond au profil."], bullets: ["Accès public sans clé API.", "Réponse JSON version 2, composée de `results` et `meta`.", "De 1 à 100 profils par requête."] },
          { id: "where", title: "Commencer", paragraphs: ["La première requête ci-contre suffit pour voir un résultat. Le Playground permet d’explorer les filtres sans écrire de code."] },
          { id: "care", title: "À savoir", note: "Les adresses sont illustratives. Certains numéros au format valide peuvent appartenir à de vrais abonnés : ne contactez jamais les personnes ou coordonnées générées." },
        ],
      },
      people: {
        title: "GET /people",
        description: "Générez un ou plusieurs profils fictifs. Tous les filtres se transmettent dans la query string ; il n’y a ni corps de requête ni authentification.",
        sections: [
          { id: "endpoint", title: "Endpoint", code: { language: "http", value: "GET https://persona-dev.onrender.com/people" }, paragraphs: ["L’API accepte GET et HEAD. Les navigateurs peuvent effectuer ces requêtes depuis toute origine, sans credentials."] },
          { id: "example", title: "Exemple ciblé", code: { language: "bash", value: "curl 'https://persona-dev.onrender.com/people?nationality=FR&residenceCountry=CG&city=Brazzaville&ageGroup=adult,senior&count=1&seed=demo&asOf=2026-09-28'" }, paragraphs: ["Ici, la personne a la nationalité française et réside à Brazzaville. La ville dépend du pays de résidence."] },
          { id: "filters", title: "Comment les filtres interagissent", bullets: ["`continent` limite la nationalité, pas le pays de résidence.", "Si seul `nationality` ou `residenceCountry` est fourni, ce pays est utilisé pour les deux.", "Une nationalité hors du continent demandé provoque une erreur 400.", "`age` et `appearance` ne sont pas des paramètres acceptés."] },
        ],
      },
      parameters: {
        title: "Paramètres",
        description: "Les paramètres de `GET /people` sont facultatifs. Les valeurs inconnues, répétées ou incompatibles sont rejetées.",
        sections: [
          { id: "all", title: "Filtres disponibles", table: { headers: ["Paramètre", "Valeur", "Rôle"], rows: [
            ["count", "1–100 · défaut 1", "Nombre de profils"], ["gender", "male, female", "Genre"], ["ageGroup", "child, teen, adult, senior", "Un ou plusieurs groupes séparés par des virgules"], ["nationality", "Code ISO à deux lettres", "Nationalité disposant d’un jeu de noms validé"], ["residenceCountry", "Code ISO à deux lettres", "Pays contenant une ville disponible"], ["continent", "africa, americas, asia, europe, oceania", "Limite les nationalités"], ["city", "Ville du pays de résidence", "Nécessite un pays"], ["emailDomain", "Domaine ASCII · défaut example.test", "Domaine des emails générés"], ["seed", "1–128 caractères", "Graine de génération"], ["asOf", "YYYY-MM-DD", "Date de référence UTC"], ["fields", "Chemins séparés par des virgules", "Sélection des champs renvoyés"],
          ] } },
          { id: "age", title: "Groupes d’âge", paragraphs: ["Les groupes sont `child` (6–12 ans), `teen` (13–17), `adult` (18–64) et `senior` (65–100). Plusieurs valeurs distinctes peuvent être combinées : `ageGroup=adult,senior`."] },
          { id: "fields", title: "Choisir les champs", paragraphs: ["`fields` sélectionne les propriétés de chaque personne. `results` et `meta` restent présents. Sans ce paramètre, tous les champs publics sont inclus sauf `login`, qui est facultatif."], code: { language: "http", value: "GET /people?fields=name.first,location.city,location.coordinates.latitude,picture.thumbnail" }, note: "Une combinaison parent/enfant telle que `name,name.first` est rejetée avec le statut 400. La query string encodée est limitée à 2 048 caractères." },
        ],
      },
      response: {
        title: "Réponse",
        description: "La réponse version 2 contient les profils dans `results` et les informations de génération dans `meta`.",
        sections: [
          { id: "shape", title: "Structure JSON", table: { headers: ["Champ", "Contenu"], rows: [
            ["results[].id", "Identifiant synthétique"], ["results[].name", "first, last, full"], ["results[].dob", "date, age, ageGroup"], ["results[].location", "Adresse illustrative, ville, pays, code postal, coordonnées de ville"], ["results[].email / phone", "Coordonnées générées ; phone peut être null"], ["results[].picture", "URLs WebP large, medium, thumbnail ou null"], ["meta", "count, asOf, seed, schemaVersion, dataVersion, catalogVersion"],
          ] } },
          { id: "nullable", title: "Champs parfois absents", paragraphs: ["`picture` vaut `null` si aucun portrait approuvé ne correspond. `phone`, `street`, `state` et `postcode` peuvent aussi valoir `null`. `login` est omis par défaut et n’apparaît qu’avec `fields=login` ou un de ses chemins enfants."], note: "Les coordonnées ont `precision: \"city\" et désignent le point GeoNames de la ville, jamais l’emplacement d’une personne ou d’une rue." },
          { id: "example", title: "Exemple minimal de lecture", code: { language: "js", value: `const response = await fetch('https://persona-dev.onrender.com/people?count=1');
if (!response.ok) throw new Error(\`Persona returned \${response.status}\`);
const { results, meta } = await response.json();
console.log(results[0].name.full, results[0].location.city, meta.schemaVersion);` } },
        ],
      },
      errors: {
        title: "Erreurs",
        description: "Les erreurs HTTP ont un objet `error` avec `code`, `message` et, si pertinent, `parameter`.",
        sections: [
          { id: "codes", title: "Statuts et codes", table: { headers: ["Statut", "Code", "Action"], rows: [
            ["400", "INVALID_QUERY", "Corriger un paramètre mal formé, répété ou inconnu"], ["400", "CONFLICTING_FILTERS", "Résoudre un conflit entre continent, nationalité ou ville"], ["400", "UNSUPPORTED_VALUE", "Choisir un pays ou une ville pris en charge"], ["429", "RATE_LIMITED", "Attendre la durée indiquée par Retry-After"], ["503", "RESPONSE_TOO_LARGE", "Réduire count ou sélectionner moins de champs"],
          ] } },
          { id: "retry", title: "Gérer le quota", paragraphs: ["Le quota par défaut est de 30 requêtes par minute, par IP et par instance. Une réponse 429 inclut `Retry-After` en secondes. Attendez au moins cette durée avant de réessayer."], code: { language: "js", value: `if (response.status === 429) {
  const seconds = Number(response.headers.get('Retry-After') ?? 1);
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}` } },
          { id: "other", title: "Autres réponses", paragraphs: ["Une route inconnue renvoie 404 ; une méthode non prise en charge renvoie 405. Une réponse dépassant 256 Kio renvoie 503 avec `RESPONSE_TOO_LARGE`."] },
        ],
      },
      coverage: {
        title: "Pays et couverture",
        description: "La disponibilité des profils, noms, villes, codes postaux et numéros varie selon le pays ou territoire.",
        sections: [
          { id: "check", title: "Consulter la couverture", paragraphs: ["La page Couverture affiche les données publiées par l’API. Vérifiez les pays concernés avant de fixer une nationalité ou un pays de résidence dans votre intégration."], note: "Un code de pays reconnu ne garantit pas qu’un jeu de noms validé soit disponible pour générer une nationalité." },
          { id: "place", title: "Lieu et nationalité", bullets: ["La nationalité utilise un jeu de noms validé.", "Le pays de résidence détermine la ville et la numérotation téléphonique.", "`continent` filtre uniquement la nationalité.", "Les codes postaux couvrent certaines villes échantillonnées, pas toutes les adresses."] },
          { id: "open", title: "Explorer les pays", paragraphs: ["Ouvrez la page Couverture pour filtrer les pays et voir les données disponibles en direct."] },
        ],
      },
      replay: {
        title: "Résultats reproductibles",
        description: "Une graine explicite et une date de référence stable permettent de retrouver les mêmes profils pour vos tests.",
        sections: [
          { id: "inputs", title: "Fixer seed et asOf", code: { language: "bash", value: "curl 'https://persona-dev.onrender.com/people?count=3&seed=ma-suite-de-tests&asOf=2026-09-28'" }, paragraphs: ["À filtres et versions inchangés, `seed` et `asOf` reproduisent les personnes générées. Sans `seed`, l’API utilise une nouvelle entropie et `meta.seed` vaut `null`."] },
          { id: "versions", title: "Garder les versions en tête", paragraphs: ["La répétabilité dépend aussi de `dataVersion`, `catalogVersion` et de la version de l’algorithme. `count` et `fields` ne changent pas l’identité ou le choix du portrait d’une personne déjà générée ; `emailDomain` change l’adresse email."], note: "Un résultat n’est pas garanti identique après une mise à jour des données, du catalogue ou de l’algorithme." },
          { id: "cache", title: "Réutiliser une réponse", paragraphs: ["Une requête avec `seed` et `asOf` explicites reçoit un `ETag` et `Cache-Control: private, no-cache`. Envoyez `If-None-Match` avec cet ETag pour obtenir 304 si la réponse n’a pas changé. Les autres réponses utilisent `Cache-Control: no-store`."] },
        ],
      },
      limits: {
        title: "Limites et sécurité",
        description: "Quelques règles suffisent pour utiliser Persona sans surcharger l’API ni confondre les données fictives avec de vraies coordonnées.",
        sections: [
          { id: "limits", title: "Limites de service", bullets: ["30 requêtes par minute, par IP et par instance ; 429 et Retry-After au-delà.", "Query string encodée : 2 048 caractères maximum.", "Réponse : 256 Kio maximum ; sinon 503 RESPONSE_TOO_LARGE.", "Accès navigateur : GET et HEAD depuis toute origine, sans credentials."] },
          { id: "safety", title: "Utiliser les données avec prudence", paragraphs: ["Les adresses sont illustratives et ne sont pas vérifiées pour la livraison. Les coordonnées géographiques correspondent à une ville. Les portraits peuvent être absents."], note: "Des numéros de secours au format valide peuvent appartenir à de vrais abonnés. Ne passez aucun appel, SMS ou email vers des coordonnées générées, surtout si vous choisissez un domaine email réel." },
        ],
      },
    },
  },
  en: {
    label: "Documentation", onThisPage: "On this page", copy: "Copy", copied: "Copied", copiedDescription: "Code copied to clipboard", openPlayground: "Try /people",
    navigation: [
      { title: "Start here", items: [{ slug: "overview", label: "Overview" }, { slug: "quickstart", label: "First request" }] },
      { title: "Reference", items: [{ slug: "people", label: "GET /people" }, { slug: "parameters", label: "Parameters" }, { slug: "response", label: "Response" }, { slug: "errors", label: "Errors" }] },
      { title: "Understand the data", items: [{ slug: "coverage", label: "Countries and coverage" }, { slug: "replay", label: "Repeatable results" }, { slug: "limits", label: "Limits and safety" }] },
    ],
    pages: {
      quickstart: { title: "First request", description: "Retrieve coherent fictional people from the public API with one request. No API key is required.", sections: [
        { id: "request", title: "Make a request", paragraphs: ["Send a GET request to the public endpoint. This example fixes the seed and reference date so the result can be replayed."], code: { language: "bash", value: "curl 'https://persona-dev.onrender.com/people?count=1&seed=guide-v2&asOf=2026-09-28'" } },
        { id: "response", title: "Read the response", paragraphs: ["The response contains a `results` array and a `meta` object. Names, birth dates and locations are structured. This excerpt matches the request above with the data versions shown in `meta`; it may change after an update."], code: { language: "json", label: "Excerpt from the v2 response", value: `{
  "results": [
    {
      "id": "per_b79c5a19b88f5f1ff40446c1",
      "gender": "male",
      "name": { "first": "Edwin", "last": "Fernández", "full": "Edwin Fernández" },
      "nationality": "PR",
      "dob": { "date": "1992-12-29", "age": 33, "ageGroup": "adult" },
      "location": { "city": "Caguas", "country": { "code": "PR", "name": "Puerto Rico" } },
      "email": "e.fernandez.3yx00@example.test",
      "phone": "+17875550116",
      "picture": { "thumbnail": "https://persona-portraits.osirisbalonga.workers.dev/portraits/v1/thumbnail/p_1166.webp" }
    }
  ],
  "meta": { "count": 1, "asOf": "2026-09-28", "seed": "guide-v2", "dataVersion": "geo-2026-09-26.1", "catalogVersion": "v1", "schemaVersion": "2" }
}` } },
        { id: "replay", title: "Replay the result", paragraphs: ["Provide both `seed` and `asOf` explicitly. The same filters then yield the same people while the data, catalog and algorithm versions remain unchanged."], bullets: ["`count` accepts 1 to 100 people and defaults to 1.", "`seed` is a nonblank string of up to 128 characters.", "`asOf` uses YYYY-MM-DD; without it, the API uses the current UTC date."] },
      ] },
      overview: { title: "Understand Persona", description: "A public HTTP API for coherent fictional profiles with realistic data for products and tests.", sections: [
        { id: "what", title: "What Persona returns", paragraphs: ["`GET /people` generates a name, nationality, date of birth, location and contact details. An approved WebP portrait may be included when one matches the profile."], bullets: ["Public access without an API key.", "Version 2 JSON response with `results` and `meta`.", "1 to 100 profiles per request."] },
        { id: "where", title: "Start here", paragraphs: ["The first request is enough to see a result. The Playground lets you explore filters without writing code."] },
        { id: "care", title: "Keep in mind", note: "Addresses are illustrative. Some format-valid phone numbers may belong to real subscribers: never contact generated people or contact details." },
      ] },
      people: { title: "GET /people", description: "Generate one or more fictional profiles. Filters are sent in the query string; no request body or authentication is needed.", sections: [
        { id: "endpoint", title: "Endpoint", code: { language: "http", value: "GET https://persona-dev.onrender.com/people" }, paragraphs: ["The API accepts GET and HEAD. Browsers can make these requests from any origin without credentials."] },
        { id: "example", title: "Targeted example", code: { language: "bash", value: "curl 'https://persona-dev.onrender.com/people?nationality=FR&residenceCountry=CG&city=Brazzaville&ageGroup=adult,senior&count=1&seed=demo&asOf=2026-09-28'" }, paragraphs: ["Here the person is French and lives in Brazzaville. The city belongs to the residence country."] },
        { id: "filters", title: "How filters interact", bullets: ["`continent` limits nationality, not residence.", "If only `nationality` or `residenceCountry` is provided, it is used for both.", "A nationality outside the requested continent returns 400.", "`age` and `appearance` are not accepted parameters."] },
      ] },
      parameters: { title: "Parameters", description: "All `GET /people` parameters are optional. Unknown, repeated or incompatible values are rejected.", sections: [
        { id: "all", title: "Available filters", table: { headers: ["Parameter", "Value", "Purpose"], rows: [
          ["count", "1–100 · default 1", "Number of profiles"], ["gender", "male, female", "Gender"], ["ageGroup", "child, teen, adult, senior", "One or more comma-separated groups"], ["nationality", "Two-letter ISO code", "Nationality with a reviewed name pool"], ["residenceCountry", "Two-letter ISO code", "Country with an available city"], ["continent", "africa, americas, asia, europe, oceania", "Limits nationalities"], ["city", "City in residence country", "Requires a country"], ["emailDomain", "ASCII domain · default example.test", "Generated email domain"], ["seed", "1–128 characters", "Generation seed"], ["asOf", "YYYY-MM-DD", "UTC reference date"], ["fields", "Comma-separated paths", "Select returned fields"],
        ] } },
        { id: "age", title: "Age groups", paragraphs: ["The groups are `child` (6–12), `teen` (13–17), `adult` (18–64) and `senior` (65–100). Distinct values can be combined: `ageGroup=adult,senior`."] },
        { id: "fields", title: "Select fields", paragraphs: ["`fields` selects properties of each person. `results` and `meta` remain. Without it, all public fields except `login` are included."], code: { language: "http", value: "GET /people?fields=name.first,location.city,location.coordinates.latitude,picture.thumbnail" }, note: "A parent/child combination such as `name,name.first` returns 400. The encoded query string is limited to 2,048 characters." },
      ] },
      response: { title: "Response", description: "The version 2 response holds profiles in `results` and generation information in `meta`.", sections: [
        { id: "shape", title: "JSON structure", table: { headers: ["Field", "Contents"], rows: [
          ["results[].id", "Synthetic ID"], ["results[].name", "first, last, full"], ["results[].dob", "date, age, ageGroup"], ["results[].location", "Illustrative address, city, country, postcode, city coordinates"], ["results[].email / phone", "Generated contact details; phone may be null"], ["results[].picture", "WebP large, medium, thumbnail URLs or null"], ["meta", "count, asOf, seed, schemaVersion, dataVersion, catalogVersion"],
        ] } },
        { id: "nullable", title: "Fields that may be missing", paragraphs: ["`picture` is `null` when no approved portrait matches. `phone`, `street`, `state` and `postcode` can also be `null`. `login` is omitted by default and only appears with `fields=login` or one of its child paths."], note: "Coordinates use `precision: \"city\" and identify a GeoNames city point, never a person or street." },
        { id: "example", title: "Minimal reading example", code: { language: "js", value: `const response = await fetch('https://persona-dev.onrender.com/people?count=1');
if (!response.ok) throw new Error(\`Persona returned \${response.status}\`);
const { results, meta } = await response.json();
console.log(results[0].name.full, results[0].location.city, meta.schemaVersion);` } },
      ] },
      errors: { title: "Errors", description: "HTTP errors contain an `error` object with `code`, `message` and, when relevant, `parameter`.", sections: [
        { id: "codes", title: "Statuses and codes", table: { headers: ["Status", "Code", "Action"], rows: [
          ["400", "INVALID_QUERY", "Fix malformed, repeated or unknown parameters"], ["400", "CONFLICTING_FILTERS", "Resolve mismatched continent, nationality or city"], ["400", "UNSUPPORTED_VALUE", "Choose a supported country or city"], ["429", "RATE_LIMITED", "Wait for Retry-After"], ["503", "RESPONSE_TOO_LARGE", "Lower count or select fewer fields"],
        ] } },
        { id: "retry", title: "Handle rate limits", paragraphs: ["The default limit is 30 requests per minute per IP per instance. A 429 response includes `Retry-After` in seconds. Wait at least that long before retrying."], code: { language: "js", value: `if (response.status === 429) {
  const seconds = Number(response.headers.get('Retry-After') ?? 1);
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}` } },
        { id: "other", title: "Other responses", paragraphs: ["Unknown routes return 404 and unsupported methods return 405. A response over 256 KiB returns 503 with `RESPONSE_TOO_LARGE`."] },
      ] },
      coverage: { title: "Countries and coverage", description: "Profiles, names, cities, postcodes and phone data vary by country or territory.", sections: [
        { id: "check", title: "Check coverage", paragraphs: ["The Coverage page shows data published by the API. Check the countries you need before fixing a nationality or residence country in your integration."], note: "A recognized country code does not guarantee that a reviewed name pool is available for nationality generation." },
        { id: "place", title: "Location and nationality", bullets: ["Nationality uses a reviewed name pool.", "Residence country determines the city and phone numbering country.", "`continent` filters nationality only.", "Postcodes cover some sampled cities, not every address."] },
        { id: "open", title: "Explore countries", paragraphs: ["Open the Coverage page to filter countries and inspect available data live."] },
      ] },
      replay: { title: "Repeatable results", description: "An explicit seed and stable reference date let you retrieve the same profiles for tests.", sections: [
        { id: "inputs", title: "Set seed and asOf", code: { language: "bash", value: "curl 'https://persona-dev.onrender.com/people?count=3&seed=my-test-suite&asOf=2026-09-28'" }, paragraphs: ["With unchanged filters and versions, `seed` and `asOf` reproduce the people. Without `seed`, the API draws new entropy and `meta.seed` is `null`."] },
        { id: "versions", title: "Account for versions", paragraphs: ["Repeatability also depends on `dataVersion`, `catalogVersion` and the algorithm version. `count` and `fields` do not change an existing person's identity or portrait choice; `emailDomain` changes the email address."], note: "Results are not guaranteed to match after a data, catalog or algorithm update." },
        { id: "cache", title: "Reuse a response", paragraphs: ["A request with explicit `seed` and `asOf` receives an `ETag` and `Cache-Control: private, no-cache`. Send `If-None-Match` with that ETag to get 304 if unchanged. Other responses use `Cache-Control: no-store`."] },
      ] },
      limits: { title: "Limits and safety", description: "A few rules help you use Persona without overloading the API or mistaking fictional data for real contact details.", sections: [
        { id: "limits", title: "Service limits", bullets: ["30 requests per minute per IP per instance; 429 and Retry-After beyond that.", "Encoded query string: 2,048 characters maximum.", "Response: 256 KiB maximum; otherwise 503 RESPONSE_TOO_LARGE.", "Browser access: GET and HEAD from any origin without credentials."] },
        { id: "safety", title: "Use data carefully", paragraphs: ["Addresses are illustrative and not verified delivery destinations. Geographic coordinates represent a city. Portraits may be absent."], note: "Format-valid fallback numbers may belong to real subscribers. Never call, text or email generated contacts, especially if you choose a live email domain." },
      ] },
    },
  },
};

export function isDocSlug(value: string): value is DocSlug {
  return value === "quickstart" || docSlugs.some((slug) => slug === value);
}

export function docHref(slug: DocSlug) {
  return slug === "quickstart" ? "/docs" : `/docs/${slug}`;
}
