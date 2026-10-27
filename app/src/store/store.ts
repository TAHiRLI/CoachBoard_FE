import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { errorMessage, notify } from "@/components/feedback/feedback";

import i18n from "i18next";
import { rememberFetch, undoFor } from "./undo";
import { persistReducer, persistStore } from "redux-persist";

import appUsersSlice from "./slices/appUsers.slice";
import authSlice from "./slices/auth.slice";
import clipsSlice from "./slices/clips.slice";
import clubsSlice from "./slices/clubs.slice";
import coachesSlice from "./slices/coaches.slice";
import episodesSlice from "./slices/episodes.slice";
import evaluationsSlice from "./slices/evaluations.slice";
import keycloakSlice from "./slices/keycloak.slice";
import matchesSlice from "./slices/matches.slice";
import participationslice from "./slices/playerMatchParticipation.slice";
import playersSlice from "./slices/players.slice";
import reportsSlice from "./slices/reports.slice";
import seasonsSlice from "./slices/seasons.slice";
import statisticsSlice from "./slices/statistics.slice";
import storage from "redux-persist/lib/storage"; // Default localStorage for web
import tagsSlice from "./slices/tags.slice";
import teamsSlice from "./slices/teams.slice";

//import slices

//Define persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  keycloak: keycloakSlice.reducer,
  auth: authSlice.reducer,
  seasonData: seasonsSlice.reducer,
  matchData: matchesSlice.reducer,
  teamData: teamsSlice.reducer,
  clubData: clubsSlice.reducer,
  playerData: playersSlice.reducer,
  clipData: clipsSlice.reducer,
  evaluationData: evaluationsSlice.reducer,
  episodeData: episodesSlice.reducer,
  participationData: participationslice.reducer,
  coachData: coachesSlice.reducer,
  appUserData: appUsersSlice.reducer,
  statistics: statisticsSlice.reducer,
  tagData: tagsSlice.reducer,
  reportsData: reportsSlice.reducer,
});

// App-wide feedback: every failed request is surfaced, every successful write is acknowledged.
// Components no longer need their own success popups or error snackbars.
const feedbackListener = createListenerMiddleware();
const SILENT_PREFIXES = ["keycloak/", "tags/create"];
const isSilent = (type: string) => SILENT_PREFIXES.some((prefix) => type.startsWith(prefix));
const writeVerb = (type: string) => /\/(create|update|delete)/i.exec(type)?.[1]?.toLowerCase();

feedbackListener.startListening({
  matcher: isRejected,
  effect: (action) => {
    const type = action.type.replace(/\/rejected$/, "");
    if (isSilent(type) || action.meta.aborted || action.meta.condition) return;
    notify("error", errorMessage(action.payload ?? action.error?.message));
  },
});

feedbackListener.startListening({
  matcher: isFulfilled,
  effect: (action, api) => {
    rememberFetch(action);
    const type = action.type.replace(/\/fulfilled$/, "");
    const verb = writeVerb(type);
    if (!verb || isSilent(type) || type === "clips/createTrimRequest") return;
    if (verb !== "delete") {
      notify("success", i18n.t("static.savedSuccessfully"));
      return;
    }

    const undo = undoFor(action, api.dispatch);
    notify(
      "success",
      i18n.t("static.deletedSuccessfully"),
      undo && {
        label: i18n.t("static.undo"),
        onClick: () =>
          undo()
            .then(() => notify("success", i18n.t("static.restored")))
            .catch((error) => notify("error", errorMessage(error))),
      }
    );
  },
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Configure store with middleware adjustment
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/PURGE", "auth/loginSuccess", "auth/setUser"],
        ignoredPaths: ["auth.user"],
      },
    }).prepend(feedbackListener.middleware),
});
export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
