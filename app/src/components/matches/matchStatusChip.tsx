import { Chip } from "@mui/material";

const MatchStatusChip = ({ date }: { date: string }) => {
  const matchDate = new Date(date);
  const now = new Date();
  const diff = matchDate.getTime() - now.getTime();
  const diffDays = diff / (1000 * 60 * 60 * 24);

  if (diff > 0 && diffDays <= 7) {
    return <Chip label="Upcoming" color="warning" size="small" />;
  }

  if (diff <= 0) {
    return <Chip label="Played" color="default" size="small" />;
  }

  return null;
};

export default MatchStatusChip;
