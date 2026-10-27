export type TeamMatch = {
  teamId: string;
  clubId?: number;
  teamName: string;
  clubName: string;
  logo: string;
  score: number;
};

export type Match = {
  id: string;
  date: string;
  stadium: string;
  name: string;
  note: string;
  homeTeam: TeamMatch;
  awayTeam: TeamMatch;
  seasonId: string;
  seasonName: string;
  gameUrl: string;
  clipCount: number;
  /** Which side the signed-in user's club plays, set by the API. */
  ownSide?: "home" | "away";
  /** Result for the signed-in user's club once the match is played. */
  result?: "win" | "draw" | "loss";
};

export type MatchPostDto = {
  date: string;
  stadium: string;
  homeTeamScore: number;
  awayTeamScore: number;
  note: string;
  homeTeamId: string;
  awayTeamId: string;
  seasonId: string;
  gameUrl: string;
};

export type MatchPutDto = MatchPostDto;

export type MatchState = {
  matches: Match[];
  loading: boolean;
  error: string | null;
  selectedMatch: Match | null;
};
