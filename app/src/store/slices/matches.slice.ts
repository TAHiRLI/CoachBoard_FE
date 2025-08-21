import { Match, MatchPostDto, MatchPutDto, MatchState } from "@/lib/types/matches.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { matchesService } from "@/API/Services/matches.service";

// Initial state
const initialState: MatchState = {
  matches: [],
  loading: false,
  error: null,
  selectedMatch: null,
};

// Async thunks
export const fetchMatches = createAsyncThunk(
  "matches/fetchAll",
  async (filters: { seasonId?: string; startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await matchesService.getAll(filters);
      return response.data as Match[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch matches");
    }
  }
);

export const fetchMatchById = createAsyncThunk("matches/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await matchesService.getById(id);
    return response.data as Match;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch match");
  }
});

export const createMatch = createAsyncThunk("matches/create", async (dto: MatchPostDto, { rejectWithValue }) => {
  try {
    const response = await matchesService.create(dto);
    return response.data as Match;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create match");
  }
});

export const updateMatch = createAsyncThunk(
  "matches/update",
  async ({ id, dto }: { id: string; dto: MatchPutDto }, { rejectWithValue }) => {
    try {
      await matchesService.update(id, dto);
      return { id, dto };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update match");
    }
  }
);

export const deleteMatch = createAsyncThunk("matches/delete", async (id: string, { rejectWithValue }) => {
  try {
    await matchesService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete match");
  }
});

// Slice
const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    clearSelectedMatch: (state) => {
      state.selectedMatch = null;
    },
    clearMatchError: (state) => {
      state.error = null;
    },
    selectMatch: (state, action) => {
      state.selectedMatch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;

        if (state.selectedMatch) {
          const updatedSelected = action.payload.find(m => m.id === state.selectedMatch?.id);
          if (updatedSelected) {
            state.selectedMatch = updatedSelected;
          }
        }
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchMatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMatch = action.payload;
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = state.matches.filter((m) => m.id !== action.payload);
        if (state.selectedMatch?.id === action.payload) {
          state.selectedMatch = null;
        }
      })
      .addCase(deleteMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedMatch, clearMatchError, selectMatch } = matchesSlice.actions;
export default matchesSlice;
