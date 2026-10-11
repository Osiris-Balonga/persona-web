export const skinToneSwatches = [
  { value: 1, color: "#f7ede4" },
  { value: 2, color: "#f3e7da" },
  { value: 3, color: "#f6ead0" },
  { value: 4, color: "#ead9bb" },
  { value: 5, color: "#d7bd96" },
  { value: 6, color: "#9f7d54" },
  { value: 7, color: "#815d44" },
  { value: 8, color: "#604234" },
  { value: 9, color: "#3a312a" },
  { value: 10, color: "#2a2420" },
] as const;

export function getSkinToneSwatch(value: number) {
  return skinToneSwatches.find((swatch) => swatch.value === value);
}
