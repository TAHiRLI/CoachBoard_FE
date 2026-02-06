import { Card, CardContent, Tab, Tabs, Typography } from "@mui/material";

import PlayerEvaluationsList from "@/components/evaluations/evaluationsFilter";
import PlayerBmiRecordsManager from "@/components/players/PlayerBmiRecordsManager";
import PlayerInfoCard from "@/components/players/PlayerInfoCard";
import PlayerStatsCard from "@/components/players/PlayerStatsCard";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PlayerDetailsPage = () => {
  const { t } = useTranslation();
  const { playerId } = useParams();
  const [tab, setTab] = useState<"info" | "evaluations" | "bmi">("info");

  if (!playerId) return <></>;
  return (
    <div className="">
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        centered
        sx={{ mb: 2 }}
      >
        <Tab value="info" label={t("static.info") || "Info"} />
        <Tab value="evaluations" label={t("static.evaluations")} />
        <Tab value="bmi" label={t("static.bmi")} />
      </Tabs>

      {tab === "info" && <PlayerInfoCard playerId={playerId} />}

      {tab === "evaluations" && (
        <>
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
        </>
      )}

      {tab === "bmi" && <PlayerBmiRecordsManager playerId={playerId} />}
    </div>
  );
};

export default PlayerDetailsPage;
