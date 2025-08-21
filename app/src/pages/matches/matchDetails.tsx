import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import AddClip from "@/components/clips/AddClip";
import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import MatchClips from "./matchClips";
import MatchInfoCard from "@/components/matches/matchInfoCard";
import MatchParticipations from "./matchParticipations";
import { fetchClips } from "@/store/slices/clips.slice";
import { fetchMatchById } from "@/store/slices/matches.slice";
import { useParams } from "react-router-dom";

const MatchDetailsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  const { selectedMatch } = useAppSelector((state) => state.matchData);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(fetchMatchById(id));
  }, [id]);

  return (
    <div>
      <div className="my-3 justify-end flex">
        <Button onClick={() => setIsOpen(true)} variant="contained" startIcon={<Add />}>
          Add Clip
        </Button>
      </div>

      <h1 className="page-title">
        {selectedMatch?.homeTeam.teamName} vs {selectedMatch?.awayTeam.teamName}
      </h1>
      <p className="page-subtitle">Complete match analysis with clips and coach evaluations</p>

      <div className="my-4">{selectedMatch && <MatchInfoCard match={selectedMatch} />}</div>
      <div className="my-4">{selectedMatch && <MatchClips match={selectedMatch} />}</div>
      <div className="my-4">{selectedMatch && <MatchParticipations match={selectedMatch} />}</div>

      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <AddClip
          matchUrl={selectedMatch?.gameUrl}
          matchId={selectedMatch?.id}
          onCancel={() => setIsOpen(false)}
          onSuccess={() => {
            dispatch(fetchClips({ matchId: selectedMatch?.id }));
            setIsOpen(false);
          }}
        />
      </CustomModal>
    </div>
  );
};

export default MatchDetailsPage;
