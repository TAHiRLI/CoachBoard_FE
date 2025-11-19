import { Fragment, useEffect, useState } from "react";
import { InputAdornment, Paper, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";

import MatchItem from "@/components/matches/matchItem";
import SearchIcon from "@mui/icons-material/Search";
import { fetchMatches } from "@/store/slices/matches.slice";
import { useTranslation } from "react-i18next";

const MatchesList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedSeason } = useAppSelector((s) => s.seasonData);
  const { matches } = useAppSelector((s) => s.matchData);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedSeason) dispatch(fetchMatches({ seasonId: selectedSeason?.id }));
  }, [selectedSeason]);

  const filteredMatches = matches.filter((match) => {
    if (!match || !searchTerm) return true;
    const matchName = match.name;
    return matchName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Paper className="my-5 p-3">
        <TextField
          fullWidth
          placeholder={t("static.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredMatches.map((match, i) => {
          if (!match) return <Fragment key={i}></Fragment>;
          return <MatchItem key={match.id} match={match} />;
        })}
      </div>
    </div>
  );
};

export default MatchesList;
