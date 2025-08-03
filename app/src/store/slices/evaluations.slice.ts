import { Evaluation, EvaluationPostDto, EvaluationPutDto } from "@/lib/types/evaluation.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { evaluationsService } from "@/API/Services/evaluations.service";

interface EvaluationState {
  evaluations: Evaluation[];
  selectedEvaluation: Evaluation | null;
  loading: boolean;
  error: string | null;
}

const initialState: EvaluationState = {
  evaluations: [],
  selectedEvaluation: null,
  loading: false,
  error: null,
};

export const fetchEvaluations = createAsyncThunk(
  "evaluations/fetchAll",
  async (params: { playerId?: string; matchId?: string; episodeId?: string; clipId?:string }, { rejectWithValue }) => {
    try {
      const res = await evaluationsService.getAll(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error fetching evaluations");
    }
  }
);

export const createEvaluation = createAsyncThunk(
  "evaluations/create",
  async (dto: EvaluationPostDto, { rejectWithValue }) => {
    try {
      const res = await evaluationsService.create(dto);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error creating evaluation");
    }
  }
);

export const updateEvaluation = createAsyncThunk(
  "evaluations/update",
  async ({ id, dto }: { id: string; dto: EvaluationPutDto }, { rejectWithValue }) => {
    try {
      await evaluationsService.update(id, dto);
      return { id, dto };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error updating evaluation");
    }
  }
);

export const deleteEvaluation = createAsyncThunk("evaluations/delete", async (id: string, { rejectWithValue }) => {
  try {
    await evaluationsService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error deleting evaluation");
  }
});

const evaluationsSlice = createSlice({
  name: "evaluations",
  initialState,
  reducers: {
    selectEvaluation(state, action) {
      state.selectedEvaluation = action.payload;
    },
    clearEvaluationError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.evaluations = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        const index = state.evaluations.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.evaluations[index] = {
            ...state.evaluations[index],
            ...action.payload.dto,
          };
        }
      })
      .addCase(deleteEvaluation.fulfilled, (state, action) => {
        state.evaluations = state.evaluations.filter((e) => e.id !== action.payload);
      });
  },
});

export const { selectEvaluation, clearEvaluationError } = evaluationsSlice.actions;
export default evaluationsSlice;
