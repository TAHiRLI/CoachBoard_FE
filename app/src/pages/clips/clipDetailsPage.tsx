import { Button, LinearProgress, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import AddEvaluation from "@/components/evaluations/AddEvaluation";
import ClipItem from "@/components/clips/ClipItem";
import CustomModal from "@/components/customModal/customModal";
import EvaluationsList from "@/components/evaluations/evaluationsList";
import MatchInfoCard from "@/components/matches/matchInfoCard";
import { fetchClipById } from "@/store/slices/clips.slice";
import { fetchEvaluations } from "@/store/slices/evaluations.slice";
import { fetchMatchById } from "@/store/slices/matches.slice";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ClipDetailsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedClip } = useAppSelector((x) => x.clipData);
  const { selectedMatch } = useAppSelector((state) => state.matchData);
  const { id } = useParams();

  useEffect(() => {
    if (selectedClip) dispatch(fetchEvaluations({ clipId: selectedClip?.id }));
  }, [selectedClip]);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchClipById(id));
  }, [id]);

  useEffect(() => {
    if (selectedClip?.matchId) dispatch(fetchMatchById(selectedClip?.matchId));
  }, [selectedClip]);
  // evaluations
  const [isOpen, setIsOpen] = useState(false);
  if (!selectedClip) return <LinearProgress />;

  return (
    <div>
      <Paper className="flex flex-col-reverse gap-4 md:flex-row">
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="flex-1">{selectedMatch && <MatchInfoCard match={selectedMatch} />}</div>

          <CustomModal open={isOpen} setOpen={setIsOpen}>
            <AddEvaluation
              clipId={selectedClip.id}
              onSuccess={() => {
                dispatch(fetchEvaluations({ clipId: selectedClip?.id }));
                setIsOpen(false);
              }}
              onCancel={() => setIsOpen(false)}
            />
          </CustomModal>
        </div>

        <div className="w-full md:w-1/3 flex flex-col">
          <div className="flex-1">
            <ClipItem clip={selectedClip} expanded />
          </div>
        </div>
      </Paper>

      <div className="my-5">
        <div className="flex justify-end mb-3">
          <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)}>
            {t("static.addEvaluation")}
          </Button>
        </div>
        <EvaluationsList />
      </div>
    </div>
  );
};

export default ClipDetailsPage;
