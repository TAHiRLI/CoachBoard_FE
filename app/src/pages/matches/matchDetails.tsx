import { useAppDispatch, useAppSelector } from "@/store/store";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import MatchInfoCard from "@/components/matches/matchInfoCard";
import { fetchMatchById } from "@/store/slices/matches.slice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const MatchDetailsPage = () => {
  const { id } = useParams();

  const { selectedMatch } = useAppSelector((state) => state.matchData);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(fetchMatchById(id));
  }, [id]);

  return (
    <div>
      <div className="my-3 justify-end flex">
        <Button variant="contained" startIcon={<Add />}>
          Add Clip
        </Button>
      </div>

      <h1 className="page-title">
        {selectedMatch?.homeTeam.teamName} vs {selectedMatch?.awayTeam.teamName}
      </h1>
      <p className="page-subtitle">Complete match analysis with clips and coach evaluations</p>

      <div className="my-4">{selectedMatch && <MatchInfoCard match={selectedMatch} />}</div>
    </div>
  );
};

export default MatchDetailsPage;
