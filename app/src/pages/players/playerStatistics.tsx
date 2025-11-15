import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DistributionPieChart } from '@/components/players/PlayerStatisticsComponents/DistributionPieChart';
// Import MUI Icons
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { EpisodeStatisticsTable } from '@/components/players/PlayerStatisticsComponents/EpisodeStatisticsTable';
import { EpisodeSuccessBarChart } from '@/components/players/PlayerStatisticsComponents/EpisodeSuccessBarChart';
import { MonthlyStatisticsTable } from '@/components/players/PlayerStatisticsComponents/MonthlyStatisticsTable';
import { MonthlyTrendLineChart } from '@/components/players/PlayerStatisticsComponents/MonthlyTrendLineChart';
import { OverviewStats } from '@/components/players/PlayerStatisticsComponents/OverviewStats';
import StarIcon from '@mui/icons-material/Star';
import { TabNavigation } from '@/components/players/PlayerStatisticsComponents/TabNavigation';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAppSelector } from "@/store/store";
import { useState } from 'react';

const PlayerStatistics = () => {
  const { playerOverview } = useAppSelector((x) => x.statistics);
  const [activeTab, setActiveTab] = useState<string>('episodes');

  // If no data, show empty state
  if (!playerOverview) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <EmojiEventsIcon sx={{ fontSize: 80, color: '#9ca3af' }} />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Statistika mövcud deyil</h2>
            <p className="text-gray-600 mt-2">Oyunçu statistikası yüklənmədi</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Oyunçu Performans Statistikası</h1>

        {/* Overview Stats Section */}
        <OverviewStats
          data={playerOverview}
          labels={{
            totalEpisodes: 'Ümumi Epizodlar',
            successRate: 'Uğur Nisbəti',
            criticalSaves: 'Kritik Xilaslıqlar',
            unsuccessfulEpisodes: 'Uğursuz Epizodlar'
          }}
          icons={{
            totalEpisodes: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
            successRate: <TrackChangesIcon sx={{ fontSize: 48 }} />,
            criticalSaves: <StarIcon sx={{ fontSize: 48 }} />,
            unsuccessfulEpisodes: <TrendingUpIcon sx={{ fontSize: 48 }} />
          }}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'episodes', label: 'Epizod Statistikası' },
            { 
              id: 'monthly', 
              label: 'Aylıq Trend',
              icon: <CalendarMonthIcon sx={{ fontSize: 20, marginRight: '8px' }} />
            }
          ]}
        />

        {/* Episodes Tab Content */}
        {activeTab === 'episodes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <DistributionPieChart
                successfulEpisodes={playerOverview.successfulEpisodes}
                unsuccessfulEpisodes={playerOverview.unsuccessfulEpisodes}
                title="Ümumi Bölgü"
                successLabel="Uğurlu"
                unsuccessfulLabel="Uğursuz"
              />

              {/* Bar Chart */}
              <EpisodeSuccessBarChart
                data={playerOverview.episodeStatistics}
                title="Epizod üzrə Uğur Nisbəti"
                barLabel="Uğur Nisbəti %"
              />
            </div>

            {/* Episode Statistics Table */}
            <EpisodeStatisticsTable
              data={playerOverview.episodeStatistics}
              title="Detallı Epizod Statistikası"
              columns={{
                episode: 'Epizod',
                total: 'Ümumi',
                successful: 'Uğurlu',
                unsuccessful: 'Uğursuz',
                critical: 'Kritik',
                successRate: 'Uğur %',
                progress: 'Progress'
              }}
            />
          </div>
        )}

        {/* Monthly Tab Content */}
        {activeTab === 'monthly' && (
          <div className="space-y-6">
            {/* Monthly Trend Chart */}
            <MonthlyTrendLineChart
              data={playerOverview.monthlyStatistics}
              title="Aylıq Performans Trendi"
              successRateLabel="Uğur Nisbəti %"
              averageScoreLabel="Orta Xal"
            />

            {/* Monthly Statistics Table */}
            <MonthlyStatisticsTable
              data={playerOverview.monthlyStatistics}
              title="Aylıq Detallı Statistika"
              columns={{
                month: 'Ay',
                matchCount: 'Oyun Sayı',
                successful: 'Uğurlu',
                unsuccessful: 'Uğursuz',
                successRate: 'Uğur %',
                critical: 'Kritik',
                minutes: 'Dəqiqə',
                averageScore: 'Orta Xal'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerStatistics;