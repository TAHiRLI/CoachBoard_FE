import PlayerInfoCard from "@/components/players/PlayerInfoCard";
import { useParams } from "react-router-dom";

const PlayerDetailsPage = () => {
  const { playerId } = useParams();

  if (!playerId) return <></>;
  return (
    <div>
      <PlayerInfoCard playerId={playerId} />
    </div>
  );
};

export default PlayerDetailsPage;
