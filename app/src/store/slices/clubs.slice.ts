import {
  Club,
  ClubPostDto,
  ClubPutDto,
  ClubState,
  ClubWithTeams,
} from "@/lib/types/clubs.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { clubsService } from "@/API/Services/clubs.service";

// Initial state
const initialState: ClubState = {
  clubs: [],
  loading: false,
  error: null,
  selectedClub: null,
};

// Thunks
export const fetchClubs = createAsyncThunk("clubs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await clubsService.getAll();
    return response.data as Club[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch clubs");
  }
});

export const fetchClubById = createAsyncThunk("clubs/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await clubsService.getById(id);
    return response.data as ClubWithTeams;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch club");
  }
});

export const createClub = createAsyncThunk("clubs/create", async (dto: ClubPostDto, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", dto.name);
    if (dto.logo) formData.append("logo", dto.logo);

    const response = await clubsService.create(formData);
    return response.data as Club;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create club");
  }
});

export const updateClub = createAsyncThunk(
  "clubs/update",
  async ({ id, dto }: { id: string; dto: ClubPutDto }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", dto.name);
      if (dto.logo) formData.append("logo", dto.logo);

      await clubsService.update(id, formData);
      return { id, dto };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update club");
    }
  }
);

export const deleteClub = createAsyncThunk("clubs/delete", async (id: string, { rejectWithValue }) => {
  try {
    await clubsService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete club");
  }
});

// Slice
const clubsSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    clearSelectedClub: (state) => {
      state.selectedClub = null;
    },
    clearClubError: (state) => {
      state.error = null;
    },
    selectClub: (state, action) => {
      state.selectedClub = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = action.payload;
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchClubById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClub = action.payload;
      })
      .addCase(fetchClubById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createClub.fulfilled, (state, action) => {
        state.clubs.push(action.payload);
      });

    builder
      .addCase(updateClub.fulfilled, (state, action) => {
        const index = state.clubs.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.clubs[index] = {
            ...state.clubs[index],
            name: action.payload.dto.name,
          };
        }
      });

    builder
      .addCase(deleteClub.fulfilled, (state, action) => {
        state.clubs = state.clubs.filter((c) => c.id !== action.payload);
        if (state.selectedClub?.id === action.payload) {
          state.selectedClub = null;
        }
      });
  },
});

export const { clearSelectedClub, clearClubError, selectClub } = clubsSlice.actions;
export default clubsSlice;
