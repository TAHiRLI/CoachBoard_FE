import {
  GeneratePlayerOverviewReport_DataResponse,
  PlayerOverviewReportRequestDto,
  ReportGetDto,
} from "@/lib/types/reports.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { reportsService } from "@/API/Services/reports.service";

// ============================
// Fetch All Reports
// ============================

export const fetchAllReports = createAsyncThunk<
  ReportGetDto[], // return type
  void, // no input
  { rejectValue: string }
>("reports/fetchAllReports", async (_, { rejectWithValue }) => {
  try {
    const res = await reportsService.getAll();
    return res.data as ReportGetDto[];
  } catch (err: any) {
    return rejectWithValue(err.message ?? "Failed to load reports");
  }
});

// ============================
// Generate Player Overview Report
// ============================

export const generatePlayerOverviewReport = createAsyncThunk<
  GeneratePlayerOverviewReport_DataResponse, // return type
  PlayerOverviewReportRequestDto, // input DTO
  { rejectValue: string }
>("reports/generatePlayerOverview", async (dto, { rejectWithValue }) => {
  try {
    const res = await reportsService.generatePlayerOverview(dto);
    return res.data as GeneratePlayerOverviewReport_DataResponse;
  } catch (err: any) {
    return rejectWithValue(err.message ?? "Failed to generate report");
  }
});

// ============================
// Delete Report
// ============================

export const deleteReport = createAsyncThunk<
  string, // return the deleted report ID
  string, // input: report ID
  { rejectValue: string }
>("reports/deleteReport", async (reportId, { rejectWithValue }) => {
  try {
    await reportsService.delete(reportId);
    return reportId;
  } catch (err: any) {
    return rejectWithValue(err.message ?? "Failed to delete report");
  }
});

// ============================
// Slice
// ============================

interface ReportsState {
  reports: ReportGetDto[];
  loading: boolean;
  error: string | null;
  generatingReport: boolean;
  generateError: string | null;
}

const initialState: ReportsState = {
  reports: [],
  loading: false,
  error: null,
  generatingReport: false,
  generateError: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReports(state) {
      state.reports = [];
    },
    clearErrors(state) {
      state.error = null;
      state.generateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Reports
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Something went wrong";
      })
      // Generate Player Overview Report
      .addCase(generatePlayerOverviewReport.pending, (state) => {
        state.generatingReport = true;
        state.generateError = null;
      })
      .addCase(generatePlayerOverviewReport.fulfilled, (state) => {
        state.generatingReport = false;
        // Optionally refresh the reports list after generation
      })
      .addCase(generatePlayerOverviewReport.rejected, (state, action) => {
        state.generatingReport = false;
        state.generateError = (action.payload as string) ?? "Failed to generate report";
      })
      // Delete Report
      .addCase(deleteReport.fulfilled, (state, action) => {
        // Remove the deleted report from the list
        state.reports = state.reports.filter((report) => report.id !== action.payload);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to delete report";
      });
  },
});

// ============================

export const { clearReports, clearErrors } = reportsSlice.actions;

export default reportsSlice;
