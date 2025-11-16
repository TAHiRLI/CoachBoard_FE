import { FilterFieldConfig, FilterValues } from "@/lib/types/dynamicFilter.types";
import { clearPlayerOverview, fetchPlayerStatistics } from "@/store/slices/statistics.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import CustomModal from "@/components/customModal/customModal";
import DynamicFilter from "@/components/dynamicFilter/dynamicFilter";
import PlayerStatistics from "../players/playerStatistics";
import { fetchEpisodes } from "@/store/slices/episodes.slice";
import { fetchMatches } from "@/store/slices/matches.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
import { useTranslation } from "react-i18next";

const PlayerOverviewPage = () => {
  const { t } = useTranslation();
  const { players } = useAppSelector((x) => x.playerData);
  const { episodes } = useAppSelector((x) => x.episodeData);
  const { matches } = useAppSelector((x) => x.matchData);

  const dispatch = useAppDispatch();
  const [statsOpen, setStatsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEpisodes());
    dispatch(fetchPlayers());
    dispatch(fetchMatches({}));
  }, [dispatch]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "player",
      label: t("static.player"),
      type: "select",
      options: players.map((p) => ({ id: p.id, label: p.fullName })),
      placeholder: t("static.selectPlayer"),
      required: true,
    },
    {
      key: "episodes",
      label: t("static.episodes"),
      type: "multiSelect",
      options: episodes.map((e) => ({ id: e.id, label: e.name })),
      placeholder: t("static.selectEpisodes"),
    },
    {
      key: "matches",
      label: t("static.matches"),
      type: "multiSelect",
      options: matches.map((m) => ({ id: m.id, label: m.name })),
      placeholder: t("static.selectMatches"),
    },
    {
      key: "dateRange",
      label: t("static.dateRange"),
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
      dispatch(fetchPlayerStatistics(dto));
      setStatsOpen(false); // close popup after clicking apply
    }
  };

  const handleReset = () => {
    clearPlayerOverview();
  };

  return (
    <div className="">

      <div className="max-w-7xl mx-auto mb-6 flex justify-end">
        <button
          onClick={() => setStatsOpen(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all animate-pulse"
        >
          {t("static.openFilters") || "Open Filters"}
        </button>
      </div>

      {/* MAIN STATISTICS BLOCK */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12">
          <PlayerStatistics />
        </div>
      </div>

      {/* FILTER POPUP */}
      <CustomModal open={statsOpen} setOpen={setStatsOpen}>
        <div className="p-4 w-full">
          <DynamicFilter
            fields={filterFields}
            onChange={handleFilterChange}
            onReset={handleReset}
            showResetButton={true}
            showFilterCount={true}
          />
        </div>
      </CustomModal>

    </div>
  );
};

export default PlayerOverviewPage;