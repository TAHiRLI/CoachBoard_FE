import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  Compare as CompareIcon,
  ExpandMore as ExpandMoreIcon,
  Group as GroupIcon,
  VideoLibrary as VideoLibraryIcon,
} from "@mui/icons-material";
import { ReportCategoryEnum, ReportGetDto } from "@/lib/types/reports.types";
import { useMemo, useState } from "react";

import ReportItem from "./ReportItem";
import { useTranslation } from "react-i18next";

interface ReportsListProps {
  reports: ReportGetDto[];
}

const ReportsList = ({ reports }: ReportsListProps) => {
  const { t } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState<string | false>(
    reports.length > 0 ? String(reports[0].type) : false
  );

  const categorizedReports = useMemo(() => {
    const categories: Record<string, ReportGetDto[]> = {
      Player: [],
      Team: [],
      Episode: [],
      Comparative: [],
    };

    reports.forEach((report) => {
      const key = String(report.type);
      if (!categories[key]) {
        categories[key] = [];
      }
      categories[key].push(report);
    });

    // Sort reports within each category by creation date (newest first)
    Object.keys(categories).forEach((key) => {
      categories[key].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    return categories;
  }, [reports]);

  const handleAccordionChange =
    (category: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedCategory(isExpanded ? category : false);
    };

  const getCategoryIcon = (category: string) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (category) {
      case ReportCategoryEnum.Player:
        return <AssessmentIcon {...iconProps} />;
      case ReportCategoryEnum.Team:
        return <GroupIcon {...iconProps} />;
      case ReportCategoryEnum.Episode:
        return <VideoLibraryIcon {...iconProps} />;
      case ReportCategoryEnum.Comparative:
        return <CompareIcon {...iconProps} />;
      default:
        return <AssessmentIcon {...iconProps} />;
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case ReportCategoryEnum.Player:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: "bg-blue-100 text-blue-600",
          badge: "bg-blue-100 text-blue-700",
          hover: "hover:bg-blue-100",
        };
      case ReportCategoryEnum.Team:
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          icon: "bg-emerald-100 text-emerald-600",
          badge: "bg-emerald-100 text-emerald-700",
          hover: "hover:bg-emerald-100",
        };
      case ReportCategoryEnum.Episode:
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          icon: "bg-purple-100 text-purple-600",
          badge: "bg-purple-100 text-purple-700",
          hover: "hover:bg-purple-100",
        };
      case ReportCategoryEnum.Comparative:
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          icon: "bg-amber-100 text-amber-600",
          badge: "bg-amber-100 text-amber-700",
          hover: "hover:bg-amber-100",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: "bg-gray-100 text-gray-600",
          badge: "bg-gray-100 text-gray-700",
          hover: "hover:bg-gray-100",
        };
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(categorizedReports).map(([category, categoryReports]) => {
        if (categoryReports.length === 0) return null;

        const styles = getCategoryStyle(category);
        const isExpanded = expandedCategory === category;

        return (
          <Accordion
            key={category}
            expanded={isExpanded}
            onChange={handleAccordionChange(category)}
            className="rounded-lg overflow-hidden shadow-sm border"
            sx={{
              backgroundColor: "#ffffff",
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                margin: "0 !important",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon className={`${styles.text} text-2xl`} />
              }
              className={`${styles.bg} ${styles.border} border-l-4 transition-colors ${styles.hover}`}
              sx={{
                minHeight: 64,
                px: 2.5,
                py: 1.5,
                "& .MuiAccordionSummary-content": {
                  margin: "8px 0",
                },
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${styles.icon}`}>
                  {getCategoryIcon(category)}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold ${styles.text}`}>
                    {t(`reports.categories.${category}.title`) || category}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t(`reports.categories.${category}.description`)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
                  {categoryReports.length}
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails
              className="bg-gray-50"
              sx={{
                p: 2.5,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryReports.map((report) => (
                  <ReportItem
                    key={report.id}
                    report={report}
                    categoryType={category}
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default ReportsList;