import { FilterFieldConfig, FilterValues } from "@/lib/types/dynamicFilter.types";
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
import { useAppDispatch } from "@/store/store";
import { useAppSelector } from "@/store/store";
import { useTranslation } from "react-i18next";

const ClipsPage = () => {
  const [statsOpen, setStatsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchClips({}));
  }, []);

  const { t } = useTranslation();
  const { clips } = useAppSelector((x) => x.clipData);
  const { players } = useAppSelector((x) => x.playerData);
  const { episodes } = useAppSelector((x) => x.episodeData);
  const { tags } = useAppSelector((x) => x.tagData);
  const { matches } = useAppSelector((x) => x.matchData);

  useEffect(() => {
    dispatch(fetchEpisodes());
    dispatch(fetchTags());
    dispatch(fetchPlayers());
    dispatch(fetchMatches({}));
  }, [dispatch]);

  const filterFields: FilterFieldConfig[] = [
    {
      key: "searchTerm",
      label: t("static.search"),
      type: "text",
      options: [],
      placeholder: t("static.search"),
      required: false,
    },
    {
      key: "player",
      label: t("static.player"),
      type: "select",
      options: players.map((p) => ({ id: p.id, label: p.fullName })),
      placeholder: t("static.selectPlayer"),
      required: false,
    },
    {
      key: "episode",
      label: t("static.episodes"),
      type: "select",
      options: episodes.map((e) => ({ id: e.id, label: e.name })),
      placeholder: t("static.selectEpisodes"),
    },
    {
      key: "tag",
      label: t("static.tags"),
      type: "select",
      options: tags.map((e) => ({ id: e.id, label: e.name })),
      placeholder: t("static.selectTags"),
    },
    {
      key: "match",
      label: t("static.matches"),
      type: "select",
      options: matches.map((m) => ({ id: m.id, label: m.name })),
      placeholder: t("static.selectMatches"),
    },
    {
      key: "isExample",
      label: t("static.isExample"),
      type: "checkbox",
      placeholder: t("static.isExample"),
    },
  ];

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values); // save!

    const dto = {
      searchTerm: values.searchTerm ?? undefined,
      playerId: values.player?.id ?? undefined,
      episodeId: values.episode?.id ?? undefined,
      tagId: values.tag?.id ?? undefined,
      matchId: values.match?.id ?? undefined,
      isExample: values.isExample ?? undefined,
    };
    dispatch(fetchClips(dto));

    setStatsOpen(false);
  };

  const handleReset = () => {
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
          {t("static.openFilters") || "Open Filters"}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12">
          <ClipsList />
        </div>
      </div>

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

export default ClipsPage;
