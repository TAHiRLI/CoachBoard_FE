import { FC, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import ClipItem from "@/components/clips/ClipItem";
import { Paper, Skeleton, Typography } from "@mui/material";
import { MovieOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Match } from "@/lib/types/matches.types";
import { fetchClips } from "@/store/slices/clips.slice";

interface MatchClipsProps {
  match: Match;
}

const MatchClips: FC<MatchClipsProps> = ({ match }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { clips, loading } = useAppSelector((x) => x.clipData);

  useEffect(() => {
    if (!match.id) return;
    dispatch(fetchClips({ matchIds: [match.id] }));
  }, [match]);

  if (loading && clips.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={220} />
        ))}
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <Paper sx={{ py: 6, px: 3, textAlign: "center" }}>
        <MovieOutlined sx={{ fontSize: 36, color: "text.disabled", mb: 1 }} />
        <Typography fontWeight={600}>{t("static.noClipsTitle")}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "48ch", mx: "auto", mt: 0.5 }}>
          {t("static.noClipsText")}
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clips.map((clip) => (
        <ClipItem key={clip.id} clip={clip} />
      ))}
    </div>
  );
};

export default MatchClips;