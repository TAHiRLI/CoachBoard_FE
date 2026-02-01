import { FilterFieldConfig, FilterValues } from "@/lib/types/dynamicFilter.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import ClipsList from "@/components/clips/ClipsList";
import CustomModal from "@/components/customModal/customModal";
import DynamicFilter from "@/components/dynamicFilter/dynamicFilter";
import { FilterAlt } from "@mui/icons-material";
import { fetchClips } from "@/store/slices/clips.slice";
import { fetchEpisodes } from "@/store/slices/episodes.slice";
import { fetchMatches } from "@/store/slices/matches.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
import { fetchTags } from "@/store/slices/tags.slice";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ClipsPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [statsOpen, setStatsOpen] = useState(false);

  const { clips } = useAppSelector((x) => x.clipData);
  const { players } = useAppSelector((x) => x.playerData);
  const { episodes } = useAppSelector((x) => x.episodeData);
  const { tags } = useAppSelector((x) => x.tagData);
  const { matches } = useAppSelector((x) => x.matchData);

  // 🔹 Load reference data first
  useEffect(() => {
    dispatch(fetchEpisodes());
    dispatch(fetchTags());
    dispatch(fetchPlayers());
    dispatch(fetchMatches({}));
  }, [dispatch]);

  // 🔹 Apply URL params AFTER data is ready
  useEffect(() => {
    if (!players.length || !episodes.length || !tags.length || !matches.length) return;

    const playerId = searchParams.get("playerId");
    const tagId = searchParams.get("tagId");
    const episodeIds = searchParams.getAll("episodeIds");
    const matchIds = searchParams.getAll("matchIds");
    const searchTerm = searchParams.get("searchTerm");

    dispatch(
      fetchClips({
        searchTerm: searchTerm ?? undefined,
        playerId: playerId ?? undefined,
        episodeIds: episodeIds ?? undefined,
        tagId: tagId ?? undefined,
        matchIds: matchIds ?? undefined,
      }),
    );
  }, [players, episodes, tags, matches, searchParams, dispatch]);

  const filterFields: FilterFieldConfig[] = [
    { key: "searchTerm", label: t("static.search"), type: "text", options: [] },
    {
      key: "player",
      label: t("static.player"),
      type: "select",
      options: players.map((p) => ({ id: p.id, label: p.fullName })),
    },
    {
      key: "episode",
      label: t("static.episodes"),
      type: "select",
      options: episodes.map((e) => ({ id: e.id, label: e.name })),
    },
    { key: "tag", label: t("static.tags"), type: "select", options: tags.map((t) => ({ id: t.id, label: t.name })) },
    {
      key: "match",
      label: t("static.matches"),
      type: "select",
      options: matches.map((m) => ({ id: m.id, label: m.name })),
    },
    { key: "isExample", label: t("static.isExample"), type: "checkbox" },
  ];

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);

    dispatch(
      fetchClips({
        searchTerm: values.searchTerm ?? undefined,
        playerId: values.player?.id,
        episodeIds: [values.episode?.id],
        tagId: values.tag?.id,
        matchIds: [values.match?.id],
        isExample: values.isExample ?? undefined,
      }),
    );

    setStatsOpen(false);
  };

  const handleReset = () => {
    setFilterValues({});
    dispatch(fetchClips({}));
    setStatsOpen(false);
  };

  return (
    <div>
      <div className="mx-auto mb-6 flex justify-between">
        <div className="text-2xl capitalize">
          {clips.length} {t("static.clips")}
        </div>
        <Button onClick={() => setStatsOpen(true)} variant="contained" startIcon={<FilterAlt />}>
          {t("static.openFilters")}
        </Button>
      </div>

      <ClipsList />

      <CustomModal open={statsOpen} setOpen={setStatsOpen}>
        <DynamicFilter
          fields={filterFields}
          initialValues={filterValues}
          onChange={handleFilterChange}
          onReset={handleReset}
          showResetButton
          showFilterCount
        />
      </CustomModal>
    </div>
  );
};

export default ClipsPage;
