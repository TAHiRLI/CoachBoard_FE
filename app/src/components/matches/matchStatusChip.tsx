import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

const MatchStatusChip = ({ date }: { date: string }) => {
  const { t } = useTranslation();
  const matchDate = new Date(date);
  const now = new Date();
  const diff = matchDate.getTime() - now.getTime();
  const diffDays = diff / (1000 * 60 * 60 * 24);

  if (diff > 0 && diffDays <= 7) {
    return <Chip label={t("static.upcoming")} color="warning" size="small" />;
  }

  if (diff <= 0) {
    return <Chip label={t("static.played")} color="default" size="small" />;
  }

  return null;
};

export default MatchStatusChip;