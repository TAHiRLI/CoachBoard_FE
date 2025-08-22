import MatchesFilter from "./matchesFilter";
import MatchesList from "./matchesList";
import { fetchSeasons } from "@/store/slices/seasons.slice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const MatchesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSeasons());
  }, []);

  return (
    <div>
      <p className="page-subtitle"> {t("static.manageMatchesSubtitle")}</p>

      <MatchesFilter />

      <div>
        <MatchesList />
      </div>
    </div>
  );
};

export default MatchesPage;
