import {
  Team,
  TeamPostDto,
  TeamPutDto,
  TeamState,
} from "@/lib/types/teams.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { teamsService } from "@/API/Services/teams.service";

// Initial state
const initialState: TeamState = {
  teams: [],
  loading: false,
  error: null,
  selectedTeam: null,
};

// Async thunks
export const fetchTeams = createAsyncThunk("teams/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await teamsService.getAll();
    return response.data as Team[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch teams");
  }
});

export const fetchTeamById = createAsyncThunk("teams/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await teamsService.getById(id);
    return response.data as Team;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch team");
  }
});

export const createTeam = createAsyncThunk("teams/create", async (dto: TeamPostDto, { rejectWithValue }) => {
  try {
    const response = await teamsService.create(dto);
    return response.data as Team;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to create team");
  }
});

export const updateTeam = createAsyncThunk(
  "teams/update",
  async ({ id, dto }: { id: string; dto: TeamPutDto }, { rejectWithValue }) => {
    try {
      await teamsService.update(id, dto);
      return { id, dto };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update team");
    }
  }
);

export const deleteTeam = createAsyncThunk("teams/delete", async (id: string, { rejectWithValue }) => {
  try {
    await teamsService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete team");
  }
});

// Slice
const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
    clearTeamError: (state) => {
      state.error = null;
    },
    selectTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeam = action.payload;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teams.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = {
            ...state.teams[index],
            ...action.payload.dto,
          };
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = state.teams.filter((team) => team.id !== action.payload);
        if (state.selectedTeam?.id === action.payload) {
          state.selectedTeam = null;
        }
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedTeam, clearTeamError, selectTeam } = teamsSlice.actions;
export default teamsSlice;
