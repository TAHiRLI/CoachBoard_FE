// Tab Navigation Component
interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  tabs = [
    { id: "episodes", label: "Epizod Statistikası" },
    { id: "monthly", label: "Aylıq Trend", icon: <span className="inline mr-2">📅</span> },
  ],
}) => (
  <div className="bg-white rounded-xl shadow-lg mb-6 p-2">
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeTab === tab.id ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);
