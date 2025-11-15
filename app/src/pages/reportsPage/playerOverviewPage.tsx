import { FilterFieldConfig, FilterValues } from "@/lib/types/dynamicFilter.types";

import DynamicFilter from "@/components/dynamicFilter/dynamicFilter";
import { fetchEpisodes } from "@/store/slices/episodes.slice";
import { fetchMatches } from "@/store/slices/matches.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
import { useAppDispatch } from "@/store/store";
import { useAppSelector } from "@/store/store";
import { useEffect } from "react";

const PlayerOverviewPage = () => {
  const { players } = useAppSelector((x) => x.playerData);
  const { episodes } = useAppSelector((x) => x.episodeData);
  const { matches } = useAppSelector((x) => x.matchData);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchEpisodes());
    dispatch(fetchPlayers());
    dispatch(fetchMatches({}));
  }, [dispatch]);
  const filterFields: FilterFieldConfig[] = [
    {
      key: "player",
      label: "Player",
      type: "select",
      options: players.map((p) => ({ id: p.id, label: p.fullName })),
      placeholder: "Select a player",
      required: true,
    },
    {
      key: "episodes",
      label: "Episodes",
      type: "multiSelect",
      options: episodes.map((e) => ({ id: e.id, label: e.name })),
      placeholder: "Select episodes",
    },
    {
      key: "matches",
      label: "Matches",
      type: "multiSelect",
      options: matches.map((m) => ({ id: m.id, label: m.stadium })),
      placeholder: "Select matches",
    },
    {
      key: "dateRange",
      label: "Date Range",
      type: "dateRange",
    },
  ];

  const handleFilterChange = (values: FilterValues) => {
    console.log("Filter values:", values);
    // dispatch(filterEvaluations(values));
  };

  const handleReset = () => {
    console.log("Filters reset");
    // dispatch(clearEvaluationFilters());
  };
  return (
    <div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-4 bg-red-200 p-4">
          <DynamicFilter
            fields={filterFields}
            onChange={handleFilterChange}
            onReset={handleReset}
            showResetButton={true}
            showFilterCount={true}
          />
        </div>
        <div className="col-span-12 xl:col-span-8 bg-red-200 p-4"></div>
      </div>
    </div>
  );
};

export default PlayerOverviewPage;
