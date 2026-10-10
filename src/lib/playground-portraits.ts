export const playgroundPortraitContexts = [
  "standard",
  "doctor",
  "construction",
  "business",
  "school-pupil",
] as const;

export type PlaygroundPortraitContext = (typeof playgroundPortraitContexts)[number];

export function togglePortraitContext(
  selected: readonly PlaygroundPortraitContext[],
  context: PlaygroundPortraitContext,
): PlaygroundPortraitContext[] {
  const next = new Set(selected);
  if (next.has(context)) next.delete(context);
  else next.add(context);
  return playgroundPortraitContexts.filter((item) => next.has(item));
}
