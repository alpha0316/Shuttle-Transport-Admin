import { Signpost } from '@phosphor-icons/react';
import TopHeader from './../components/TopHeader';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatCard, StatCardGroup } from '../components/StatCard';
import { MOCK_ROUTE_DATA, MOCK_ROUTE_COLUMNS, routeRowActions, MOCK_ROUTE_KPIS, ROUTE_FILTER_OPTIONS } from '../mockData/index';
import { useMemo, useState } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredData = useMemo(() => {
    let d = MOCK_ROUTE_DATA;
    if (filter !== 'all') d = d.filter(r => r.status === filter);
    if (search) d = d.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search, filter]);

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<Signpost size={14} color="black" weight="duotone" />} title="Shuttle Routes" pageKey="busstops" />
      <div className="flex-1 overflow-y-auto p-6">
        <StatCardGroup>
          <StatCard label={MOCK_ROUTE_KPIS.totalRoutes.label} value={MOCK_ROUTE_KPIS.totalRoutes.value} sub={MOCK_ROUTE_KPIS.totalRoutes.sub} />
          <StatCard label={MOCK_ROUTE_KPIS.activeRoutes.label} value={MOCK_ROUTE_KPIS.activeRoutes.value} sub={MOCK_ROUTE_KPIS.activeRoutes.sub} accent="text-green-700" />
          <StatCard label={MOCK_ROUTE_KPIS.totalBuses.label} value={MOCK_ROUTE_KPIS.totalBuses.value} sub={MOCK_ROUTE_KPIS.totalBuses.sub} />
          <StatCard label={MOCK_ROUTE_KPIS.dailyTrips.label} value={MOCK_ROUTE_KPIS.dailyTrips.value} sub={MOCK_ROUTE_KPIS.dailyTrips.sub} accent="text-blue-600" />
        </StatCardGroup>

        <div className="mt-6">
          <FilterBar
            searchPlaceholder="Search"
            onSearch={setSearch}
            filterLabel={ROUTE_FILTER_OPTIONS.find(o => o.value === filter)?.label || 'All Routes'}
            filterOptions={ROUTE_FILTER_OPTIONS}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <DataTable
            columns={MOCK_ROUTE_COLUMNS}
            data={filteredData}
            rowKey={(r) => r.id}
            rowActions={routeRowActions}
            emptyMessage="No routes found."
          />
        </div>
      </div>
    </div>
  );
}

export default App;
