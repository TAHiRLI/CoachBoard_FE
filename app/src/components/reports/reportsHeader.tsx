import { BarChart, Description } from "@mui/icons-material";

import { useTranslation } from "react-i18next";

interface ReportsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MOCK_GENERATED_REPORTS = [""];

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ activeTab, setActiveTab }) => {
    
  const { t } = useTranslation();
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-slate-900">{t("static.reports")}</h1>
            <p className="text-sm text-slate-600 mt-1">
              {activeTab === "live" ? t("static.generateAnalyze") : t("static.browseSaved")}
            </p>
          </div>

          <div className="flex m-auto sm:m-0 gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("live")}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center ${
                activeTab === "live" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart fontSize="small" className="mr-2" />
              {t("static.liveReports")}
            </button>

            <button
              onClick={() => setActiveTab("archive")}
              className={`px-4 py-2 rounded-md font-medium transition-all flex items-center ${
                activeTab === "archive" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Description fontSize="small" className="mr-2" />
              {t('static.archive')} ({MOCK_GENERATED_REPORTS.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsHeader;
