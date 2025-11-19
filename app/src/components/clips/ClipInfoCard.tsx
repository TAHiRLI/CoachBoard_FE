// src/components/Clips/ClipInfoCard.tsx
import { Box, Chip, Typography } from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Clip } from "@/lib/types/clips.types";
import { ClipTrimJobCard } from "./ClipTrimJobCard";
import PersonIcon from "@mui/icons-material/Person";
import SportsIcon from "@mui/icons-material/Sports";
import { useTranslation } from "react-i18next";

interface ClipInfoCardProps {
  clip: Clip
  formatSeconds: (seconds: number) => string;
  getDuration: () => string;
}

export const ClipInfoCard: React.FC<ClipInfoCardProps> = ({ clip, formatSeconds, getDuration }) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Time and Duration Row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <AccessTimeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        <Typography variant="body2" color="text.secondary">
          {formatSeconds(Number(clip.startTime))} - {formatSeconds(Number(clip.endTime))}
        </Typography>
        <Chip label={`${getDuration()} ${t("static.duration")}`} size="small" sx={{ height: 20, fontSize: "0.75rem" }} />
        {clip.isExample && (
          <Chip
            label={t("static.isExample")}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.75rem" }}
          />
        )}
      </Box>

      {/* Match and Coach Row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SportsIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            <strong>{t("static.match")}:</strong> {clip.matchName || "N/A"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PersonIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary">
            <strong>{t("static.coach")}:</strong> {clip.coachName}
          </Typography>
        </Box>

      </Box>
        <ClipTrimJobCard clip={clip}/>
    </>
  );
};