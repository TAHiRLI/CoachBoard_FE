export type PlayerMatchParticipation = {
  id: string;
  playerId: string;
  playerName: string;
  matchId: string;
  matchDate: string;
  minutesPlayed: number;
  isSuccessful: boolean;
  note: string;
  score: number;
};

export type PlayerMatchParticipationPostDto = {
  playerId: string;
  matchId: string;
  minutesPlayed: number;
  isSuccessful: boolean;
  note: string;
  score: number;
};

export type PlayerMatchParticipationPutDto = {
  minutesPlayed: number;
  isSuccessful: boolean;
  note: string;
  score: number;
};

export type PlayerMatchParticipationState = {
  participations: PlayerMatchParticipation[];
  loading: boolean;
  error: string | null;
  selectedParticipation: PlayerMatchParticipation | null;
};
