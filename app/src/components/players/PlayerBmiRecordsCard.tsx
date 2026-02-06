import { FC, useEffect, useMemo, useState } from "react";

import { LinearProgress } from "@mui/material";
import PlayerBmiRecordsTable from "@/components/players/PlayerBmiRecordsTable";
import { PlayerBmiRecordDto } from "@/lib/types/playerBmi.types";
import { playerBmiRecordsService } from "@/API/Services/playerBmiRecords.service";

interface Props {
  playerId: string;
  limit?: number;
}

const PlayerBmiRecordsCard: FC<Props> = ({ playerId, limit = 5 }) => {
  const [records, setRecords] = useState<PlayerBmiRecordDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await playerBmiRecordsService.getAll({ playerId });
        const sorted = [...(response.data ?? [])].sort(
          (a, b) => new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime()
        );
        setRecords(sorted);
      } catch (err) {
        console.error("Failed to fetch player BMI records:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [playerId]);

  const limitedRecords = useMemo(() => records.slice(0, limit), [records, limit]);

  if (loading) return <LinearProgress />;

  return <PlayerBmiRecordsTable records={limitedRecords} />;
};

export default PlayerBmiRecordsCard;
