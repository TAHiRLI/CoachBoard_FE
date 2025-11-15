import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import { PlayerEpisodeStatistic } from "@/lib/types/statistics.types";

// Episode Success Bar Chart Component
interface EpisodeSuccessBarChartProps {
  data: PlayerEpisodeStatistic[];
  title?: string;
  barLabel?: string;
  barColor?: string;
}

export const EpisodeSuccessBarChart: React.FC<EpisodeSuccessBarChartProps> = ({ 
  data,
  title = 'Epizod üzrə Uğur Nisbəti',
  barLabel = 'Uğur Nisbəti %',
  barColor = '#10b981'
}) => (
  <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="episode" angle={-45} textAnchor="end" height={120} fontSize={12} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="successRate" fill={barColor} name={barLabel} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);