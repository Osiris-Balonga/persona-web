export type ActivityEnvironment = "production" | "staging";

export function activityBadgeKey(environment: ActivityEnvironment) {
  return environment === "production" ? "badgeProduction" : "badgeStaging";
}
