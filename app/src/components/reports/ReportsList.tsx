import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Typography,
  alpha,
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

import ReportItem from "./Reportitem";
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
    const iconProps = { sx: { fontSize: 28 } };
    
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case ReportCategoryEnum.Player:
        return {
          main: "#3b82f6",
          light: "#60a5fa",
          lighter: "#dbeafe",
        };
      case ReportCategoryEnum.Team:
        return {
          main: "#10b981",
          light: "#34d399",
          lighter: "#d1fae5",
        };
      case ReportCategoryEnum.Episode:
        return {
          main: "#8b5cf6",
          light: "#a78bfa",
          lighter: "#ede9fe",
        };
      case ReportCategoryEnum.Comparative:
        return {
          main: "#f59e0b",
          light: "#fbbf24",
          lighter: "#fef3c7",
        };
      default:
        return {
          main: "#6b7280",
          light: "#9ca3af",
          lighter: "#f3f4f6",
        };
    }
  };

  return (
    <Box className="space-y-4">
      {Object.entries(categorizedReports).map(([category, categoryReports]) => {
        if (categoryReports.length === 0) return null;

        const colors = getCategoryColor(category);
        const isExpanded = expandedCategory === category;

        return (
          <Accordion
            key={category}
            expanded={isExpanded}
            onChange={handleAccordionChange(category)}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: isExpanded
                ? `0 8px 24px ${alpha(colors.main, 0.15)}`
                : `0 2px 8px ${alpha(colors.main, 0.08)}`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                margin: "0 !important",
                marginBottom: "16px !important",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: colors.main,
                    fontSize: 32,
                  }}
                />
              }
              sx={{
                background: `linear-gradient(135deg, ${alpha(colors.main, 0.05)} 0%, ${alpha(
                  colors.light,
                  0.08
                )} 100%)`,
                borderLeft: `5px solid ${colors.main}`,
                minHeight: 72,
                px: 3,
                py: 2,
                "&:hover": {
                  background: `linear-gradient(135deg, ${alpha(colors.main, 0.08)} 0%, ${alpha(
                    colors.light,
                    0.12
                  )} 100%)`,
                },
                "& .MuiAccordionSummary-content": {
                  margin: "12px 0",
                },
              }}
            >
              <Box className="flex items-center gap-4 w-full">
                <Box
                  sx={{
                    color: colors.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: alpha(colors.main, 0.1),
                    transition: "all 0.2s",
                  }}
                >
                  {getCategoryIcon(category)}
                </Box>
                <Box className="flex-1">
                  <Typography
                    variant="h6"
                    className="font-bold"
                    sx={{
                      color: colors.main,
                      fontSize: "1.125rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {t(`reports.categories.${category}.title`) || category}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.875rem",
                      mt: 0.5,
                    }}
                  >
                    {t(`reports.categories.${category}.description`)}
                  </Typography>
                </Box>
                <Badge
                  badgeContent={categoryReports.length}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: colors.main,
                      color: "white",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      height: 28,
                      minWidth: 28,
                      borderRadius: 14,
                      padding: "0 8px",
                    },
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                p: 3,
                backgroundColor: alpha(colors.lighter, 0.3),
              }}
            >
              <Box className="grid grid-cols-1 gap-3">
                {categoryReports.map((report) => (
                  <ReportItem
                    key={report.id}
                    report={report}
                    categoryColor={colors.main}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default ReportsList;