import { User, Plus } from '@phosphor-icons/react';
import TopHeader from './../components/TopHeader';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatCard, StatCardGroup } from '../components/StatCard';
import { Icon } from '../components/Icon';
import DetailPanel, { type DetailPanelEntity } from '../components/DetailPanel';
import { AssignShuttleModal } from '../components/AssignShuttleModal';
import { AddDriverForm } from '../components/AddDriverForm';
import { MOCK_DRIVER_DATA, MOCK_DRIVER_COLUMNS, MOCK_DRIVER_KPIS, DRIVER_FILTER_OPTIONS, type DriverRow } from '../mockData/index';
import { triggerBookingForm } from '../lib/prefill';
import { useMemo, useState } from 'react';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface DriverBooking {
  id: string; month: string; date: number; name: string; destination: string; duration: string; amount: string; status: 'confirmed' | 'completed';
}

const DRIVER_BOOKINGS: Record<string, DriverBooking[]> = {
  'DRV-001': [
    { id: 'B-01', month: 'June', date: 7, name: 'KNUST Main Campus', destination: 'KSB', duration: '18 min', amount: '₵180', status: 'confirmed' },
    { id: 'B-02', month: 'June', date: 8, name: 'College of Science', destination: 'Commercial', duration: '24 min', amount: '₵240', status: 'confirmed' },
    { id: 'B-03', month: 'June', date: 10, name: 'Engineering Dept.', destination: 'KSB', duration: '15 min', amount: '₵150', status: 'completed' },
  ],
  'DRV-002': [
    { id: 'B-04', month: 'June', date: 7, name: 'College of Science', destination: 'Commercial', duration: '24 min', amount: '₵240', status: 'completed' },
    { id: 'B-05', month: 'June', date: 9, name: 'Medical School', destination: 'Pharmacy', duration: '12 min', amount: '₵120', status: 'confirmed' },
  ],
  'DRV-004': [
    { id: 'B-06', month: 'June', date: 8, name: 'Faculty of Law', destination: 'Conti', duration: '10 min', amount: '₵100', status: 'confirmed' },
    { id: 'B-07', month: 'June', date: 11, name: 'Sports Complex', destination: 'Conti', duration: '10 min', amount: '₵100', status: 'completed' },
    { id: 'B-08', month: 'June', date: 12, name: 'Science Faculty', destination: 'Main Library', duration: '14 min', amount: '₵140', status: 'confirmed' },
  ],
  'DRV-006': [
    { id: 'B-09', month: 'June', date: 9, name: 'Medical School', destination: 'Pharmacy', duration: '12 min', amount: '₵120', status: 'confirmed' },
    { id: 'B-10', month: 'June', date: 10, name: 'Pentecost Parish', destination: 'KSB', duration: '16 min', amount: '₵160', status: 'completed' },
  ],
};

function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState<DriverRow | null>(null);
  const [selectedBookingDay, setSelectedBookingDay] = useState(7);
  const [showSchedules, setShowSchedules] = useState(false);
  const [assignShuttleDriver, setAssignShuttleDriver] = useState<DriverRow | null>(null);
  const [editDriver, setEditDriver] = useState<DriverRow | null>(null);
  const [removedDriverIds, setRemovedDriverIds] = useState<Set<string>>(new Set());

  const filteredData = useMemo(() => {
    let d = MOCK_DRIVER_DATA.filter(r => !removedDriverIds.has(r.id));
    if (filter !== 'all') d = d.filter(r => r.status === filter);
    if (search) d = d.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search, filter, removedDriverIds]);

  const getRowActions = (row: DriverRow) => [
    { label: 'Edit Driver', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => setEditDriver(row) },
    { label: 'Assign Shuttle', icon: <Icon name="refresh" size={14} color="#555" />, onClick: () => setAssignShuttleDriver(row) },
    { label: 'View Profile', icon: <Icon name="view" size={14} color="#555" />, onClick: () => setSelectedDriver(row) },
    { label: 'Remove Driver', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => setRemovedDriverIds(prev => new Set(prev).add(row.id)) },
  ];

  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) dates.push(i + 1);
    return dates;
  }, []);

  const allBookings = useMemo(() => {
    if (!showSchedules) return [];
    const all: (DriverBooking & { driverId: string; driverName: string })[] = [];
    Object.entries(DRIVER_BOOKINGS).forEach(([driverId, bookings]) => {
      const driver = MOCK_DRIVER_DATA.find(d => d.id === driverId);
      if (!driver) return;
      bookings
        .filter(b => b.date === selectedBookingDay)
        .forEach(b => all.push({ ...b, driverId, driverName: driver.name }));
    });
    return all.sort((a, b) => a.driverName.localeCompare(b.driverName));
  }, [selectedBookingDay, showSchedules]);

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<User size={14} color="black" weight="duotone" />} title="Drivers" pageKey="drivers" />
      <div className="flex-1 overflow-y-auto p-6">
        <StatCardGroup>
          <StatCard label={MOCK_DRIVER_KPIS.totalDrivers.label} value={MOCK_DRIVER_KPIS.totalDrivers.value} sub={MOCK_DRIVER_KPIS.totalDrivers.sub} />
          <StatCard label={MOCK_DRIVER_KPIS.activeDrivers.label} value={MOCK_DRIVER_KPIS.activeDrivers.value} sub={MOCK_DRIVER_KPIS.activeDrivers.sub} accent="text-green-700" />
          <StatCard label={MOCK_DRIVER_KPIS.onBreak.label} value={MOCK_DRIVER_KPIS.onBreak.value} sub={MOCK_DRIVER_KPIS.onBreak.sub} accent="text-yellow-600" />
          <StatCard label={MOCK_DRIVER_KPIS.offline.label} value={MOCK_DRIVER_KPIS.offline.value} sub={MOCK_DRIVER_KPIS.offline.sub} accent="text-red-500" />
        </StatCardGroup>

        <div className="mt-6">
          <FilterBar
            searchPlaceholder="Search"
            onSearch={setSearch}
            filterLabel={DRIVER_FILTER_OPTIONS.find(o => o.value === filter)?.label || 'All Drivers'}
            filterOptions={DRIVER_FILTER_OPTIONS}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <DataTable
            columns={MOCK_DRIVER_COLUMNS}
            data={filteredData}
            rowKey={(r) => r.id}
            rowActions={getRowActions}
            onRowClick={(r) => { setSelectedDriver(r); setShowSchedules(true); }}
            emptyMessage="No drivers found."
          />
        </div>

        {/* Booking schedules section */}
        {showSchedules && (
          <div className="mt-8 bg-white rounded-2xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-black text-base font-bold">Booking Schedules</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { triggerBookingForm(); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f5] rounded-lg text-black/60 text-xs font-medium hover:bg-neutral-200 transition-colors">
                  <Plus size={14} /> Add Schedule
                </button>
                <button onClick={() => setShowSchedules(false)} className="text-black/40 text-sm hover:text-black/60">Collapse</button>
              </div>
            </div>

            {/* Week strip */}
            <div className="flex bg-neutral-50 rounded-2xl border border-black/5 mb-6">
              {weekDates.map((d, i) => {
                const count = Object.values(DRIVER_BOOKINGS).flat().filter(b => b.date === d).length;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedBookingDay(d)}
                    className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${selectedBookingDay === d ? 'bg-white rounded-2xl shadow-sm' : 'hover:bg-white/50'}`}
                  >
                    <span className="text-black/80 text-xs font-medium">{WEEKDAYS[i]}</span>
                    <span className={`text-sm font-semibold ${d === 7 ? 'text-pink-600' : 'text-black'}`}>{d}</span>
                    {d === 7 ? <span className="w-1.5 h-1.5 rounded-full bg-pink-600" /> : count > 0 && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                  </button>
                );
              })}
            </div>

            {/* Bookings */}
            <div className="flex flex-col gap-2">
              {allBookings.length === 0 ? (
                <p className="text-sm text-black/40 text-center py-6">No bookings for {selectedBookingDay}th June</p>
              ) : (
                allBookings.map((b) => (
                  <div key={b.id} className="group flex items-center gap-3 bg-white rounded-2xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] outline-1 outline-offset-[-1px] outline-black/5 p-3 hover:bg-neutral-50/50 transition-colors">
                    <div className="w-12 h-14 rounded-[10px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] overflow-hidden shrink-0">
                      <div className="bg-green-600 px-1.5 pt-1 pb-1 flex justify-center items-center rounded-t-[10px]">
                        <span className="text-white text-[10px] font-medium">{b.month}</span>
                      </div>
                      <div className="flex-1 bg-white flex justify-center items-center rounded-b-[10px] py-0.5">
                        <span className="text-black/70 text-base font-bold">{b.date}</span>
                      </div>
                    </div>
                    <div className="w-px h-14 bg-black/10" />
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="text-black text-sm font-medium">{b.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-black/50 text-xs">{b.destination}</span>
                        <span className="w-[3px] h-[3px] bg-zinc-300 rounded-full" />
                        <span className="text-black/40 text-xs">{b.duration}</span>
                        <span className="w-[3px] h-[3px] bg-zinc-300 rounded-full" />
                        <span className="text-black/40 text-xs">{b.driverName}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${b.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                      {b.status === 'completed' ? 'Done' : 'Confirmed'}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-black text-sm font-semibold shrink-0">{b.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedDriver && (
        <DetailPanel
          entity={{
            title: selectedDriver.name,
            driverName: selectedDriver.name,
            driverId: selectedDriver.id,
            status: selectedDriver.status === 'active' ? 'Active' : selectedDriver.status === 'offline' ? 'Offline' : 'On Break',
            timeCheckIn: '07:01AM',
            details: [
              { label: 'Phone', value: selectedDriver.phone },
              { label: 'License', value: selectedDriver.license },
              { label: 'Assigned Vehicle', value: selectedDriver.assignedVehicleName ?? 'Unassigned' },
              { label: 'Route', value: selectedDriver.route },
              { label: 'Experience', value: selectedDriver.experience },
              { label: 'Rating', value: `${selectedDriver.rating} / 5` },
            ],
          } satisfies DetailPanelEntity}
          variant="driver"
          onClose={() => setSelectedDriver(null)}
          onEdit={() => { const d = selectedDriver; setSelectedDriver(null); setTimeout(() => setEditDriver(d), 100); }}
          onAssign={() => { const d = selectedDriver; setSelectedDriver(null); setTimeout(() => setAssignShuttleDriver(d), 100); }}
          onDelete={() => { setRemovedDriverIds(prev => new Set(prev).add(selectedDriver.id)); setSelectedDriver(null); }}
        />
      )}

      <AssignShuttleModal
        open={!!assignShuttleDriver}
        onClose={() => setAssignShuttleDriver(null)}
        currentVehicle={assignShuttleDriver?.assignedVehicle || null}
        onAssign={(plate) => {
          if (assignShuttleDriver) { assignShuttleDriver.assignedVehicle = plate; }
          console.log('Assigned', plate, 'to', assignShuttleDriver?.name);
        }}
      />
      <AddDriverForm open={!!editDriver} onClose={() => setEditDriver(null)} driver={editDriver} />
    </div>
  );
}

export default App;
