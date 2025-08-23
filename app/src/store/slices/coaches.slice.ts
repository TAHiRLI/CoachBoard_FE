import { Coach, CoachPostDto, CoachPutDto, CoachState } from "@/lib/types/coach.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { coachesService } from "@/API/Services/coaches.service";

const initialState: CoachState = {
  coaches: [],
  selectedCoach: null,
  loading: false,
  error: null,
};

export const fetchCoaches = createAsyncThunk("coaches/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await coachesService.getAll();
    return res.data as Coach[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch coaches");
  }
});

export const createCoach = createAsyncThunk("coaches/create", async (dto: CoachPostDto, { rejectWithValue }) => {
  try {
    const res = await coachesService.create(dto);
    return res.data as Coach;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create coach");
  }
});

export const updateCoach = createAsyncThunk(
  "coaches/update",
  async ({ id, dto }: { id: string; dto: CoachPutDto }, { rejectWithValue }) => {
    try {
      await coachesService.update(id, dto);
      return { id, dto };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update coach");
    }
  }
);

export const deleteCoach = createAsyncThunk("coaches/delete", async (id: string, { rejectWithValue }) => {
  try {
    await coachesService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete coach");
  }
});

const coachesSlice = createSlice({
  name: "coaches",
  initialState,
  reducers: {
    selectCoach: (state, action) => {
      state.selectedCoach = action.payload;
    },
    clearCoachError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoaches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoaches.fulfilled, (state, action) => {
        state.loading = false;
        state.coaches = action.payload;
      })
      .addCase(fetchCoaches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createCoach.fulfilled, (state, action) => {
        state.coaches.push(action.payload);
      })

      .addCase(deleteCoach.fulfilled, (state, action) => {
        state.coaches = state.coaches.filter((c) => c.id !== action.payload);
      });
  },
});

export const { selectCoach, clearCoachError } = coachesSlice.actions;
export default coachesSlice;