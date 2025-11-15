import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import { MonthlyPlayerStatistic } from "@/lib/types/statistics.types";

// Monthly Trend Line Chart Component
interface MonthlyTrendLineChartProps {
  data: MonthlyPlayerStatistic[];
  title?: string;
  successRateLabel?: string;
  averageScoreLabel?: string;
  successRateColor?: string;
  averageScoreColor?: string;
}

export const MonthlyTrendLineChart: React.FC<MonthlyTrendLineChartProps> = ({
  data,
  title = "Aylıq Performans Trendi",
  successRateLabel = "Uğur Nisbəti %",
  averageScoreLabel = "Orta Xal",
  successRateColor = "#10b981",
  averageScoreColor = "#3b82f6",
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="successRate"
          stroke={successRateColor}
          strokeWidth={3}
          name={successRateLabel}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="averageScore"
          stroke={averageScoreColor}
          strokeWidth={3}
          name={averageScoreLabel}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
