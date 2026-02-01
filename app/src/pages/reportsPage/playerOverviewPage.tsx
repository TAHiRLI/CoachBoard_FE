import { FilterAlt, PictureAsPdf } from "@mui/icons-material";
import { FilterFieldConfig, FilterValues } from "@/lib/types/dynamicFilter.types";
import { clearPlayerOverview, fetchPlayerStatistics } from "@/store/slices/statistics.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import CustomModal from "@/components/customModal/customModal";
import DynamicFilter from "@/components/dynamicFilter/dynamicFilter";
import PlayerStatistics from "../players/playerStatistics";
import { fetchEpisodes } from "@/store/slices/episodes.slice";
import { fetchMatches } from "@/store/slices/matches.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
import { reportsService } from "@/API/Services/reports.service";
import { useFlag } from "@unleash/proxy-client-react";
import { useTranslation } from "react-i18next";

const PlayerOverviewPage = () => {
  const { t } = useTranslation();
  const { players } = useAppSelector((x) => x.playerData);
  const { episodes } = useAppSelector((x) => x.episodeData);
  const { matches } = useAppSelector((x) => x.matchData);

  const dispatch = useAppDispatch();
  const [statsOpen, setStatsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const isPDFGenerateEnabled = useFlag("FE_reports_generatePdf");

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
    setFilterValues(values); // save!
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

  const handleGeneratePdf = () => {
    if (!filterValues) return;

    const dto = {
      filter: {
        playerId: filterValues.player?.id ?? undefined,
        episodeIds: Array.isArray(filterValues.episodes) ? filterValues.episodes.map((e: any) => e.id) : [],
        matchIds: Array.isArray(filterValues.matches) ? filterValues.matches.map((m: any) => m.id) : [],
        from: filterValues.dateRange_from || undefined,
        to: filterValues.dateRange_to || undefined,
      },
    };
    reportsService.generatePlayerOverview(dto);
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className=" mx-auto mb-6 flex gap-3 justify-end">
        <Button onClick={() => setStatsOpen(true)} variant="contained" startIcon={<FilterAlt />}>
          {t("static.openFilters") || "Open Filters"}
        </Button>
        {Object.keys(filterValues).length > 0 && isPDFGenerateEnabled && (
          <Button onClick={() => handleGeneratePdf()} variant="contained" startIcon={<PictureAsPdf />}>
            {t("static.generatePdf")}
          </Button>
        )}
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
            initialValues={filterValues}
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
