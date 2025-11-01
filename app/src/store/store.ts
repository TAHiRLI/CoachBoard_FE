import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import seasonsSlice from "./slices/seasons.slice";
import storage from "redux-persist/lib/storage"; // Default localStorage for web
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
    }),
});
export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
