import MatchesFilter from "./matchesFilter";
import MatchesList from "./matchesList";
import { fetchSeasons } from "@/store/slices/seasons.slice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";

const MatchesPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSeasons());
  }, []);

  return (
    <div>
      <p className="page-subtitle">Manage and analyze all your team's matches across different seasons</p>

      <MatchesFilter />

      <div>
        <MatchesList />
      </div>
    </div>
  );
};

export default MatchesPage;
