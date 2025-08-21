import {
  PlayerMatchParticipation,
  PlayerMatchParticipationPostDto,
  PlayerMatchParticipationPutDto,
  PlayerMatchParticipationState,
} from "@/lib/types/playerMatchParticipation.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { playerMatchParticipationService } from "@/API/Services/playerMatchParticipation.service";

const initialState: PlayerMatchParticipationState = {
  participations: [],
  loading: false,
  error: null,
  selectedParticipation: null,
};

export const fetchParticipations = createAsyncThunk(
  "participations/fetchAll",
  async (filter: { matchId?: string; playerId?: string }, { rejectWithValue }) => {
    try {
      const response = await playerMatchParticipationService.getAll(filter?.matchId, filter?.playerId);
      return response.data as PlayerMatchParticipation[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch participations");
    }
  }
);

export const createParticipation = createAsyncThunk(
  "participations/create",
  async (dto: PlayerMatchParticipationPostDto, { rejectWithValue }) => {
    try {
      const response = await playerMatchParticipationService.create(dto);
      return response.data as PlayerMatchParticipation;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create participation");
    }
  }
);

export const updateParticipation = createAsyncThunk(
  "participations/update",
  async ({ id, dto }: { id: string; dto: PlayerMatchParticipationPutDto }, { rejectWithValue }) => {
    try {
      await playerMatchParticipationService.update(id, dto);
      return { id, dto };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update participation");
    }
  }
);

export const deleteParticipation = createAsyncThunk(
  "participations/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await playerMatchParticipationService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete participation");
    }
  }
);

const playerMatchParticipationSlice = createSlice({
  name: "playerMatchParticipations",
  initialState,
  reducers: {
    clearParticipationError: (state) => {
      state.error = null;
    },
    selectParticipation: (state, action) => {
      state.selectedParticipation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchParticipations.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchParticipations.fulfilled, (state, action) => {
      state.loading = false;
      state.participations = action.payload;
    });
    builder.addCase(fetchParticipations.rejected, (state, action) => {
      state.loading = false;
      state.participations = [];
      state.error = action.payload as string;
    });

    builder.addCase(createParticipation.fulfilled, (state, action) => {
      state.participations.push(action.payload);
    });

    builder.addCase(updateParticipation.fulfilled, (state, action) => {
      const index = state.participations.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.participations[index] = { ...state.participations[index], ...action.payload.dto };
      }
    });

    builder.addCase(deleteParticipation.fulfilled, (state, action) => {
      state.participations = state.participations.filter((p) => p.id !== action.payload);
      if (state.selectedParticipation?.id === action.payload) {
        state.selectedParticipation = null;
      }
    });
  },
});

export const { clearParticipationError, selectParticipation } = playerMatchParticipationSlice.actions;
export default playerMatchParticipationSlice;