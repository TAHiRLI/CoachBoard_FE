import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo } from "react";

import MatchItem from "@/components/matches/matchItem";
import { SearchOff, SportsSoccerOutlined } from "@mui/icons-material";
import { fetchMatches } from "@/store/slices/matches.slice";
import { useTranslation } from "react-i18next";

const gridSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
};

const EmptyState = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
  <Paper sx={{ py: 8, px: 3, textAlign: "center", color: "text.secondary" }}>
    <Box sx={{ color: "text.disabled", mb: 1.5, "& svg": { fontSize: 40 } }}>{icon}</Box>
    <Typography variant="h3" color="text.primary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ maxWidth: "48ch", mx: "auto" }}>
      {text}
    </Typography>
  </Paper>
);

const MatchesList = ({ searchTerm }: { searchTerm: string }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedSeason } = useAppSelector((s) => s.seasonData);
  const { matches, loading } = useAppSelector((s) => s.matchData);

  useEffect(() => {
    if (selectedSeason) dispatch(fetchMatches({ seasonId: selectedSeason.id }));
  }, [selectedSeason, dispatch]);

  const visibleMatches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return matches.filter(
      (match) =>
        match &&
        (!term ||
          match.name.toLowerCase().includes(term) ||
          match.stadium?.toLowerCase().includes(term) ||
          match.homeTeam.clubName?.toLowerCase().includes(term) ||
          match.awayTeam.clubName?.toLowerCase().includes(term))
    );
  }, [matches, searchTerm]);

  if (loading && matches.length === 0) {
    return (
      <Box sx={gridSx} aria-busy>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={196} />
        ))}
      </Box>
    );
  }

  if (matches.length === 0) {
    return (
      <EmptyState
        icon={<SportsSoccerOutlined />}
        title={t("static.noMatchesTitle")}
        text={t("static.noMatchesText")}
      />
    );
  }

  if (visibleMatches.length === 0) {
    return (
      <EmptyState icon={<SearchOff />} title={t("static.noMatchingRecords")} text={t("static.tryAnotherSearch")} />
    );
  }

  return (
    <Box sx={{ ...gridSx, opacity: loading ? 0.6 : 1, transition: "opacity 150ms ease" }}>
      {visibleMatches.map((match) => (
        <MatchItem key={match.id} match={match} />
      ))}
    </Box>
  );
};

export default MatchesList;
