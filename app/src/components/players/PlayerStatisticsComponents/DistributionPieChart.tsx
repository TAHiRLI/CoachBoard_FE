import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Pie Chart Component

interface DistributionPieChartProps {
  successfulEpisodes: number;
  unsuccessfulEpisodes: number;
  title?: string;
  successLabel?: string;
  unsuccessfulLabel?: string;
  colors?: string[];
}

export const DistributionPieChart: React.FC<DistributionPieChartProps> = ({
  successfulEpisodes,
  unsuccessfulEpisodes,
  title = "Ümumi Bölgü",
  successLabel = "Uğurlu",
  unsuccessfulLabel = "Uğursuz",
  colors = ["#10b981", "#ef4444"],
}) => {
  const pieData = [
    { name: successLabel, value: successfulEpisodes },
    { name: unsuccessfulLabel, value: unsuccessfulEpisodes },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
