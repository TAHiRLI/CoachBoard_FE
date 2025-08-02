export type TeamMatch = {
  teamid: string;
  teamName: string;
  clubName: string;
  logo: string;
  score: number;
};

export type Match = {
  id: string;
  date: string;
  stadium: string;
  note: string;
  homeTeam: TeamMatch;
  awayTeam: TeamMatch;
  seasonid: string;
  seasonName: string;
  gameUrl: string;
  clipCount: number;
};

export type MatchPostDto = {
  date: string;
  stadium: string;
  homeTeamScore: number;
  awayTeamScore: number;
  note: string;
  homeTeamId: number | "";
  awayTeamId: number | "";
  seasonId: number | "";
  gameUrl: string;
};

export type MatchPutDto = MatchPostDto;

export type MatchState = {
  matches: Match[];
  loading: boolean;
  error: string | null;
  selectedMatch: Match | null;
};

