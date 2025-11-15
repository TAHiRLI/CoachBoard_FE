import { useEffect, useState } from "react";

import LiveReportsTab from "@/components/reports/liveReportsTab";
import ReportsHeader from "@/components/reports/reportsHeader";
import SavedReportsTab from "@/components/reports/savedReportsTab";

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem("reportsTab") || "live";
  });
  console.log("🚀 ~ ReportsPage ~ activeTab:", activeTab)

  useEffect(() => {
    localStorage.setItem("reportsTab", activeTab);
  }, [activeTab]);

  return (
    <div>
      <ReportsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "live" && <LiveReportsTab />}
      {activeTab === "archive" && <SavedReportsTab />}
    </div>
  );
};

export default ReportsPage;
