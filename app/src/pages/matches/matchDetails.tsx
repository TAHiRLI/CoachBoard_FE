import { useAppDispatch, useAppSelector } from "@/store/store";
import { useNavigate, useParams } from "react-router-dom";

import MatchInfoCard from "@/components/matches/matchInfoCard";
import { fetchMatchById } from "@/store/slices/matches.slice";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const MatchDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedMatch } = useAppSelector((state) => state.matchData);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(fetchMatchById(id));
  }, [id]);

  return (
    <div>
      <h1 className="page-title">
        {selectedMatch?.homeTeam.teamName} vs {selectedMatch?.awayTeam.teamName}
      </h1>
      <p className="page-subtitle">Complete match analysis with clips and coach evaluations</p>

      <div className="my-4">{selectedMatch && <MatchInfoCard match={selectedMatch} />}</div>
    </div>
  );
};

export default MatchDetailsPage;
