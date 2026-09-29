import response from "@/content/people-response-v2.json";

export const firstRequest = "curl -i 'https://persona-dev.onrender.com/people?count=1&nationality=FR&residenceCountry=CG&city=Brazzaville&ageGroup=adult,senior&seed=guide-v2&asOf=2026-09-28'";

export const javascriptRequest = `const url = new URL('https://persona-dev.onrender.com/people');
url.search = new URLSearchParams({
  count: '1', nationality: 'FR', residenceCountry: 'CG',
  city: 'Brazzaville', ageGroup: 'adult,senior',
  seed: 'guide-v2', asOf: '2026-09-28'
}).toString();

const response = await fetch(url);
if (!response.ok) {
  const { error } = await response.json();
  throw new Error(\`Persona \${response.status}: \${error.code} — \${error.message}\`);
}
const { results, meta } = await response.json();
console.log(results[0].name.full, meta.schemaVersion);`;

export const fieldsRequest = "curl 'https://persona-dev.onrender.com/people?seed=demo&asOf=2026-09-28&fields=name.first,location.city,location.coordinates.latitude,picture.thumbnail'";

export const replayRequest = "curl -i -H 'If-None-Match: <etag-from-first-response>' 'https://persona-dev.onrender.com/people?seed=guide-v2&asOf=2026-09-28'";

export const sampleResponse = JSON.stringify(response, null, 2);
