import { Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

import MatchItem from "@/components/matches/MatchItem";
import { fetchMatches } from "@/store/slices/matches.slice";

const MatchesList = () => {
  const dispatch = useAppDispatch();
  const { selectedSeason } = useAppSelector((s) => s.seasonData);
  const { matches } = useAppSelector((s) => s.matchData); // assume matches are already fetched

  useEffect(() => {
    dispatch(fetchMatches({ seasonId: selectedSeason?.id })); // if you fetch by season
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
