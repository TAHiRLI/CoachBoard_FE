import { Card, CardContent, Typography } from "@mui/material";

import PlayerEvaluationsList from "@/components/evaluations/evaluationsFilter";
import PlayerInfoCard from "@/components/players/PlayerInfoCard";
import PlayerStatsCard from "@/components/players/PlayerStatsCard";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PlayerDetailsPage = () => {
  const { t } = useTranslation();
  const { playerId } = useParams();

  if (!playerId) return <></>;
  return (
    <div className="">
      <PlayerInfoCard playerId={playerId} />

      <div className="my-4">
        <Typography variant="h6" gutterBottom>
          {t("static.evaluations")}
        </Typography>
        <Card>
          <CardContent>
            <PlayerStatsCard playerId={playerId} />
          </CardContent>
        </Card>
      </div>

      <div className="">
        <PlayerEvaluationsList playerId={playerId} />
      </div>
    </div>
  );
};

export default PlayerDetailsPage;
