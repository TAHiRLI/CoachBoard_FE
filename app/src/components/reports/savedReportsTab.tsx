import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { ReportCategoryEnum, ReportGetDto } from "@/lib/types/reports.types";
import { deleteReport, fetchAllReports } from "@/store/slices/reports.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useMemo, useState } from "react";

import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const SavedReportsTab = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useAppSelector((state) => state.reportsData);
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);

  // Fetch reports on mount
  useEffect(() => {
    dispatch(fetchAllReports());
  }, [dispatch]);

  // Categorize reports by category
  const categorizedReports = useMemo(() => {
    const categories: Record<string, ReportGetDto[]> = {
      Player: [],
      Team: [],
      Episode: [],
      Comparative: [],
    };

    reports.forEach((report) => {
      const key = String(report.type);
      console.log("🚀 ~ SavedReportsTab ~ key:", key);

      if (!categories[key]) {
        categories[key] = [];
      }

      categories[key].push(report);
    });

    return categories;
  }, [reports]);

  const handleAccordionChange = (category: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? category : false);
  };

  const handleViewReport = (report: ReportGetDto) => {
    if (report.fileUrl) {
      // absolute local path coming from backend -> convert to API-served URL
      if (report.fileUrl.startsWith("/")) {
        const apiBase = import.meta.env.VITE_API_BASE_URL; // e.g. http://localhost:5000
        const normalizedPath = report.fileUrl.replace(/^\/+/, "");
        window.open(`${apiBase}/${normalizedPath}`, "_blank");
        return;
      }

      // already a valid http/https URL
      window.open(report.fileUrl, "_blank");
      return;
    }

    if (report.fileName) {
      Swal.fire({
        icon: "info",
        title: t("static.noFileAvailable"),
        text: t("static.fileNotPubliclyAccessible"),
      });
      return;
    }

    Swal.fire({
      icon: "info",
      title: t("static.noFileAvailable"),
      text: t("static.reportHasNoFile"),
    });
  };

  const handleDownloadReport = (report: ReportGetDto) => {
    if (report.fileUrl) {
      const link = document.createElement("a");
      link.href = report.fileUrl;
      link.download = report.title || "report";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      Swal.fire({
        icon: "info",
        title: t("static.noFileAvailable"),
        text: t("static.reportHasNoFile"),
      });
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    const result = await Swal.fire({
      title: t("static.areYouSure"),
      text: t("static.cannotBeUndone"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("static.yesDeleteIt"),
      cancelButtonText: t("static.cancel"),
    });

    if (result.isConfirmed) {
      await dispatch(deleteReport(reportId));
      Swal.fire({
        title: t("static.deleted"),
        text: t("static.reportDeleted"),
        icon: "success",
        timer: 2000,
      });
    }
  };

  const getCategoryIcon = () => {
    return <FolderIcon />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case ReportCategoryEnum.Player:
        return "#3b82f6"; // blue
      case ReportCategoryEnum.Team:
        return "#10b981"; // green
      case ReportCategoryEnum.Episode:
        return "#8b5cf6"; // purple
      case ReportCategoryEnum.Comparative:
        return "#f59e0b"; // amber
      default:
        return "#6b7280"; // gray
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-12">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-6">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (reports.length === 0) {
    return (
      <Box className="p-6">
        <Alert severity="info">{t("static.noReportsFound")}</Alert>
      </Box>
    );
  }

  return (
    <Box className="py-6">
      {Object.entries(categorizedReports).map(([category, categoryReports]) => {
        if (categoryReports.length === 0) return null;

        return (
          <Accordion
            key={category}
            expanded={expandedCategory === category}
            onChange={handleAccordionChange(category)}
            sx={{ mb: 2, boxShadow: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: `${getCategoryColor(category)}15`,
                borderLeft: `4px solid ${getCategoryColor(category)}`,
              }}
            >
              <Box className="flex items-center gap-3 w-full">
                <Box sx={{ color: getCategoryColor(category) }}>{getCategoryIcon()}</Box>
                <Typography variant="h6" className="font-semibold capitalize">
                  {t(`reportTypes.${category}.name`) || category}
                </Typography>
                <Chip
                  label={categoryReports.length}
                  size="small"
                  sx={{
                    ml: "auto",
                    backgroundColor: getCategoryColor(category),
                    color: "white",
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="grid grid-cols-1 gap-4">
                {categoryReports.map((report) => (
                  <Card key={report.id} sx={{ boxShadow: 1, "&:hover": { boxShadow: 3 } }}>
                    <CardContent>
                      <Box className="flex justify-between items-start">
                        <Box className="flex-1">
                          <Typography variant="h6" className="font-semibold mb-1">
                            {report.title}
                          </Typography>

                          <Box className="flex gap-2 items-center flex-wrap">
                            <Chip label={report.type} size="small" color="primary" variant="outlined" />
                            <Typography variant="caption" color="text.secondary">
                              {t("static.created")}: {formatDate(report.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="flex gap-1">
                          <Tooltip title={t("static.view")}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewReport(report)}
                              disabled={!report.fileUrl && !report.fileName}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t("static.download")}>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleDownloadReport(report)}
                              disabled={!report.fileUrl}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t("static.delete")}>
                            <IconButton size="small" color="error" onClick={() => handleDeleteReport(report.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default SavedReportsTab;
