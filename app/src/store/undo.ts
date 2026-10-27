import { AsyncThunk, UnknownAction } from "@reduxjs/toolkit";
import { RestorableEntity, restoreService } from "@/API/Services/restore.service";
import { deleteClip, fetchClips } from "./slices/clips.slice";
import { deleteClub, fetchClubs } from "./slices/clubs.slice";
import { deleteCoach, fetchCoaches } from "./slices/coaches.slice";
import { deleteEpisode, fetchEpisodes } from "./slices/episodes.slice";
import { deleteEvaluation, fetchEvaluations } from "./slices/evaluations.slice";
import { deleteMatch, fetchMatches } from "./slices/matches.slice";
import { deleteParticipation, fetchParticipations } from "./slices/playerMatchParticipation.slice";
import { deletePlayer, fetchPlayers } from "./slices/players.slice";
import { deleteSeason, fetchSeasons } from "./slices/seasons.slice";
import { deleteTeam, fetchTeams } from "./slices/teams.slice";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyThunk = AsyncThunk<any, any, any>;

// Every delete in the API is a soft delete, so each of these can be undone. After a restore the
// list is reloaded with the same arguments it was last loaded with (season, match, ...).
const undoable: { remove: AnyThunk; refetch: AnyThunk; entity: RestorableEntity }[] = [
  { remove: deleteMatch, refetch: fetchMatches, entity: "matches" },
  { remove: deleteClip, refetch: fetchClips, entity: "clips" },
  { remove: deleteSeason, refetch: fetchSeasons, entity: "seasons" },
  { remove: deleteEpisode, refetch: fetchEpisodes, entity: "episodes" },
  { remove: deleteEvaluation, refetch: fetchEvaluations, entity: "evaluations" },
  { remove: deleteParticipation, refetch: fetchParticipations, entity: "participations" },
  { remove: deletePlayer, refetch: fetchPlayers, entity: "players" },
  { remove: deleteTeam, refetch: fetchTeams, entity: "teams" },
  { remove: deleteClub, refetch: fetchClubs, entity: "clubs" },
  { remove: deleteCoach, refetch: fetchCoaches, entity: "coaches" },
];

const lastFetchArgs = new Map<string, unknown>();

/** Remembers the arguments of the most recent successful list fetch for each undoable entity. */
export const rememberFetch = (action: UnknownAction) => {
  for (const { refetch } of undoable) {
    if (refetch.fulfilled.match(action)) lastFetchArgs.set(refetch.typePrefix, action.meta.arg);
  }
};

/** Returns an undo callback when the action is a successful delete of a restorable record. */
export const undoFor = (action: UnknownAction, dispatch: (action: unknown) => unknown) => {
  const match = undoable.find(({ remove }) => remove.fulfilled.match(action));
  if (!match) return undefined;
  const id = (action as ReturnType<AnyThunk["fulfilled"]>).meta.arg as string;

  return async () => {
    await restoreService.restore(match.entity, id);
    dispatch(match.refetch(lastFetchArgs.get(match.refetch.typePrefix)));
  };
};
