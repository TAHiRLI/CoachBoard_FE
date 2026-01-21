import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

import { ReportGetDto } from "@/lib/types/reports.types";
import Swal from "sweetalert2";
import { deleteReport } from "@/store/slices/reports.slice";
import { reportsService } from "@/API/Services/reports.service";
import { useAppDispatch } from "@/store/store";
import { useTranslation } from "react-i18next";

interface ReportItemProps {
  report: ReportGetDto;
  categoryColor: string;
}

const ReportItem = ({ report, categoryColor }: ReportItemProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return t("reports.today") + " " + date.toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    }

    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return t("reports.yesterday") + " " + date.toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    }

    // Otherwise show full date
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewReport = async () => {
    try {
      if (!report.id) {
        Swal.fire({
          icon: "info",
          title: t("reports.noFileAvailable"),
          text: t("reports.reportHasNoFile"),
          confirmButtonColor: categoryColor,
        });
        return;
      }

      const response = await reportsService.getReportFile(report.id);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] ?? "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: t("common.error"),
        text: t("reports.failedToOpenFile"),
        confirmButtonColor: categoryColor,
      });
    }
  };

  const handleDownloadReport = async () => {
    try {
      if (!report.id) {
        Swal.fire({
          icon: "info",
          title: t("reports.noFileAvailable"),
          text: t("reports.reportHasNoFile"),
          confirmButtonColor: categoryColor,
        });
        return;
      }

      const response = await reportsService.getReportFile(report.id);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] ?? "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = report.title || "report";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: t("reports.downloadSuccess"),
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: t("common.error"),
        text: t("reports.failedToDownloadFile"),
        confirmButtonColor: categoryColor,
      });
    }
  };

  const handleDeleteReport = async () => {
    const result = await Swal.fire({
      title: t("common.areYouSure"),
      text: t("reports.deleteWarning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("common.yesDeleteIt"),
      cancelButtonText: t("common.cancel"),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await dispatch(deleteReport(report.id));
      Swal.fire({
        title: t("common.deleted"),
        text: t("reports.reportDeleted"),
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const hasFile = report.fileUrl || report.fileName;

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(categoryColor, 0.18)}`,
        backgroundColor: "#ffffff",
        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.08)",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)",
          transform: "translateY(-2px)",
          borderColor: alpha(categoryColor, 0.35),
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 12,
          left: 0,
          bottom: 12,
          width: 4,
          background: `linear-gradient(180deg, ${categoryColor}, ${alpha(categoryColor, 0.35)})`,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        },
      }}
    >
      <CardContent sx={{ p: 3, pl: 3.5, "&:last-child": { pb: 3 } }}>
        <Box className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Left side - Content */}
          <Box className="flex-1 min-w-0">
            <Box className="flex items-start gap-3 mb-2">
              <Box
                sx={{
                  mt: 0.5,
                  color: categoryColor,
                  backgroundColor: alpha(categoryColor, 0.12),
                  borderRadius: 2,
                  p: 1.1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.7)",
                }}
              >
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box className="flex-1 min-w-0">
                <Typography
                  variant="h6"
                  className="font-semibold truncate"
                  sx={{
                    fontSize: "1.05rem",
                    lineHeight: 1.4,
                    color: "text.primary",
                    mb: 0.75,
                  }}
                >
                  {report.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={report.type}
                    size="small"
                    sx={{
                      backgroundColor: alpha(categoryColor, 0.14),
                      color: categoryColor,
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      height: 26,
                      borderRadius: 999,
                      "& .MuiChip-label": {
                        px: 1.75,
                      },
                    }}
                  />
                  <Box className="flex items-center gap-1">
                    <CalendarIcon
                      sx={{
                        fontSize: 14,
                        color: "text.secondary",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.8rem",
                      }}
                    >
                      {formatDate(report.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>

          {/* Right side - Actions */}
          <Box
            className="flex gap-1"
            sx={{
              backgroundColor: alpha(categoryColor, 0.06),
              borderRadius: 2.5,
              p: 0.75,
              border: `1px solid ${alpha(categoryColor, 0.12)}`,
            }}
          >
            <Tooltip title={t("reports.actions.view")} arrow placement="top">
              <span>
                <IconButton
                  size="small"
                  onClick={handleViewReport}
                  disabled={!hasFile}
                  sx={{
                    color: hasFile ? categoryColor : "text.disabled",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: alpha(categoryColor, 0.14),
                    },
                    "&.Mui-disabled": {
                      color: "text.disabled",
                    },
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t("reports.actions.download")} arrow placement="top">
              <span>
                <IconButton
                  size="small"
                  onClick={handleDownloadReport}
                  disabled={!report.fileUrl}
                  sx={{
                    color: report.fileUrl ? "#10b981" : "text.disabled",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: alpha("#10b981", 0.14),
                    },
                    "&.Mui-disabled": {
                      color: "text.disabled",
                    },
                  }}
                >
                  <DownloadIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t("reports.actions.delete")} arrow placement="top">
              <IconButton
                size="small"
                onClick={handleDeleteReport}
                sx={{
                  color: "#ef4444",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: alpha("#ef4444", 0.14),
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportItem;
