import { FilterFieldConfig, FilterValues } from "@/lib/types/dynamicFilter.types";
import { useAppDispatch, useAppSelector } from "@/store/store";

import DynamicFilter from "@/components/dynamicFilter/dynamicFilter";
import PlayerStatistics from "../players/playerStatistics";
import { fetchEpisodes } from "@/store/slices/episodes.slice";
import { fetchMatches } from "@/store/slices/matches.slice";
import { fetchPlayerStatistics } from "@/store/slices/statistics.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
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
    const dto = {
      filter: {
        playerId: values.player?.id ?? undefined,

        episodeIds: Array.isArray(values.episodes) ? values.episodes.map((e: any) => e.id) : [],

        matchIds: Array.isArray(values.matches) ? values.matches.map((m: any) => m.id) : [],

        from: values.dateRange_from || undefined,
        to: values.dateRange_to || undefined,
      },
    };
    if (values.player?.id) {
      console.log("🚀 ~ handleFilterChange ~ values:", values);
      dispatch(fetchPlayerStatistics(dto));
    }
  };

  const handleReset = () => {
    dispatch(
      fetchPlayerStatistics({
        filter: {
          playerId: undefined,
          episodeIds: [],
          matchIds: [],
          from: undefined,
          to: undefined,
        },
      })
    );
  };

  return (
    <div className="">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-4">
          <DynamicFilter
            fields={filterFields}
            onChange={handleFilterChange}
            onReset={handleReset}
            showResetButton={true}
            showFilterCount={true}
          />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <PlayerStatistics />
        </div>
      </div>
    </div>
  );
};

export default PlayerOverviewPage;
