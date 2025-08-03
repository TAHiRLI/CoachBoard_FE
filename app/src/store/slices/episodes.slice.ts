import { Episode, EpisodePostDto, EpisodePutDto, EpisodeState } from "@/lib/types/episodes.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { episodesService } from "@/API/Services/episodes.service";

const initialState: EpisodeState = {
  episodes: [],
  loading: false,
  error: null,
  selectedEpisode: null,
};

export const fetchEpisodes = createAsyncThunk("episodes/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await episodesService.getAll();
    return response.data as Episode[];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch episodes");
  }
});

export const createEpisode = createAsyncThunk("episodes/create", async (dto: EpisodePostDto, { rejectWithValue }) => {
  try {
    const response = await episodesService.create(dto);
    return response.data as Episode;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to create episode");
  }
});

export const updateEpisode = createAsyncThunk(
  "episodes/update",
  async ({ id, dto }: { id: string; dto: EpisodePutDto }, { rejectWithValue }) => {
    try {
      await episodesService.update(id, dto);
      return { id, dto };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update episode");
    }
  }
);

export const deleteEpisode = createAsyncThunk("episodes/delete", async (id: string, { rejectWithValue }) => {
  try {
    await episodesService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete episode");
  }
});

const episodesSlice = createSlice({
  name: "episodes",
  initialState,
  reducers: {
    clearSelectedEpisode: (state) => {
      state.selectedEpisode = null;
    },
    clearEpisodeError: (state) => {
      state.error = null;
    },
    selectEpisode: (state, action) => {
      state.selectedEpisode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.episodes = action.payload;
        state.loading = false;
      })
      .addCase(createEpisode.fulfilled, (state, action) => {
        state.episodes.push(action.payload);
      })
      .addCase(deleteEpisode.fulfilled, (state, action) => {
        state.episodes = state.episodes.filter((e) => e.id !== action.payload);
      });
  },
});

export const { clearSelectedEpisode, selectEpisode, clearEpisodeError } = episodesSlice.actions;
export default episodesSlice;
