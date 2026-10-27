import MatchesFilter from "./matchesFilter";
import MatchesList from "./matchesList";
import { fetchSeasons } from "@/store/slices/seasons.slice";
import { useAppDispatch } from "@/store/store";
import { useEffect, useState } from "react";

const MatchesPage = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchSeasons());
  }, [dispatch]);

  return (
    <>
      <MatchesFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <MatchesList searchTerm={searchTerm} />
    </>
  );
};

export default MatchesPage;
