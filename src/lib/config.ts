const apiOrigin = (
  process.env.NEXT_PUBLIC_PERSONA_API_URL?.trim() ||
  "https://persona-dev.onrender.com"
).replace(/\/+$/, "");

const repositoryUrl = "https://github.com/Osiris-Balonga/persona";
const portraitOrigin = "https://persona-portraits.osirisbalonga.workers.dev";

export const config = {
  apiOrigin,
  peopleUrl: `${apiOrigin}/people`,
  repositoryUrl,
  apiDocsUrl: `${repositoryUrl}/blob/dev/docs/api.md`,
  examplePortraitUrl: `${portraitOrigin}/portraits/v1/thumbnail/p_1166.webp`,
} as const;
