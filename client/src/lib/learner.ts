const LEARNER_ID_KEY = "learnerId";

export function getLearnerId(): string {
  if (typeof window === "undefined" || !window.localStorage) {
    return "learner-default";
  }

  let learnerId = localStorage.getItem(LEARNER_ID_KEY);
  if (!learnerId) {
    const uuid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15);
    learnerId = `learner-${uuid}`;
    localStorage.setItem(LEARNER_ID_KEY, learnerId);
  }

  return learnerId;
}
