import { Avatar, Box, Card, Typography } from "@mui/material";
import { Delete, Edit, MovieOutlined, PlaceOutlined } from "@mui/icons-material";
import { deleteMatch, fetchMatches, selectMatch } from "@/store/slices/matches.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useCallback, useState } from "react";

import CustomModal from "../customModal/customModal";
import EditMatch from "./EditMatch";
import { Link } from "react-router-dom";
import { Match, TeamMatch } from "@/lib/types/matches.types";
import MatchResultChip from "./matchResultChip";
import MatchStatusChip from "./matchStatusChip";
import RowActions from "../rowActions/rowActions";
import { confirmDelete } from "@/components/feedback/feedback";
import { minioUrl } from "@/lib/constants/constants";
import { useTranslation } from "react-i18next";

const TeamRow = ({ team, score, winner, own }: { team: TeamMatch; score?: number; winner: boolean; own?: boolean }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
    <Avatar
      src={team.logo ? minioUrl + team.logo : undefined}
      alt=""
      variant="rounded"
      sx={{ width: 28, height: 28, bgcolor: "action.hover", color: "text.secondary", fontSize: 13, "& img": { objectFit: "contain" } }}
    >
      {team.teamName?.[0]}
    </Avatar>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography noWrap fontWeight={winner ? 700 : 500} title={team.clubName} color={own ? "primary" : undefined}>
        {team.teamName}
      </Typography>
    </Box>
    {score !== undefined && (
      <Typography fontWeight={700} fontSize="1.125rem" color={winner ? "text.primary" : "text.secondary"}>
        {score}
      </Typography>
    )}
  </Box>
);

const MatchItem = ({ match }: { match: Match }) => {
  const { selectedSeason } = useAppSelector((x) => x.seasonData);
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const date = new Date(match.date);
  const played = date.getTime() <= Date.now();
  const home = match.homeTeam.score;
  const away = match.awayTeam.score;
  const locale = i18n.language === "aze" ? "az" : i18n.language;

  const handleDelete = useCallback(() => {
    confirmDelete().then((confirmed) => {
      if (confirmed) dispatch(deleteMatch(match.id));
    });
  }, [dispatch, match.id]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        "&:hover": { borderColor: "primary.main", boxShadow: "0 6px 20px var(--cb-shadow)" },
      }}
    >
      <Box
        component={Link}
        to={`/matches/${match.id}`}
        sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5, color: "inherit", flex: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
            {", "}
            {date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
          </Typography>
          <MatchStatusChip date={match.date} />
          <MatchResultChip result={match.result} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TeamRow team={match.homeTeam} score={played ? home : undefined} winner={played && home > away} own={match.ownSide === "home"} />
          <TeamRow team={match.awayTeam} score={played ? away : undefined} winner={played && away > home} own={match.ownSide === "away"} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2.5,
          py: 1,
          borderTop: 1,
          borderColor: "divider",
          color: "text.secondary",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, flex: 1 }}>
          <PlaceOutlined sx={{ fontSize: 18 }} />
          <Typography variant="body2" noWrap>
            {match.stadium || "-"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <MovieOutlined sx={{ fontSize: 18 }} />
          <Typography variant="body2">{t("static.clipCount", { count: match.clipCount })}</Typography>
        </Box>
        <RowActions
          actions={[
            {
              icon: <Edit fontSize="small" />,
              label: t("static.edit"),
              onClick: () => {
                dispatch(selectMatch(match));
                setIsOpen(true);
              },
            },
            {
              icon: <Delete fontSize="small" />,
              label: t("static.delete"),
              onClick: handleDelete,
              color: "error",
            },
          ]}
        />
      </Box>

      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <EditMatch
          onCancel={() => setIsOpen(false)}
          match={match}
          onSuccess={() => {
            dispatch(fetchMatches({ seasonId: selectedSeason?.id }));
            setIsOpen(false);
          }}
        />
      </CustomModal>
    </Card>
  );
};

export default MatchItem;
