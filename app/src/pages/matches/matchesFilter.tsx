// app/src/pages/matches/matchesFilter.tsx
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";

import { Add } from "@mui/icons-material";
import AddMatch from "@/components/matches/addMatch";
import CustomModal from "@/components/customModal/customModal";
import SearchIcon from "@mui/icons-material/Search";
import { fetchMatches } from "@/store/slices/matches.slice";
import { pickDefaultSeason } from "@/lib/utils/seasons";
import { selectSeason } from "@/store/slices/seasons.slice";
import { useTranslation } from "react-i18next";

interface MatchesFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const MatchesFilter = ({ searchTerm, onSearchChange }: MatchesFilterProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { seasons, selectedSeason } = useAppSelector((state) => state.seasonData);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!selectedSeason && seasons.length > 0) {
      dispatch(selectSeason(pickDefaultSeason(seasons)));
    }
  }, [selectedSeason, seasons, dispatch]);

  return (
    <Paper sx={{ p: 2, mb: 3, display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="season-select-label">{t("static.season")}</InputLabel>
        <Select
          labelId="season-select-label"
          label={t("static.season")}
          value={selectedSeason?.id ?? ""}
          onChange={(e) => dispatch(selectSeason(seasons.find((s) => s.id == e.target.value) ?? null))}
        >
          {seasons.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        placeholder={t("static.searchMatches")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flex: "1 1 240px", maxWidth: 420 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
          htmlInput: { "aria-label": t("static.searchMatches") },
        }}
      />

      <Button onClick={() => setIsOpen(true)} variant="contained" startIcon={<Add />} sx={{ ml: "auto" }}>
        {t("static.newMatch")}
      </Button>

      <CustomModal open={isOpen} setOpen={setIsOpen}>
        <AddMatch
          onSuccess={() => {
            dispatch(fetchMatches({ seasonId: selectedSeason?.id })).then(() => setIsOpen(false));
          }}
        />
      </CustomModal>
    </Paper>
  );
};

export default MatchesFilter;
