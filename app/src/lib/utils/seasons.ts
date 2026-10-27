import { Season } from "@/lib/types/seasons.types";

// Prefer the season that contains today; otherwise the one that started most recently.
export const pickDefaultSeason = (seasons: Season[]): Season | null => {
  if (seasons.length === 0) return null;
  const flagged = seasons.find((s) => s.isCurrent);
  if (flagged) return flagged;
  const now = Date.now();
  const current = seasons.find(
    (s) => new Date(s.startDate).getTime() <= now && now <= new Date(s.endDate).getTime()
  );
  if (current) return current;
  return [...seasons].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
};
