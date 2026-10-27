import apiClient from "../apiClient";

export type RestorableEntity =
  | "matches"
  | "clips"
  | "seasons"
  | "episodes"
  | "evaluations"
  | "participations"
  | "players"
  | "teams"
  | "clubs"
  | "coaches";

export const restoreService = {
  // Undo for soft deletes: POST /api/restore/{entity}/{id}
  restore(entity: RestorableEntity, id: string | number) {
    return apiClient.post(`api/restore/${entity}/${id}`);
  },
};
