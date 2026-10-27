// keep existing imports

import { Box, Button, Paper, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Add, ArrowBack, MovieCreationOutlined } from "@mui/icons-material";
import AddBulkClips from "@/components/clips/AddBulkClips";
import AddClip from "@/components/clips/AddClip";
import CustomModal from "@/components/customModal/customModal";
import MatchClips from "./matchClips";
import MatchInfoCard from "@/components/matches/matchInfoCard";
import MatchParticipations from "./matchParticipations";
import SectionHeader from "@/components/layout/sectionHeader";
import { fetchClips } from "@/store/slices/clips.slice";
import { fetchMatchById } from "@/store/slices/matches.slice";
import { useFlag } from "@unleash/proxy-client-react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MatchDetailsPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  const isBulkClipCreationEnabled = useFlag("fe_bulk_clip_creation");

  const [tab, setTab] = useState<0 | 1>(0);

  const { selectedMatch, loading: matchLoading, error: matchError } = useAppSelector((state) => state.matchData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(fetchMatchById(id));
  }, [id]);

  useEffect(() => {
    setTab(0);
  }, [isOpen, isBulkClipCreationEnabled]);

  const { clips } = useAppSelector((state) => state.clipData);
  const isCurrentMatch = selectedMatch?.id?.toString() === id;

  if (!matchLoading && matchError && !isCurrentMatch) {
    return (
      <Paper sx={{ py: 8, px: 3, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          {t("static.matchNotFound")}
        </Typography>
        <Button component={Link} to="/" startIcon={<ArrowBack />}>
          {t("static.matches")}
        </Button>
      </Paper>
    );
  }

  if (!selectedMatch || !isCurrentMatch) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} aria-busy>
        <Skeleton variant="text" width={120} />
        <Skeleton variant="rounded" height={200} />
        <Skeleton variant="rounded" height={260} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Box>
        <Button component={Link} to="/" startIcon={<ArrowBack />} color="inherit" size="small" sx={{ mb: 1.5, color: "text.secondary" }}>
          {t("static.matches")}
        </Button>
        <MatchInfoCard match={selectedMatch} />
      </Box>

      <section>
        <SectionHeader
          title={t("static.clips")}
          count={clips.length}
          actions={
            <>
              <Button onClick={() => setIsOpen(true)} variant="outlined" startIcon={<Add />}>
                {t("static.addClip")}
              </Button>
              <Button
                component={Link}
                to={`/Matches/${selectedMatch.id}/clip-editor`}
                variant="contained"
                startIcon={<MovieCreationOutlined />}
              >
                {t("clipEditor.openEditor")}
              </Button>
            </>
          }
        />
        <MatchClips match={selectedMatch} />
      </section>

      <MatchParticipations match={selectedMatch} />

      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <Box sx={{ width: "100%" }}>
          {isBulkClipCreationEnabled && (
            <Tabs value={tab} onChange={(_, value) => setTab(value)} centered sx={{ mb: 2 }}>
              <Tab label={t("static.singleClip")} />
              <Tab label={t("static.bulkClips")} />
            </Tabs>
          )}

          {/* SINGLE CLIP */}
          {(tab === 0 || !isBulkClipCreationEnabled) && selectedMatch && (
            <AddClip
              matchUrl={selectedMatch?.gameUrl}
              matchId={selectedMatch?.id}
              onCancel={() => setIsOpen(false)}
              onSuccess={() => {
                dispatch(fetchClips({ matchIds: [selectedMatch.id] }));
                setIsOpen(false);
              }}
            />
          )}

          {/* BULK CLIP */}
          {isBulkClipCreationEnabled && selectedMatch &&  tab === 1 && (
            <AddBulkClips
              matchId={selectedMatch?.id}
              onCancel={() => setIsOpen(false)}
              onSuccess={() => {
                dispatch(fetchClips({ matchIds: [selectedMatch?.id] }));
                setIsOpen(false);
              }}
            />
          )}
        </Box>
      </CustomModal>
    </Box>
  );
};

export default MatchDetailsPage;
