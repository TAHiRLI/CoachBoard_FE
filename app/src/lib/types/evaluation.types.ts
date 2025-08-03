export interface Evaluation {
  id: string;
  clipId: string;
  clipUrl: string;
  playerId: string;
  playerName: string;
  episodeId: string;
  episodeName: string;
  coachId: string;
  coachName: string;
  matchId: string;
  matchName: string;
  isSuccessful: boolean;
  isCritical: boolean;
  isExternal: boolean;
  couldBeBetter: boolean;
  notes: string;
}

export interface EvaluationPostDto {
  clipId: string;
  playerId: string;
  episodeId: string;
  coachId: string;
  isSuccessful: boolean;
  isCritical: boolean;
  couldBeBetter: boolean;
  notes: string;
}

export interface EvaluationPutDto {
  isSuccessful: boolean;
  isCritical: boolean;
  couldBeBetter: boolean;
  notes: string;
}
