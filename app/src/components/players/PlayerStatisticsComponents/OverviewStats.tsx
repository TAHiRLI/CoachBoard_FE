import { PlayerStatisticsResponseDto } from "@/lib/types/statistics.types";
import { StatCard } from "./StatCard";

interface OverviewStatsProps {
  data: PlayerStatisticsResponseDto;
  labels?: {
    totalEpisodes?: string;
    successRate?: string;
    criticalSaves?: string;
    unsuccessfulEpisodes?: string;
  };
  icons?: {
    totalEpisodes?: React.ReactNode;
    successRate?: React.ReactNode;
    criticalSaves?: React.ReactNode;
    unsuccessfulEpisodes?: React.ReactNode;
  };
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  data,
  labels = {
    totalEpisodes: "Ümumi Epizodlar",
    successRate: "Uğur Nisbəti",
    criticalSaves: "Kritik Xilaslıqlar",
    unsuccessfulEpisodes: "Uğursuz Epizodlar",
  },
  icons = {},
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard
      title={labels.totalEpisodes!}
      value={data.totalEpisodes}
      icon={icons.totalEpisodes || <span className="text-5xl">📊</span>}
      gradient="bg-gradient-to-br from-blue-500 to-blue-600"
    />
    <StatCard
      title={labels.successRate!}
      value={`${data.successRate.toFixed(1)}%`}
      icon={icons.successRate || <span className="text-5xl">🎯</span>}
      gradient="bg-gradient-to-br from-green-500 to-green-600"
    />
    <StatCard
      title={labels.criticalSaves!}
      value={data.criticalSaves}
      icon={icons.criticalSaves || <span className="text-5xl">⭐</span>}
      gradient="bg-gradient-to-br from-orange-500 to-orange-600"
    />
    <StatCard
      title={labels.unsuccessfulEpisodes!}
      value={data.unsuccessfulEpisodes}
      icon={icons.unsuccessfulEpisodes || <span className="text-5xl">📈</span>}
      gradient="bg-gradient-to-br from-red-500 to-red-600"
    />
  </div>
);
