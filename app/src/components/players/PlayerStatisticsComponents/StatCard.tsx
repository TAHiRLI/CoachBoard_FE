// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient }) => (
  <div className={`${gradient} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm mb-1">{title}</p>
        <p className="text-4xl font-bold">{value}</p>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
  </div>
);
