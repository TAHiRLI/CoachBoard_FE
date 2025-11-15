import { getProgressColor, getSuccessColor } from "@/lib/helpers/statistics.utils";

import { PlayerEpisodeStatistic } from "@/lib/types/statistics.types";

// Episode Statistics Table Component
interface EpisodeStatisticsTableProps {
  data: PlayerEpisodeStatistic[];
  title?: string;
  columns?: {
    episode?: string;
    total?: string;
    successful?: string;
    unsuccessful?: string;
    critical?: string;
    successRate?: string;
    progress?: string;
  };
}

export const EpisodeStatisticsTable: React.FC<EpisodeStatisticsTableProps> = ({
  data,
  title = "Detallı Epizod Statistikası",
  columns = {
    episode: "Epizod",
    total: "Ümumi",
    successful: "Uğurlu",
    unsuccessful: "Uğursuz",
    critical: "Kritik",
    successRate: "Uğur %",
    progress: "Progress",
  },
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-gray-200">
          <th className="text-left py-3 px-4 font-semibold text-gray-700">{columns.episode}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.total}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.successful}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.unsuccessful}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.critical}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.successRate}</th>
          <th className="text-center py-3 px-4 font-semibold text-gray-700">{columns.progress}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((ep, idx) => (
          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-3 px-4">{ep.episode}</td>
            <td className="text-center py-3 px-4">{ep.totalOccurrences}</td>
            <td className="text-center py-3 px-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                {ep.successfulOccurrences}
              </span>
            </td>
            <td className="text-center py-3 px-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                {ep.unsuccessfulOccurrences}
              </span>
            </td>
            <td className="text-center py-3 px-4">
              {ep.criticalSaves > 0 && (
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                  {ep.criticalSaves}
                </span>
              )}
            </td>
            <td className="text-center py-3 px-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSuccessColor(
                  ep.successRate
                )}`}
              >
                {ep.successRate.toFixed(1)}%
              </span>
            </td>
            <td className="py-3 px-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(ep.successRate)}`}
                  style={{ width: `${ep.successRate}%` }}
                ></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
