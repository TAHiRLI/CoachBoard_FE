import { MonthlyPlayerStatistic } from "@/lib/types/statistics.types";
import { getSuccessColor } from "@/lib/helpers/statistics.utils";

// Monthly Statistics Table Component
interface MonthlyStatisticsTableProps {
  data: MonthlyPlayerStatistic[];
  title?: string;
  columns?: {
    month?: string;
    matchCount?: string;
    successful?: string;
    unsuccessful?: string;
    successRate?: string;
    critical?: string;
    minutes?: string;
    averageScore?: string;
  };
}

export const MonthlyStatisticsTable: React.FC<MonthlyStatisticsTableProps> = ({
  data,
  title = "Aylıq Detallı Statistika",
  columns = {
    month: "Ay",
    matchCount: "Oyun Sayı",
    successful: "Uğurlu",
    unsuccessful: "Uğursuz",
    successRate: "Uğur %",
    critical: "Kritik",
    minutes: "Dəqiqə",
    averageScore: "Orta Xal",
  },
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-gray-200">
          <th className="text-left py-3 px-4 font-semibold text-gray-700">{columns.month}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.matchCount}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.successful}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.unsuccessful}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.successRate}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.critical}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.minutes}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.averageScore}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((month, idx) => (
          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-3 px-4 font-semibold">{month.month}</td>
            <td className="text-center py-3 px-4">{month.matchCount}</td>
            <td className="text-center py-3 px-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                {month.successfulEpisodes}
              </span>
            </td>
            <td className="text-center py-3 px-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                {month.unsuccessfulEpisodes}
              </span>
            </td>
            <td className="text-center py-3 px-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSuccessColor(
                  month.successRate
                )}`}
              >
                {month.successRate.toFixed(1)}%
              </span>
            </td>
            <td className="text-center py-3 px-4">
              {month.criticalSaves > 0 && (
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  {month.criticalSaves}
                </span>
              )}
            </td>
            <td className="text-center py-3 px-4">{month.totalMinutes}</td>
            <td className="text-center py-3 px-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSuccessColor(
                  month.averageScore
                )}`}
              >
                {month.averageScore.toFixed(1)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
