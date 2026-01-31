import {
  CalendarMonth as CalendarIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  IconButton,
  Tooltip,
} from "@mui/material";

import { ReportGetDto } from "@/lib/types/reports.types";
import Swal from "sweetalert2";
import { deleteReport } from "@/store/slices/reports.slice";
import { reportsService } from "@/API/Services/reports.service";
import { useAppDispatch } from "@/store/store";
import { useTranslation } from "react-i18next";

interface ReportItemProps {
  report: ReportGetDto;
  categoryType: string;
}

const ReportItem = ({ report, categoryType }: ReportItemProps) => {
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

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Player":
        return {
          accent: "bg-blue-500",
          iconBg: "bg-blue-50",
          iconText: "text-blue-600",
        };
      case "Team":
        return {
          accent: "bg-emerald-500",
          iconBg: "bg-emerald-50",
          iconText: "text-emerald-600",
        };
      case "Episode":
        return {
          accent: "bg-purple-500",
          iconBg: "bg-purple-50",
          iconText: "text-purple-600",
        };
      case "Comparative":
        return {
          accent: "bg-amber-500",
          iconBg: "bg-amber-50",
          iconText: "text-amber-600",
        };
      default:
        return {
          accent: "bg-gray-500",
          iconBg: "bg-gray-50",
          iconText: "text-gray-600",
        };
    }
  };

  const hasFile = report.fileUrl || report.fileName;
  const styles = getCategoryStyle(categoryType);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Accent line at top */}
      <div className={`h-1 ${styles.accent}`} />
      
      <div className="p-4">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${styles.iconBg} flex items-center justify-center ${styles.iconText}`}>
            <DescriptionIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
              {report.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{formatDate(report.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
            {report.type}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
          <Tooltip title={t("reports.actions.view")} arrow>
            <span>
              <IconButton
                size="small"
                onClick={handleViewReport}
                disabled={!hasFile}
                className="hover:bg-blue-50"
                sx={{
                  color: hasFile ? "#2563eb" : "#d1d5db",
                  "&:hover": {
                    backgroundColor: hasFile ? "#eff6ff" : "transparent",
                  },
                  "&.Mui-disabled": {
                    color: "#d1d5db",
                  },
                }}
              >
                <VisibilityIcon className="w-4 h-4" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t("reports.actions.download")} arrow>
            <span>
              <IconButton
                size="small"
                onClick={handleDownloadReport}
                disabled={!report.fileUrl}
                className="hover:bg-emerald-50"
                sx={{
                  color: report.fileUrl ? "#10b981" : "#d1d5db",
                  "&:hover": {
                    backgroundColor: report.fileUrl ? "#d1fae5" : "transparent",
                  },
                  "&.Mui-disabled": {
                    color: "#d1d5db",
                  },
                }}
              >
                <DownloadIcon className="w-4 h-4" />
              </IconButton>
            </span>
          </Tooltip>
          <div className="flex-1" />
          <Tooltip title={t("reports.actions.delete")} arrow>
            <IconButton
              size="small"
              onClick={handleDeleteReport}
              className="hover:bg-red-50"
              sx={{
                color: "#ef4444",
                "&:hover": {
                  backgroundColor: "#fee2e2",
                },
              }}
            >
              <DeleteIcon className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;