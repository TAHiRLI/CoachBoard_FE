import { Clip, ClipPostDto, ClipPutDto } from "@/lib/types/clips.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { clipsService } from "@/API/Services/clips.service";

interface ClipState {
  clips: Clip[];
  selectedClip: Clip | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClipState = {
  clips: [],
  selectedClip: null,
  loading: false,
  error: null,
};

export const fetchClips = createAsyncThunk(
  "clips/fetchClips",
  async (filter: { matchId?: string }, { rejectWithValue }) => {
    try {
      const res = await clipsService.getAll(filter.matchId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error fetching clips");
    }
  }
);
export const fetchClipById = createAsyncThunk("clips/fetchClipbyId", async (clipId: string, { rejectWithValue }) => {
  try {
    const res = await clipsService.getById(clipId);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error fetching clip");
  }
});

export const createClip = createAsyncThunk("clips/createClip", async (dto: ClipPostDto, { rejectWithValue }) => {
  try {
    const res = await clipsService.create(dto);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error creating clip");
  }
});

export const updateClip = createAsyncThunk(
  "clips/updateClip",
  async ({ id, dto }: { id: string; dto: ClipPutDto }, { rejectWithValue }) => {
    try {
      await clipsService.update(id, dto);
      return { id, dto };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error updating clip");
    }
  }
);

export const deleteClip = createAsyncThunk("clips/deleteClip", async (id: string, { rejectWithValue }) => {
  try {
    await clipsService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Error deleting clip");
  }
});

const clipsSlice = createSlice({
  name: "clips",
  initialState,
  reducers: {
    selectClip: (state, action) => {
      state.selectedClip = action.payload;
    },
    clearClipError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClips.fulfilled, (state, action) => {
        state.clips = action.payload;
        state.loading = false;
      })
      .addCase(fetchClips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchClipById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClipById.fulfilled, (state, action) => {
        state.selectedClip = action.payload;
        state.loading = false;
      })
      .addCase(fetchClipById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateClip.fulfilled, (state, action) => {
        const index = state.clips.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.clips[index] = {
            ...state.clips[index],
            ...action.payload.dto,
          };
        }
      })
      .addCase(deleteClip.fulfilled, (state, action) => {
        state.clips = state.clips.filter((c) => c.id !== action.payload);
      });
  },
});

export const { selectClip, clearClipError } = clipsSlice.actions;
export default clipsSlice;
