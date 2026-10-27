import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

// Played matches already show their score, so only upcoming fixtures get a status label.
const MatchStatusChip = ({ date }: { date: string }) => {
  const { t } = useTranslation();
  if (new Date(date).getTime() <= Date.now()) return null;
  return <Chip label={t("static.upcoming")} color="primary" variant="outlined" size="small" />;
};

export default MatchStatusChip;
