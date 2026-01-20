import { Alert, Box, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store";

import ReportsList from "./ReportsList";
import { fetchAllReports } from "@/store/slices/reports.slice";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SavedReportsTab = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useAppSelector((state) => state.reportsData);

  useEffect(() => {
    dispatch(fetchAllReports());
  }, [dispatch]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[400px]">
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-6">
        <Alert 
          severity="error"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (reports.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <Box className="text-center max-w-md">
          <Box className="mb-4 text-6xl">📊</Box>
          <Alert 
            severity="info"
            variant="outlined"
            sx={{ 
              borderRadius: 3,
              backgroundColor: 'rgba(33, 150, 243, 0.05)',
              border: 'none'
            }}
          >
            <Box className="text-lg font-medium mb-2">
              {t("reports.noReportsTitle")}
            </Box>
            <Box className="text-sm opacity-80">
              {t("reports.noReportsDescription")}
            </Box>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="py-6 px-4 max-w-7xl mx-auto">
      <ReportsList reports={reports} />
    </Box>
  );
};

export default SavedReportsTab;