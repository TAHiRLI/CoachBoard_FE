import { Avatar, Box, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { DetailedPlayer } from "@/lib/types/players.types";
import { apiUrl } from "@/lib/constants/constants";
import { playersService } from "@/API/Services/players.service";
import { usePlayerPositions } from "@/hooks/usePlayerPositions";
import { useTranslation } from "react-i18next";

type Props = {
  playerId: string;
};

const PlayerInfoCard: React.FC<Props> = ({ playerId }) => {
  const { t } = useTranslation();
  const [player, setPlayer] = useState<DetailedPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const playerPositions = usePlayerPositions();

  const position = useMemo(() => {
    return playerPositions.find((x) => x.value == player?.position);
  }, [player, playerPositions]);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await playersService.getById(playerId);
        setPlayer(response.data);
      } catch (error) {
        console.error("Failed to fetch player", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  if (loading)
    return (
      <Typography>
        <LinearProgress />
      </Typography>
    );
  if (!player) return <Typography>Player not found</Typography>;

  return (
    <Card elevation={2} className="rounded-2xl flex">
      <CardContent className="flex-1">
        <Typography variant="h6" className="font-bold mb-2">
          {player.fullName}
        </Typography>
        <Box className="grid grid-cols-2 gap-2">
          <div>
            <Typography variant="body2" color="textSecondary">
              {t("static.birthDate")}
            </Typography>
            <Typography variant="body1">{new Date(player.birthDate).toLocaleDateString()}</Typography>
          </div>
          <div>
            <Typography variant="body2" color="textSecondary">
              {t("static.position")}
            </Typography>
            <Typography variant="body1">{position?.label}</Typography>
          </div>
          <div>
            <Typography variant="body2" color="textSecondary">
              {t("static.heightCm")}
            </Typography>
            <Typography variant="body1">{player.height} </Typography>
          </div>
          <div>
            <Typography variant="body2" color="textSecondary">
              {t("static.team")}
            </Typography>
            <Typography variant="body1">{player.teamName || "-"}</Typography>
          </div>
          <div>
            <Typography variant="body2" color="textSecondary">
              {t("static.club")}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography variant="body1">{player.clubName || "-"}</Typography>
              {player.clubLogo && (
                <Box className="">
                  <Avatar src={`${apiUrl}/${player.clubLogo}`} alt={player.clubName} sx={{ width: 40, height: 40 }} />
                </Box>
              )}
            </div>
          </div>
        </Box>
      </CardContent>
      {player.photo && (
        <Box className="flex items-center justify-center p-4">
          <Avatar src={`${apiUrl}/${player.photo}`} alt={player.fullName} sx={{ width: 180, height: 180 }} />
        </Box>
      )}
    </Card>
  );
};

export default PlayerInfoCard;
