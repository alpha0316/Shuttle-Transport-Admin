import { Bus } from '@phosphor-icons/react';
import TopHeader from '../components/TopHeader';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatCard, StatCardGroup } from '../components/StatCard';
import DetailPanel, { type DetailPanelEntity } from '../components/DetailPanel';
import { MOCK_VEHICLE_DATA, MOCK_VEHICLE_COLUMNS, vehicleRowActions, MOCK_VEHICLE_KPIS, VEHICLE_FILTER_OPTIONS, type VehicleRow } from '../mockData/index';
import { setPrefillVehicle, setPrefillDriver, triggerBookingForm, triggerExpenseForm } from '../lib/prefill';
import { useMemo, useState } from 'react';

const VEHICLE_STATUS_LABELS: Record<VehicleRow['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
  maintenance: 'Maintenance',
};

function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);

  const filteredData = useMemo(() => {
    let d = MOCK_VEHICLE_DATA;
    if (filter !== 'all') d = d.filter(r => r.status === filter);
    if (search) d = d.filter(r => r.plateNumber.toLowerCase().includes(search.toLowerCase()) || r.model.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search, filter]);

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<Bus size={14} color="black" weight="duotone" />} title="Vehicles" pageKey="Buses" />
      <div className="flex-1 overflow-y-auto p-6">
        <StatCardGroup>
          <StatCard label={MOCK_VEHICLE_KPIS.totalVehicles.label} value={MOCK_VEHICLE_KPIS.totalVehicles.value} sub={MOCK_VEHICLE_KPIS.totalVehicles.sub} />
          <StatCard label={MOCK_VEHICLE_KPIS.active.label} value={MOCK_VEHICLE_KPIS.active.value} sub={MOCK_VEHICLE_KPIS.active.sub} accent="text-green-700" />
          <StatCard label={MOCK_VEHICLE_KPIS.maintenance.label} value={MOCK_VEHICLE_KPIS.maintenance.value} sub={MOCK_VEHICLE_KPIS.maintenance.sub} accent="text-yellow-600" />
          <StatCard label={MOCK_VEHICLE_KPIS.inactive.label} value={MOCK_VEHICLE_KPIS.inactive.value} sub={MOCK_VEHICLE_KPIS.inactive.sub} accent="text-red-500" />
        </StatCardGroup>

        <div className="mt-6">
          <FilterBar
            searchPlaceholder="Search"
            onSearch={setSearch}
            filterLabel={VEHICLE_FILTER_OPTIONS.find(o => o.value === filter)?.label || 'All Vehicles'}
            filterOptions={VEHICLE_FILTER_OPTIONS}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <DataTable
            columns={MOCK_VEHICLE_COLUMNS}
            data={filteredData}
            rowKey={(r) => r.id}
            rowActions={vehicleRowActions}
            onRowClick={(r) => setSelectedVehicle(r)}
            emptyMessage="No vehicles found."
          />
        </div>
      </div>

      {selectedVehicle && (
        <DetailPanel
          entity={{
            title: selectedVehicle.model,
            vehiclePlate: selectedVehicle.plateNumber,
            driverName: selectedVehicle.assignedDriver ?? '',
            driverPhone: selectedVehicle.driverPhone ?? undefined,
            status: VEHICLE_STATUS_LABELS[selectedVehicle.status],
            timeCheckIn: '07:01AM',
            lastUpdated: '24/08/25, 17:30',
            details: [
              { label: 'Vehicle Number Plate', value: selectedVehicle.plateNumber },
              { label: 'Date Added', value: `15 Jan ${selectedVehicle.year}` },
              { label: 'Distance Covered', value: `${(selectedVehicle.capacity * 12 + (2026 - selectedVehicle.year) * 1500).toLocaleString()} km` },
              { label: 'Fuel Level', value: `${50 + (selectedVehicle.capacity % 45)}%` },
            ],
            detailsSecondary: [
              { label: 'Model', value: selectedVehicle.model },
              { label: 'Year', value: String(selectedVehicle.year) },
              { label: 'Capacity', value: `${selectedVehicle.capacity} seats` },
              { label: 'Route', value: selectedVehicle.route ?? 'Unassigned' },
            ],
            ctaLabel: 'Book Vehicle',
          } satisfies DetailPanelEntity}
          variant="vehicle"
          size="wide"
          onClose={() => setSelectedVehicle(null)}
          onBookVehicle={() => {
            setPrefillVehicle(selectedVehicle.plateNumber);
            setPrefillDriver(selectedVehicle.assignedDriver ?? null);
            triggerBookingForm();
          }}
          onLogExpense={() => {
            setPrefillVehicle(selectedVehicle.plateNumber);
            triggerExpenseForm();
          }}
        />
      )}
    </div>
  );
}

export default App;
