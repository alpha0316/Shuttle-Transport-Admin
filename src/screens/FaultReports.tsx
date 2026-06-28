import { Warning } from '@phosphor-icons/react';
import TopHeader from './../components/TopHeader';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatCard, StatCardGroup } from '../components/StatCard';
import { MOCK_FAULT_REPORT_DATA, MOCK_FAULT_REPORT_COLUMNS, faultReportRowActions, FAULT_REPORT_FILTER_OPTIONS } from '../mockData/index';
import { useMemo, useState } from 'react';

function FaultReports() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredData = useMemo(() => {
    let d = MOCK_FAULT_REPORT_DATA;
    if (filter !== 'all') d = d.filter(r => r.status === filter);
    if (search) d = d.filter(r => r.vehicle.toLowerCase().includes(search.toLowerCase()) || r.driver.toLowerCase().includes(search.toLowerCase()) || r.damages.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search, filter]);

  const kpi = {
    total: MOCK_FAULT_REPORT_DATA.length,
    open: MOCK_FAULT_REPORT_DATA.filter(r => r.status === 'open').length,
    inProgress: MOCK_FAULT_REPORT_DATA.filter(r => r.status === 'in_progress').length,
    resolved: MOCK_FAULT_REPORT_DATA.filter(r => r.status === 'resolved').length,
  };

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<Warning size={14} color="black" weight="duotone" />} title="Fault & Accident Reports" pageKey="faults" />
      <div className="flex-1 overflow-y-auto p-6">
        <StatCardGroup>
          <StatCard label="TOTAL REPORTS" value={kpi.total} sub="Across all vehicles" />
          <StatCard label="OPEN" value={kpi.open} sub="Awaiting action" accent="text-red-500" />
          <StatCard label="IN PROGRESS" value={kpi.inProgress} sub="Being worked on" accent="text-yellow-600" />
          <StatCard label="RESOLVED" value={kpi.resolved} sub="Closed reports" accent="text-green-700" />
        </StatCardGroup>

        <div className="mt-6">
          <FilterBar
            searchPlaceholder="Search"
            onSearch={setSearch}
            filterLabel={FAULT_REPORT_FILTER_OPTIONS.find(o => o.value === filter)?.label || 'All Reports'}
            filterOptions={FAULT_REPORT_FILTER_OPTIONS}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <DataTable
            columns={MOCK_FAULT_REPORT_COLUMNS}
            data={filteredData}
            rowKey={(r) => r.id}
            rowActions={faultReportRowActions}
            emptyMessage="No reports found."
          />
        </div>
      </div>
    </div>
  );
}

export default FaultReports;
