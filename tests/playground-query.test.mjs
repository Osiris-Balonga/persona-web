import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPeopleUrl,
  buildPlaygroundPageUrl,
  defaultPlaygroundOptions,
  parsePlaygroundOptions,
  validatePlaygroundOptions,
} from "../src/lib/playground-query.ts";

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
