import { Player, PlayerPostDto, PlayerPutDto } from "@/lib/types/players.types";
// store/slices/players.slice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { playersService } from "@/API/Services/players.service";

interface PlayerState {
  players: Player[];
  selectedPlayer: Player | null;
  loading: boolean;
  error: string;
}

const initialState: PlayerState = {
  players: [],
  selectedPlayer: null,
  loading: false,
  error: "",
};

export const fetchPlayers = createAsyncThunk("players/fetch", async () => {
  const res = await playersService.getAll();
  return res.data;
});

export const createPlayer = createAsyncThunk("players/create", async (dto: PlayerPostDto) => {
  const res = await playersService.create(dto);
  return res.data;
});

export const updatePlayer = createAsyncThunk(
  "players/update",
  async ({ id, dto }: { id: string; dto: PlayerPutDto }) => {
    await playersService.update(id, dto);
    return { id, dto };
  }
);

export const deletePlayer = createAsyncThunk("players/delete", async (id: string) => {
  await playersService.delete(id)
  return id;
});

const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    selectPlayer: (state, action) => {
      state.selectedPlayer = action.payload;
    },
    clearPlayerError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch players";
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.players.push(action.payload);
      })
      .addCase(updatePlayer.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.players = state.players.filter((p) => p.id !== action.payload);
      });
  },
});

export const { selectPlayer, clearPlayerError } = playersSlice.actions;
export default playersSlice;
