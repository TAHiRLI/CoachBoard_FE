import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DistributionPieChart } from "@/components/players/PlayerStatisticsComponents/DistributionPieChart";
// Import MUI Icons
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { EpisodeStatisticsTable } from "@/components/players/PlayerStatisticsComponents/EpisodeStatisticsTable";
import { EpisodeSuccessBarChart } from "@/components/players/PlayerStatisticsComponents/EpisodeSuccessBarChart";
import { MonthlyStatisticsTable } from "@/components/players/PlayerStatisticsComponents/MonthlyStatisticsTable";
import { MonthlyTrendLineChart } from "@/components/players/PlayerStatisticsComponents/MonthlyTrendLineChart";
import { OverviewStats } from "@/components/players/PlayerStatisticsComponents/OverviewStats";
import StarIcon from "@mui/icons-material/Star";
import { TabNavigation } from "@/components/players/PlayerStatisticsComponents/TabNavigation";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAppSelector } from "@/store/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PlayerStatistics = () => {
  const { t } = useTranslation();
  const { playerOverview } = useAppSelector((x) => x.statistics);
  const [activeTab, setActiveTab] = useState<string>("episodes");

  // If no data, show empty state
  if (!playerOverview) {
    return (
      <div className="min-h-screen ">
        <div className=" mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <EmojiEventsIcon sx={{ fontSize: 80, color: "#9ca3af" }} />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{t("statistics.noDataTitle")}</h2>
            <p className="text-gray-600 mt-2">{t("statistics.noDataSubtitle")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{t("statistics.pageTitle")}</h1>

        {/* Overview Stats Section */}
        <OverviewStats
          data={playerOverview}
          labels={{
            totalEpisodes: t("statistics.totalEpisodes"),
            successRate: t("statistics.successRate"),
            criticalSaves: t("statistics.criticalSaves"),
            unsuccessfulEpisodes: t("statistics.unsuccessfulEpisodes"),
          }}
          icons={{
            totalEpisodes: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
            successRate: <TrackChangesIcon sx={{ fontSize: 48 }} />,
            criticalSaves: <StarIcon sx={{ fontSize: 48 }} />,
            unsuccessfulEpisodes: <TrendingUpIcon sx={{ fontSize: 48 }} />,
          }}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: "episodes", label: t("statistics.tabEpisodes") },
            {
              id: "monthly",
              label: t("statistics.tabMonthly"),
              icon: <CalendarMonthIcon sx={{ fontSize: 20, marginRight: "8px" }} />,
            },
          ]}
        />

        {/* Episodes Tab Content */}
        {activeTab === "episodes" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <DistributionPieChart
                successfulEpisodes={playerOverview.successfulEpisodes}
                unsuccessfulEpisodes={playerOverview.unsuccessfulEpisodes}
                title={t("statistics.distributionTitle")}
                successLabel={t("statistics.successful")}
                unsuccessfulLabel={t("statistics.unsuccessful")}
              />

              {/* Bar Chart */}
              <EpisodeSuccessBarChart
                data={playerOverview.episodeStatistics}
                title={t("statistics.episodeSuccessTitle")}
                barLabel={t("statistics.episodeBarLabel")}
              />
            </div>

            {/* Episode Statistics Table */}
            <EpisodeStatisticsTable
              data={playerOverview}
              title={t("statistics.episodeTableTitle")}
              columns={{
                episode: t("static.episode"),
                total: t("statistics.episodeColumnTotal"),
                successful: t("static.successful"),
                unsuccessful: t("statistics.unsuccessful"),
                critical: t("static.critical"),
                successRate: t("statistics.episodeColumnSuccessRate"),
                progress: t("statistics.episodeColumnProgress"),
              }}
            />
          </div>
        )}

        {/* Monthly Tab Content */}
        {activeTab === "monthly" && (
          <div className="space-y-6">
            {/* Monthly Trend Chart */}
            <MonthlyTrendLineChart
              data={playerOverview.monthlyStatistics}
              title={t("statistics.monthlyTrendTitle")}
              successRateLabel={t("statistics.monthlySuccessRateLabel")}
              averageScoreLabel={t("statistics.monthlyAverageScoreLabel")}
            />

            {/* Monthly Statistics Table */}
            <MonthlyStatisticsTable
              data={playerOverview.monthlyStatistics}
              title={t("statistics.monthlyTableTitle")}
              columns={{
                month: t("statistics.monthlyColumnMonth"),
                matchCount: t("statistics.monthlyColumnMatchCount"),
                successful: t("static.successful"),
                unsuccessful: t("statistics.unsuccessful"),
                successRate: t("statistics.monthlyColumnSuccessRate"),
                critical: t("static.critical"),
                minutes: t("static.minutes"),
                averageScore: t("statistics.monthlyColumnAverageScore"),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStatistics;
