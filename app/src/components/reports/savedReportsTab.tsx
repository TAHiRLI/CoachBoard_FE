import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { deleteReport, fetchAllReports } from "@/store/slices/reports.slice";
import { ReportCategoryEnum, ReportGetDto } from "@/lib/types/reports.types";
import Swal from "sweetalert2";

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
      [ReportCategoryEnum.Player]: [],
      [ReportCategoryEnum.Team]: [],
      [ReportCategoryEnum.Episode]: [],
      [ReportCategoryEnum.Comparative]: [],
    };

    reports.forEach((report) => {
      if (categories[report.category]) {
        categories[report.category].push(report);
      }
    });

    return categories;
  }, [reports]);

  const handleAccordionChange = (category: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? category : false);
  };

  const handleViewReport = (report: ReportGetDto) => {
    if (report.fileUrl) {
      window.open(report.fileUrl, "_blank");
    } else if (report.filePath) {
      // Handle local file path if needed
      console.log("Opening local file:", report.filePath);
    } else {
      Swal.fire({
        icon: "info",
        title: t("static.noFileAvailable"),
        text: t("static.reportHasNoFile"),
      });
    }
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

  const getCategoryIcon = (category: string) => {
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
                <Box sx={{ color: getCategoryColor(category) }}>{getCategoryIcon(category)}</Box>
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
                          {report.description && (
                            <Typography variant="body2" color="text.secondary" className="mb-2">
                              {report.description}
                            </Typography>
                          )}
                          <Box className="flex gap-2 items-center flex-wrap">
                            <Chip label={report.reportType} size="small" color="primary" variant="outlined" />
                            <Typography variant="caption" color="text.secondary">
                              {t("static.created")}: {formatDate(report.createdAt)}
                            </Typography>
                            {report.createdBy && (
                              <Typography variant="caption" color="text.secondary">
                                {t("static.by")}: {report.createdBy}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box className="flex gap-1">
                          <Tooltip title={t("static.view")}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewReport(report)}
                              disabled={!report.fileUrl && !report.filePath}
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
