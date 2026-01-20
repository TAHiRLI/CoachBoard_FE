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
        borderRadius: 2.5,
        border: `1px solid ${alpha(categoryColor, 0.12)}`,
        boxShadow: `0 2px 8px ${alpha(categoryColor, 0.04)}`,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          boxShadow: `0 8px 24px ${alpha(categoryColor, 0.12)}`,
          transform: "translateY(-2px)",
          borderColor: alpha(categoryColor, 0.3),
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${categoryColor}, ${alpha(categoryColor, 0.6)})`,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box className="flex justify-between items-start gap-3">
          {/* Left side - Content */}
          <Box className="flex-1 min-w-0">
            <Box className="flex items-start gap-2 mb-3">
              <Box
                sx={{
                  mt: 0.5,
                  color: categoryColor,
                  backgroundColor: alpha(categoryColor, 0.1),
                  borderRadius: 1.5,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box className="flex-1 min-w-0">
                <Typography
                  variant="h6"
                  className="font-semibold truncate"
                  sx={{
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    color: "text.primary",
                    mb: 0.5,
                  }}
                >
                  {report.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={report.type}
                    size="small"
                    sx={{
                      backgroundColor: alpha(categoryColor, 0.12),
                      color: categoryColor,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                      "& .MuiChip-label": {
                        px: 1.5,
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
                        fontSize: "0.75rem",
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
              backgroundColor: alpha(categoryColor, 0.04),
              borderRadius: 2,
              p: 0.5,
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
                    "&:hover": {
                      backgroundColor: alpha(categoryColor, 0.12),
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
                    "&:hover": {
                      backgroundColor: alpha("#10b981", 0.12),
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
                  "&:hover": {
                    backgroundColor: alpha("#ef4444", 0.12),
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