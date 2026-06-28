import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  accentColor?: string;
  sublabel?: string;
}

interface KPIStatCardProps {
  stats: [Stat, Stat];
}

const KPIStatCard: React.FC<KPIStatCardProps> = ({ stats }) => {
  return (
    <div className="flex items-stretch rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex-1 px-4 py-3 ${index === 0 ? 'border-r border-black/10' : ''}`}
        >
          <p className="text-[10px] tracking-wide font-semibold text-gray-400 uppercase">{stat.label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className={`text-lg font-semibold ${stat.accentColor ?? 'text-gray-900'}`}>{stat.value}</p>
            {stat.sublabel && <p className="text-xs text-gray-400">{stat.sublabel}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIStatCard;
