import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import { CalendarMonthOutlined, Delete, Edit, OpenInNew, PlaceOutlined } from "@mui/icons-material";
import { deleteMatch, fetchMatchById, selectMatch } from "@/store/slices/matches.slice";
import { useCallback, useState } from "react";

import CustomModal from "../customModal/customModal";
import EditMatch from "./EditMatch";
import { Match, TeamMatch } from "@/lib/types/matches.types";
import MatchResultChip from "./matchResultChip";
import RowActions from "../rowActions/rowActions";
import { confirmDelete } from "@/components/feedback/feedback";
import { minioUrl } from "@/lib/constants/constants";
import { useAppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  match: Match;
};

const TeamBlock = ({ team, align }: { team: TeamMatch; align: "left" | "right" }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: align === "left" ? "row" : "row-reverse" },
      alignItems: "center",
      gap: 1.5,
      minWidth: 0,
      textAlign: { xs: "center", sm: align },
    }}
  >
    <Avatar
      src={team.logo ? minioUrl + team.logo : undefined}
      alt=""
      variant="rounded"
      sx={{ width: 48, height: 48, bgcolor: "action.hover", color: "text.secondary", "& img": { objectFit: "contain" } }}
    >
      {team.teamName?.[0]}
    </Avatar>
    <Box sx={{ minWidth: 0 }}>
      <Typography fontWeight={650} fontSize={{ xs: "1rem", sm: "1.125rem" }} noWrap>
        {team.teamName}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {team.clubName}
      </Typography>
    </Box>
  </Box>
);

const MatchInfoCard: React.FC<Props> = ({ match }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const locale = i18n.language === "aze" ? "az" : i18n.language;
  const matchDate = new Date(match.date);
  const played = matchDate.getTime() <= Date.now();

  const handleDelete = useCallback(() => {
    confirmDelete().then((confirmed) => {
      if (!confirmed) return;
      dispatch(deleteMatch(match.id))
        .unwrap()
        .then(() => navigate("/"))
        .catch(() => {
          // Reported by the global feedback middleware.
        });
    });
  }, [dispatch, match.id, navigate]);

  return (
    <Card sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", top: 12, right: 12 }}>
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
            { icon: <Delete fontSize="small" />, label: t("static.delete"), onClick: handleDelete, color: "error" },
          ]}
        />
      </Box>

      <Box
        component="h1"
        sx={{
          m: 0,
          pl: { xs: 2, sm: 4 },
          pr: { xs: 2, sm: 8 },
          pt: 4,
          pb: 3,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
          alignItems: "center",
          gap: { xs: 1.5, sm: 3 },
          fontSize: "inherit",
          fontWeight: "inherit",
        }}
      >
        <TeamBlock team={match.homeTeam} align="left" />
        <Box sx={{ textAlign: "center" }}>
          <Typography component="span" sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem" }, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {played ? `${match.homeTeam.score} : ${match.awayTeam.score}` : "vs"}
          </Typography>
          <Box sx={{ mt: 0.5, minHeight: 24 }}>
            <MatchResultChip result={match.result} />
          </Box>
        </Box>
        <TeamBlock team={match.awayTeam} align="right" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: { xs: 1.5, sm: 3 },
          px: { xs: 2, sm: 4 },
          py: 1.5,
          borderTop: 1,
          borderColor: "divider",
          color: "text.secondary",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <CalendarMonthOutlined sx={{ fontSize: 18 }} />
          <Typography variant="body2">
            {matchDate.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })},{" "}
            {matchDate.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
          </Typography>
        </Box>
        {match.stadium && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <PlaceOutlined sx={{ fontSize: 18 }} />
            <Typography variant="body2">{match.stadium}</Typography>
          </Box>
        )}
        <Typography variant="body2">{match.seasonName}</Typography>
        {match.gameUrl && (
          <Button
            href={match.gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            endIcon={<OpenInNew fontSize="small" />}
            sx={{ ml: { sm: "auto" } }}
          >
            {t("static.watchVideo")}
          </Button>
        )}
      </Box>

      {match.note && (
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 1.5, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line", maxWidth: "80ch" }}>
            {match.note}
          </Typography>
        </Box>
      )}

      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <EditMatch
          onCancel={() => setIsOpen(false)}
          match={match}
          onSuccess={() => {
            dispatch(fetchMatchById(match.id));
            setIsOpen(false);
          }}
        />
      </CustomModal>
    </Card>
  );
};

export default MatchInfoCard;
