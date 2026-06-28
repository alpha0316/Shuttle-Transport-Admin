import { Ticket } from '@phosphor-icons/react';
import TopHeader from '../components/TopHeader';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatCard, StatCardGroup } from '../components/StatCard';
import { MOCK_BOOKING_DATA, MOCK_BOOKING_COLUMNS, bookingRowActions, MOCK_BOOKING_KPIS, BOOKING_FILTER_OPTIONS } from '../mockData/index';
import { useMemo, useState } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredData = useMemo(() => {
    let d = MOCK_BOOKING_DATA;
    if (filter !== 'all') d = d.filter(r => r.status === filter);
    if (search) d = d.filter(r => r.passenger.toLowerCase().includes(search.toLowerCase()) || r.route.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search, filter]);

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<Ticket size={14} color="black" weight="duotone" />} title="Bookings" pageKey="bookings" />
      <div className="flex-1 overflow-y-auto p-6">
        <StatCardGroup>
          <StatCard label={MOCK_BOOKING_KPIS.totalBookings.label} value={MOCK_BOOKING_KPIS.totalBookings.value} sub={MOCK_BOOKING_KPIS.totalBookings.sub} />
          <StatCard label={MOCK_BOOKING_KPIS.confirmed.label} value={MOCK_BOOKING_KPIS.confirmed.value} sub={MOCK_BOOKING_KPIS.confirmed.sub} accent="text-green-700" />
          <StatCard label={MOCK_BOOKING_KPIS.pending.label} value={MOCK_BOOKING_KPIS.pending.value} sub={MOCK_BOOKING_KPIS.pending.sub} accent="text-yellow-600" />
          <StatCard label={MOCK_BOOKING_KPIS.cancelled.label} value={MOCK_BOOKING_KPIS.cancelled.value} sub={MOCK_BOOKING_KPIS.cancelled.sub} accent="text-red-500" />
        </StatCardGroup>

        <div className="mt-6">
          <FilterBar
            searchPlaceholder="Search"
            onSearch={setSearch}
            filterLabel={BOOKING_FILTER_OPTIONS.find(o => o.value === filter)?.label || 'All Bookings'}
            filterOptions={BOOKING_FILTER_OPTIONS}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <DataTable
            columns={MOCK_BOOKING_COLUMNS}
            data={filteredData}
            rowKey={(r) => r.id}
            rowActions={bookingRowActions}
            emptyMessage="No bookings found."
          />
        </div>
      </div>
    </div>
  );
}

export default App;
