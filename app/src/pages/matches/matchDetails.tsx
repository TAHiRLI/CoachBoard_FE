// keep existing imports

import { Box, Button, Tab, Tabs } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import AddBulkClips from "@/components/clips/AddBulkClips";
import AddClip from "@/components/clips/AddClip";
import CustomModal from "@/components/customModal/customModal";
import MatchClips from "./matchClips";
import MatchInfoCard from "@/components/matches/matchInfoCard";
import MatchParticipations from "./matchParticipations";
import { fetchClips } from "@/store/slices/clips.slice";
import { fetchMatchById } from "@/store/slices/matches.slice";
import { useFlag } from "@unleash/proxy-client-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MatchDetailsPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  const isBulkClipCreationEnabled = useFlag("fe_bulk_clip_creation");

  // 👇 tab type depends on flag
  const [tab, setTab] = useState<0 | 1>(0);

  const { selectedMatch } = useAppSelector((state) => state.matchData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(fetchMatchById(id));
  }, [id]);

  useEffect(() => {
    setTab(0);
  }, [isOpen, isBulkClipCreationEnabled]);

  return (
    <div>
      <h1 className="page-title">
        {selectedMatch?.homeTeam.teamName} vs {selectedMatch?.awayTeam.teamName}
      </h1>
      <p className="page-subtitle">{t("static.matchAnalysisSubtitle")}</p>

      <div className="my-4">
        {selectedMatch && <MatchInfoCard match={selectedMatch} />}
      </div>

      <div className="my-4">
        {selectedMatch && (
          <>
            <div className="my-3 justify-end flex">
              <Button
                onClick={() => setIsOpen(true)}
                variant="contained"
                startIcon={<Add />}
              >
                {t("static.addClip")}
              </Button>
            </div>

            <MatchClips match={selectedMatch} />
          </>
        )}
      </div>

      <div className="my-4">
        {selectedMatch && <MatchParticipations match={selectedMatch} />}
      </div>

      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <Box sx={{ width: "100%" }}>
          {isBulkClipCreationEnabled && (
            <Tabs
              value={tab}
              onChange={(_, value) => setTab(value)}
              centered
              sx={{ mb: 2 }}
            >
              <Tab label={t("static.singleClip")} />
              <Tab label={t("static.bulkClips")} />
            </Tabs>
          )}

          {/* SINGLE CLIP */}
          {(tab === 0 || !isBulkClipCreationEnabled) && (
            <AddClip
              matchUrl={selectedMatch?.gameUrl}
              matchId={selectedMatch?.id}
              onCancel={() => setIsOpen(false)}
              onSuccess={() => {
                dispatch(fetchClips({ matchId: selectedMatch?.id }));
                setIsOpen(false);
              }}
            />
          )}

          {/* BULK CLIP */}
          {isBulkClipCreationEnabled && tab === 1 && (
            <AddBulkClips
              matchId={selectedMatch?.id}
              onCancel={() => setIsOpen(false)}
              onSuccess={() => {
                dispatch(fetchClips({ matchId: selectedMatch?.id }));
                setIsOpen(false);
              }}
            />
          )}
        </Box>
      </CustomModal>
    </div>
  );
};

export default MatchDetailsPage;