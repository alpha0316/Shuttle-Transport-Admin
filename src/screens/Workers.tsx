import { HardHat } from '@phosphor-icons/react';
import TopHeader from './../components/TopHeader';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatCard, StatCardGroup } from '../components/StatCard';
import { MOCK_WORKER_DATA, MOCK_WORKER_COLUMNS, workerRowActions, MOCK_WORKER_KPIS, WORKER_FILTER_OPTIONS } from '../mockData/index';
import { useMemo, useState } from 'react';

function Workers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredData = useMemo(() => {
    let d = MOCK_WORKER_DATA;
    if (filter !== 'all') d = d.filter(r => r.status === filter);
    if (search) d = d.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.specialty.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search, filter]);

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<HardHat size={14} color="black" weight="duotone" />} title="Workers" pageKey="workers" />
      <div className="flex-1 overflow-y-auto p-6">
        <StatCardGroup>
          <StatCard label={MOCK_WORKER_KPIS.totalWorkers.label} value={MOCK_WORKER_KPIS.totalWorkers.value} sub={MOCK_WORKER_KPIS.totalWorkers.sub} />
          <StatCard label={MOCK_WORKER_KPIS.active.label} value={MOCK_WORKER_KPIS.active.value} sub={MOCK_WORKER_KPIS.active.sub} accent="text-green-700" />
          <StatCard label={MOCK_WORKER_KPIS.onLeave.label} value={MOCK_WORKER_KPIS.onLeave.value} sub={MOCK_WORKER_KPIS.onLeave.sub} accent="text-blue-600" />
          <StatCard label={MOCK_WORKER_KPIS.offline.label} value={MOCK_WORKER_KPIS.offline.value} sub={MOCK_WORKER_KPIS.offline.sub} accent="text-red-500" />
        </StatCardGroup>

        <div className="mt-6">
          <FilterBar
            searchPlaceholder="Search"
            onSearch={setSearch}
            filterLabel={WORKER_FILTER_OPTIONS.find(o => o.value === filter)?.label || 'All Workers'}
            filterOptions={WORKER_FILTER_OPTIONS}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <DataTable
            columns={MOCK_WORKER_COLUMNS}
            data={filteredData}
            rowKey={(r) => r.id}
            rowActions={workerRowActions}
            emptyMessage="No workers found."
          />
        </div>
      </div>
    </div>
  );
}

export default Workers;
