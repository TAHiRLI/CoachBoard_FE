// app/src/pages/matches/matchesFilter.tsx
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import AddMatch from "@/components/matches/addMatch";
import CustomModal from "@/components/customModal/customModal";
import { fetchMatches } from "@/store/slices/matches.slice";
import { selectSeason } from "@/store/slices/seasons.slice";
import { useTranslation } from "react-i18next";

const MatchesFilter = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { seasons, selectedSeason } = useAppSelector((state) => state.seasonData);

  const handleSeasonChange = (id: string) => {
    const season = seasons.find((s) => s.id == id) ?? null;
    dispatch(selectSeason(season));
  };
  useEffect(() => {
    if (!selectedSeason && seasons.length > 0) {
      dispatch(selectSeason(seasons[seasons.length - 1]));
    }
  }, [selectedSeason, seasons, dispatch]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      <Box className="flex flex-wrap justify-between items-center gap-4">
        <Box className="flex items-center gap-4">
          <span className="font-semibold text-slate-800">{t("static.season")}:</span>
          <FormControl size="small">
            <Select
              value={selectedSeason?.id ?? ""}
              onChange={(e) => {
                handleSeasonChange(e.target.value);
              }}
              className="min-w-[120px] bg-white text-slate-700 font-medium"
            >
              {seasons.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className="flex gap-2 flex-wrap">
          <Button onClick={() => setIsOpen(true)} color="success" variant="contained" startIcon={<Add />}>
            {t("static.newMatch")}
          </Button>
        </Box>
      </Box>
      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <AddMatch
          onSuccess={() => {
            dispatch(fetchMatches({ seasonId: selectedSeason?.id })).then(() => {
              setIsOpen(false);
            });
          }}
        />
      </CustomModal>
    </Box>
  );
};

export default MatchesFilter;
