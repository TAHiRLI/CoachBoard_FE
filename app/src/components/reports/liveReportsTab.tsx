import { useNavigate } from "react-router-dom";
import { useReportTypes } from "@/hooks/useReportTypes";

const LiveReportsTab = () => {
  const navigate = useNavigate();
  const reportTypes = useReportTypes();

  return (
    <div className="p-6">
      {/* Report Type Selection */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Report Type</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {Object.values(reportTypes).map((reportType) => (
            <button
              key={reportType.id}
              onClick={() => navigate(reportType.url, { replace: true })}
              className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                  {reportType.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{reportType.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{reportType.description}</p>
                  <div className="flex gap-2">
                    {reportType.canCompare && (
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">Comparable</span>
                    )}
                    {reportType.canSchedule && (
                      <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">Schedulable</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveReportsTab;
