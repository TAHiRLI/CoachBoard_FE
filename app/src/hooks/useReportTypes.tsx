import { Category, Groups } from "@mui/icons-material";

import { ReactNode } from "react";
import { Routes } from "@/router/routes";
import { useTranslation } from "react-i18next";

export interface ReportType {
  id: string;
  name: string;
  url: string;
  description: string;
  category: "player" | "team" | "episode" | "comparative";
  icon: ReactNode;
  canCompare: boolean;
  canSchedule: boolean;
}

// Report types configuration (using i18n keys)
export const REPORT_TYPES: Record<string, ReportType> = {
  playerOverview: {
    id: "player-overview",
    url: Routes.Reports.PlayerOverview,
    name: "reportTypes.playerOverview.name",
    description: "reportTypes.playerOverview.description",
    category: "player",
    icon: "👥",
    canCompare: true,
    canSchedule: true,
  },
  teamPerformance: {
    id: "team-performance",
    url: Routes.Reports.PlayerOverview,
    name: "reportTypes.teamPerformance.name",
    description: "reportTypes.teamPerformance.description",
    category: "team",
    icon: <Groups />,
    canCompare: true,
    canSchedule: true,
  },
  episodeAnalysis: {
    id: "episode-analysis",
    url: Routes.Reports.PlayerOverview,
    name: "reportTypes.episodeAnalysis.name",
    description: "reportTypes.episodeAnalysis.description",
    category: "episode",
    icon: <Category />,
    canCompare: true,
    canSchedule: false,
  },
};

// Example hook to get translated values
export const useReportTypes = () => {
  const { t } = useTranslation();
  return Object.values(REPORT_TYPES).map((r) => ({
    ...r,
    name: t(r.name),
    description: t(r.description),
  }));
};
