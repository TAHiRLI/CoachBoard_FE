import { Card, CardContent, CardHeader, Typography } from "@mui/material";

import { Match } from "@/lib/types/matches.types";

type Props = {
  match: Match;
  apiUrl?: string; // Optional base URL for team logos
};
const apiUrl = import.meta.env.VITE_API_URL;

const MatchInfoCard: React.FC<Props> = ({ match }) => {
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = matchDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader
        title={
          <Typography variant="h6" className="text-xl font-semibold">
            📋 Match Information
          </Typography>
        }
        className="border-b border-gray-200"
      />
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Season</p>
            <p className="text-base font-medium text-gray-800">{match.seasonName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="text-base font-medium text-gray-800">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-base font-medium text-gray-800">{formattedTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-base font-medium text-gray-800">{match.stadium}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Note</p>
            <p className="text-base font-medium text-gray-800">{match.note}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Link</p>
            <a target="_blank" href={match.gameUrl} className="text-base font-medium text-gray-800">
              {match.gameUrl}
            </a>
          </div>
          <div className="col-span-2 md:col-span-4 mt-4">
            <p className="text-sm text-gray-500">Final Score</p>
            <div className="flex items-center gap-2 mt-1 text-lg font-bold text-gray-800">
              {match.homeTeam.logo && (
                <img
                  src={`${apiUrl}/${match.homeTeam.logo}`}
                  alt={match.homeTeam.teamName}
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                />
              )}
              <span>{match.homeTeam.teamName}</span>
              <span>{match.homeTeam.score}</span>
              <span className="text-gray-500">-</span>
              <span>{match.awayTeam.score}</span>
              <span>{match.awayTeam.teamName}</span>
              {match.awayTeam.logo && (
                <img
                  src={`${apiUrl}/${match.awayTeam.logo}`}
                  alt={match.awayTeam.teamName}
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchInfoCard;
