import { Chip } from "@mui/material";
import { Match } from "@/lib/types/matches.types";
import { useTranslation } from "react-i18next";

const colors = { win: "success", draw: "default", loss: "error" } as const;

/** Win / draw / loss from the signed-in club's point of view (computed by the API). */
const MatchResultChip = ({ result }: { result?: Match["result"] }) => {
  const { t } = useTranslation();
  if (!result) return null;
  return <Chip size="small" variant="outlined" color={colors[result]} label={t(`static.result_${result}`)} />;
};

export default MatchResultChip;
