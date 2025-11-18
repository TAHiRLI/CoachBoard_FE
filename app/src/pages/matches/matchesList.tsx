import { Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import MatchItem from "@/components/matches/matchItem";
import { fetchMatches } from "@/store/slices/matches.slice";

const MatchesList = () => {
  const dispatch = useAppDispatch();
  const { selectedSeason } = useAppSelector((s) => s.seasonData);
  const { matches } = useAppSelector((s) => s.matchData);

  useEffect(() => {
    if(selectedSeason)
    dispatch(fetchMatches({ seasonId: selectedSeason?.id }));
  }, [selectedSeason]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {matches.map((match, i) => {
        if (!match) return <Fragment key={i}></Fragment>;
        return <MatchItem key={match.id} match={match} />;
      })}
    </div>
  );
};

export default MatchesList;
