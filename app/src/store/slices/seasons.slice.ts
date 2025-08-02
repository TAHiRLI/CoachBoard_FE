import { Season, SeasonPostDto, SeasonPutDto, SeasonState } from "@/lib/types/seasons.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { seasonsService } from "@/API/Services/seasons.service";

// Initial state
const initialState: SeasonState = {
  seasons: [],
  loading: false,
  error: null,
  selectedSeason: null,
};

// Async thunks
export const fetchSeasons = createAsyncThunk("seasons/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await seasonsService.getAll();
    return response.data as Season[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch seasons");
  }
});

export const fetchSeasonById = createAsyncThunk("seasons/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await seasonsService.getById(id);
    return response.data as Season;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch season");
  }
});

export const createSeason = createAsyncThunk("seasons/create", async (dto: SeasonPostDto, { rejectWithValue }) => {
  try {
    const response = await seasonsService.create(dto);
    return response.data as Season;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create season");
  }
});

export const updateSeason = createAsyncThunk(
  "seasons/update",
  async ({ id, dto }: { id: string; dto: SeasonPutDto }, { rejectWithValue }) => {
    try {
      await seasonsService.update(id, dto);
      return { id, dto };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update season");
    }
  }
);

export const deleteSeason = createAsyncThunk("seasons/delete", async (id: string, { rejectWithValue }) => {
  try {
    await seasonsService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete season");
  }
});

// Slice
const seasonsSlice = createSlice({
  name: "seasons",
  initialState,
  reducers: {
    clearSelectedSeason: (state) => {
      state.selectedSeason = null;
    },
    clearSeasonError: (state) => {
      state.error = null;
    },
    selectSeason: (state, action) => {
      state.selectedSeason = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSeasons.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSeasons.fulfilled, (state, action) => {
      state.loading = false;
      state.seasons = action.payload;
    });
    builder.addCase(fetchSeasons.rejected, (state, action) => {
      state.loading = false;
      state.seasons = []; // ensures it's always an array
      state.error = action.payload as string;
    });

    builder.addCase(fetchSeasonById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSeasonById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedSeason = action.payload;
    });
    builder.addCase(fetchSeasonById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(createSeason.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSeason.fulfilled, (state, action) => {
      state.loading = false;
      state.seasons.push(action.payload);
    });
    builder.addCase(createSeason.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateSeason.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSeason.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.seasons.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.seasons[index] = { id: action.payload.id, ...action.payload.dto };
      }
    });
    builder.addCase(updateSeason.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteSeason.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteSeason.fulfilled, (state, action) => {
      state.loading = false;
      state.seasons = state.seasons.filter((season) => season.id !== action.payload);
      if (state.selectedSeason?.id === action.payload) {
        state.selectedSeason = null;
      }
    });
    builder.addCase(deleteSeason.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSelectedSeason, clearSeasonError, selectSeason } = seasonsSlice.actions;
export default seasonsSlice;
