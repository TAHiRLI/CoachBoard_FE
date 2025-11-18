import { PlayerStatisticsRequestDto, PlayerStatisticsResponseDto } from "@/lib/types/statistics.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { statisticsService } from "@/API/Services/statistics.service";

// ============================
// Load Player Statistics
// ============================

export const fetchPlayerStatistics = createAsyncThunk<
  PlayerStatisticsResponseDto, // return type
  PlayerStatisticsRequestDto, // input DTO
  { rejectValue: string }
>("statistics/fetchPlayerStatistics", async (dto, { rejectWithValue }) => {
  try {
    const res = await statisticsService.getPlayerOverview(dto);
    return res.data as PlayerStatisticsResponseDto;
  } catch (err: any) {
    return rejectWithValue(err.message ?? "Failed to load player statistics");
  }
});

// ============================
// Slice
// ============================

interface StatisticsState {
  playerOverview: PlayerStatisticsResponseDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  playerOverview: null,
  loading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    clearPlayerOverview(state) {
      state.playerOverview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayerStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.playerOverview = action.payload; // overwrite
      })
      .addCase(fetchPlayerStatistics.rejected, (state, action) => {
        state.loading = false;
        alert("Something went wrong"); 
        state.error = (action.payload as string) ?? "Something went wrong";
      });
  },
});

// ============================

export const { clearPlayerOverview } = statisticsSlice.actions;

export default statisticsSlice;
