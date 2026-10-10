import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPeopleUrl,
  buildPlaygroundPageUrl,
  defaultPlaygroundOptions,
  parsePlaygroundOptions,
  validatePlaygroundOptions,
} from "../src/lib/playground-query.ts";

test("the compatibility switch omits portrait contexts for older APIs", () => {
  const options = { ...defaultPlaygroundOptions, portraitContexts: ["doctor", "business"] };
  assert.equal(buildPeopleUrl("https://persona.test", options).searchParams.has("portraitContexts"), false);
  const enabled = buildPeopleUrl("https://persona.test", options, true);
  assert.equal(enabled.searchParams.get("portraitContexts"), "doctor,business");
  assert.equal(enabled.searchParams.has("portraitContext"), false);
});

test("all five portrait types are explicit when enabled, while zero stays explicit and survives refresh", () => {
  assert.equal(buildPeopleUrl("https://persona.test", defaultPlaygroundOptions, true).searchParams.get("portraitContexts"), "standard,doctor,construction,business,school-pupil");
  const options = { ...defaultPlaygroundOptions, portraitContexts: [] };
  const enabled = buildPeopleUrl("https://persona.test", options, true);
  assert.equal(enabled.searchParams.has("portraitContexts"), true);
  assert.equal(enabled.searchParams.get("portraitContexts"), "");
  const page = new URL(buildPlaygroundPageUrl("https://persona.test/fr/playground", options), "https://persona.test");
  assert.equal(page.searchParams.has("portraitContexts"), true);
  assert.deepEqual(parsePlaygroundOptions(page.searchParams).portraitContexts, []);
});

test("portrait choices restore in canonical order, exclude unsupported types and default to all five", () => {
  assert.deepEqual(parsePlaygroundOptions(new URLSearchParams()).portraitContexts, ["standard", "doctor", "construction", "business", "school-pupil"]);
  const options = parsePlaygroundOptions(new URLSearchParams("portraitContexts=business,doctor,doctor,university-student,teacher"));
  assert.deepEqual(options.portraitContexts, ["doctor", "business"]);
  const page = new URL(buildPlaygroundPageUrl("https://persona.test/fr/playground?portraitContext=standard", options), "https://persona.test");
  assert.equal(page.searchParams.has("portraitContext"), false);
  assert.deepEqual(parsePlaygroundOptions(page.searchParams).portraitContexts, ["doctor", "business"]);
});

test("starts without a seed and keeps the example email domain", () => {
  const options = parsePlaygroundOptions(new URLSearchParams());
  assert.equal(options.seed, "");
  assert.equal(options.emailDomain, "example.test");
  const url = buildPeopleUrl("https://persona.test", options);
  assert.equal(url.searchParams.has("seed"), false);
  assert.equal(url.searchParams.get("emailDomain"), "example.test");
});

test("clearing a seed removes it from shared and API URLs, including whitespace", () => {
  for (const seed of ["", "   "]) {
    const options = { ...defaultPlaygroundOptions, seed };
    const path = buildPlaygroundPageUrl(
      "https://persona.test/fr/playground?seed=previous&utm_source=share",
      options,
    );
    const page = new URL(path, "https://persona.test");
    assert.equal(page.searchParams.has("seed"), false);
    assert.equal(page.searchParams.get("utm_source"), "share");
    assert.equal(parsePlaygroundOptions(page.searchParams).seed, "");
    assert.equal(buildPeopleUrl("https://persona.test", options).searchParams.has("seed"), false);
  }
});

test("an explicit seed survives sharing and is sent to the API", () => {
  const options = { ...defaultPlaygroundOptions, seed: "repeatable-demo" };
  const path = buildPlaygroundPageUrl("https://persona.test/fr/playground", options);
  const restored = parsePlaygroundOptions(new URL(path, "https://persona.test").searchParams);
  assert.equal(restored.seed, options.seed);
  assert.equal(buildPeopleUrl("https://persona.test", restored).searchParams.get("seed"), options.seed);
});

test("serializes supported filters and a 100-person request", () => {
  const options = {
    ...defaultPlaygroundOptions,
    count: 100,
    ageGroups: ["adult", "senior"],
    nationality: "FR",
    residenceCountry: "CG",
    city: "Brazzaville",
    fields: ["name", "picture"],
  };
  assert.equal(validatePlaygroundOptions(options), null);
  const url = buildPeopleUrl("https://persona-dev.onrender.com", options);
  assert.equal(url.pathname, "/people");
  assert.equal(url.searchParams.get("count"), "100");
  assert.equal(url.searchParams.get("ageGroup"), "adult,senior");
  assert.equal(url.searchParams.get("city"), "Brazzaville");
  assert.equal(url.searchParams.get("fields"), "name,picture");
});

test("rejects out-of-range counts and a city without a country", () => {
  assert.equal(
    validatePlaygroundOptions({ ...defaultPlaygroundOptions, count: 101 }),
    "count",
  );
  assert.equal(
    validatePlaygroundOptions({
      ...defaultPlaygroundOptions,
      city: "Brazzaville",
    }),
    "city",
  );
});

test("restores a shared playground URL without losing unrelated parameters", () => {
  const options = {
    ...defaultPlaygroundOptions,
    count: 90,
    continent: "africa",
    nationality: "CG",
    residenceCountry: "FR",
    ageGroups: ["adult", "senior"],
    fields: ["name", "location", "picture"],
    emailDomain: "persona.com",
  };
  const path = buildPlaygroundPageUrl(
    "https://persona.test/fr/playground?utm_source=share#result",
    options,
  );
  const page = new URL(path, "https://persona.test");
  assert.equal(page.searchParams.get("utm_source"), "share");
  assert.equal(page.hash, "#result");
  assert.deepEqual(parsePlaygroundOptions(page.searchParams), options);
  assert.equal(
    buildPlaygroundPageUrl(
      `https://persona.test${path}`,
      defaultPlaygroundOptions,
    ),
    "/fr/playground?utm_source=share#result",
  );
});
