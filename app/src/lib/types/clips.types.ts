export interface Clip {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  videoUrl: string;
  thumbnailUrl: string;
  isExternal: boolean;
  isExample: boolean;
  isProcessed: boolean;
  matchId?: string;
  matchName?: string;
  seasonName?: string;
  createdByCoachId: string;
  coachName: string;
  trimmedVideoUrl?: string;
  videoTrimRequest: VideoTrimRequest | null;
}

export interface VideoTrimRequest {
  id: number;
  clipId?: number | null;
  youtubeUrl: string;
  startSecond: number;
  endSecond: number;
  jobId?: number | null;
  resultVideoUrl?: string | null;
  errorMessage?: string | null;
  completedAt?: string | null; 
  status: string; 
  createdAt: string;
}

export interface ClipPostDto {
  name: string;
  matchId?: string;
  createdByCoachId: string;
  startTime: string;
  endTime: string;
  videoUrl: string;
  videoFile?: File;
  isExternal: boolean;
  isExample: boolean;
}

export interface ClipPutDto {
  name: string;
  matchId?: string;
  startTime: string;
  endTime: string;
  videoUrl: string;
  videoFile?: File;
  isExternal: boolean;
  isExample: boolean;
}
