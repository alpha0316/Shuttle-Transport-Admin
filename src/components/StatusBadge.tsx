import React from 'react';

export type Status = 'Active' | 'Inactive' | 'Suspended' | 'Pending' | 'Maintenance';

interface StatusBadgeProps {
  status: Status | string;
}

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-50 text-green-700 outline-green-200',
  Inactive: 'bg-gray-50 text-gray-700 outline-gray-200',
  Suspended: 'bg-red-50 text-red-700 outline-red-200',
  Pending: 'bg-amber-50 text-amber-700 outline-amber-200',
  Maintenance: 'bg-yellow-50 text-yellow-700 outline-yellow-200',
  Offline: 'bg-red-50 text-red-700 outline-red-200',
  Break: 'bg-amber-50 text-amber-700 outline-amber-200',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClasses = STATUS_COLORS[status] ?? STATUS_COLORS.Inactive;

  return (
    <div className={`pl-1.5 pr-2 py-0.5 rounded-2xl outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-1 ${colorClasses}`}>
      <div className="w-2 h-2 rounded-full bg-current" />
      <div className="text-center justify-start text-xs font-medium leading-none">{status}</div>
    </div>
  );
};

export default StatusBadge;
