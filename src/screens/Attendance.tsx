import { ClipboardText } from '@phosphor-icons/react';
import TopHeader from './../components/TopHeader';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatCard, StatCardGroup } from '../components/StatCard';
import { MOCK_ATTENDANCE_DATA, MOCK_ATTENDANCE_COLUMNS, attendanceRowActions, MOCK_ATTENDANCE_KPIS, ATTENDANCE_FILTER_OPTIONS } from '../mockData/index';
import { useMemo, useState } from 'react';

function Attendance() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredData = useMemo(() => {
    let d = MOCK_ATTENDANCE_DATA;
    if (filter !== 'all') d = d.filter(r => r.status === filter);
    if (search) d = d.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search, filter]);

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<ClipboardText size={14} color="black" weight="duotone" />} title="Attendance" pageKey="attendance" />
      <div className="flex-1 overflow-y-auto p-6">
        <StatCardGroup>
          <StatCard label={MOCK_ATTENDANCE_KPIS.totalWorkers.label} value={MOCK_ATTENDANCE_KPIS.totalWorkers.value} sub={MOCK_ATTENDANCE_KPIS.totalWorkers.sub} />
          <StatCard label={MOCK_ATTENDANCE_KPIS.present.label} value={MOCK_ATTENDANCE_KPIS.present.value} sub={MOCK_ATTENDANCE_KPIS.present.sub} accent="text-green-700" />
          <StatCard label={MOCK_ATTENDANCE_KPIS.late.label} value={MOCK_ATTENDANCE_KPIS.late.value} sub={MOCK_ATTENDANCE_KPIS.late.sub} accent="text-yellow-600" />
          <StatCard label={MOCK_ATTENDANCE_KPIS.absent.label} value={MOCK_ATTENDANCE_KPIS.absent.value} sub={MOCK_ATTENDANCE_KPIS.absent.sub} accent="text-red-500" />
        </StatCardGroup>

        <div className="mt-6">
          <FilterBar
            searchPlaceholder="Search"
            onSearch={setSearch}
            filterLabel={ATTENDANCE_FILTER_OPTIONS.find(o => o.value === filter)?.label || 'All Workers'}
            filterOptions={ATTENDANCE_FILTER_OPTIONS}
            activeFilter={filter}
            onFilterChange={setFilter}
            onDatePick={setDate}
            dateValue={date}
          />
          <DataTable
            columns={MOCK_ATTENDANCE_COLUMNS}
            data={filteredData}
            rowKey={(r) => r.id}
            rowActions={attendanceRowActions}
            emptyMessage="No attendance records found."
          />
        </div>
      </div>
    </div>
  );
}

export default Attendance;
