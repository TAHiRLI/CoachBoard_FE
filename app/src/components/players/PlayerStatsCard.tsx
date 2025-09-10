import { FC, useEffect, useState } from "react";

import { LinearProgress } from "@mui/material";
import { PlayerStats } from "@/lib/types/evaluation.types";
import { evaluationsService } from "@/API/Services/evaluations.service";
import { useTranslation } from "react-i18next";

interface Props {
  playerId: string;
}

[];

const PlayerStatsCard: FC<Props> = ({ playerId }) => {
        
    const { t } = useTranslation();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await evaluationsService.getPlayerStats(playerId);
        setStats(response.data as PlayerStats);
      } catch (err) {
        console.error("Failed to fetch player stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [playerId]);

  if (loading) return <LinearProgress />;
  if (!stats) return <div className="text-center p-4">No stats available</div>;

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">{t("static.total")}:</div>
        <div>{stats.total}</div>

        <div className="font-medium">{t("static.successful")}:</div>
        <div>{stats.successful}</div>

        <div className="font-medium">{t("static.successRate")}:</div>
        <div>{stats.successRate}</div>

        {stats.episodeName && (
          <>
            <div className="font-medium">{t("static.episode")}:</div>
            <div>{stats.episodeName}</div>
          </>
        )}

        {stats.matchName && (
          <>
            <div className="font-medium">{t("static.match")}:</div>
            <div>{stats.matchName}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerStatsCard;
