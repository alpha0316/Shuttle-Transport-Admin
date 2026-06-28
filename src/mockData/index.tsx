import type { Column } from '../components/DataTable';
import type { DropdownMenuItem } from '../components/DropdownMenu';
import { Icon } from '../components/Icon';

const HeaderIcon = ({ name, color = '#888' }: { name: string; color?: string }) => (
  <Icon name={name} size={16} color={color} />
);

// ============================================================
// TYPES
// ============================================================

export interface DriverRow {
  id: string;
  name: string;
  phone: string;
  license: string;
  status: 'active' | 'offline' | 'on_break';
  assignedVehicle: string | null;
  assignedVehicleName: string | null;
  route: string;
  experience: string;
  rating: number;
}

export interface VehicleRow {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  assignedDriver: string | null;
  driverPhone: string | null;
  route: string | null;
}

export interface RouteRow {
  id: string;
  name: string;
  stops: number;
  distance: string;
  duration: string;
  status: 'active' | 'inactive';
  assignedBuses: number;
  peakHours: string;
  dailyTrips: number;
}

// ============================================================
// AVATAR
// ============================================================

const avatarColors = [
  'bg-green-100 text-green-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
];

function getAvatarColor(name: string) {
  return avatarColors[name.length % avatarColors.length];
}

// ============================================================
// MOCK DATA — Drivers
// ============================================================

export const MOCK_DRIVER_DATA: DriverRow[] = [
  { id: 'DRV-001', name: 'Kwame Mensah', phone: '0244-123-456', license: 'DL-2018-0042', status: 'active', assignedVehicle: 'AS-1234-26', assignedVehicleName: 'Mercedes-Benz Sprinter', route: 'Brunei → KSB', experience: '7 years', rating: 4.8 },
  { id: 'DRV-002', name: 'Ama Asante', phone: '0244-234-567', license: 'DL-2019-0156', status: 'active', assignedVehicle: 'AS-5678-26', assignedVehicleName: 'Toyota Coaster', route: 'Commercial → KSB', experience: '5 years', rating: 4.6 },
  { id: 'DRV-003', name: 'Kofi Owusu', phone: '0244-345-678', license: 'DL-2020-0089', status: 'offline', assignedVehicle: null, assignedVehicleName: null, route: 'Unassigned', experience: '3 years', rating: 4.2 },
  { id: 'DRV-004', name: 'Yaa Boateng', phone: '0244-456-789', license: 'DL-2017-0234', status: 'active', assignedVehicle: 'AS-3456-26', assignedVehicleName: 'Nissan Civilian', route: 'Brunei → KSB', experience: '8 years', rating: 4.9 },
  { id: 'DRV-005', name: 'Kwesi Adomako', phone: '0244-567-890', license: 'DL-2021-0012', status: 'on_break', assignedVehicle: 'AS-7890-26', assignedVehicleName: 'Hyundai County', route: 'Commercial → KSB', experience: '2 years', rating: 4.0 },
  { id: 'DRV-006', name: 'Akosua Manu', phone: '0244-678-901', license: 'DL-2016-0456', status: 'active', assignedVehicle: 'AS-2468-26', assignedVehicleName: 'Isuzu Journey', route: 'Gaza → Pharmacy', experience: '10 years', rating: 5.0 },
  { id: 'DRV-007', name: 'Emmanuel Tetteh', phone: '0244-789-012', license: 'DL-2022-0078', status: 'active', assignedVehicle: 'AS-1357-26', assignedVehicleName: 'Mitsubishi Rosa', route: 'Brunei → KSB', experience: '1 year', rating: 3.8 },
  { id: 'DRV-008', name: 'Abena Serwaa', phone: '0244-890-123', license: 'DL-2019-0345', status: 'offline', assignedVehicle: null, assignedVehicleName: null, route: 'Unassigned', experience: '4 years', rating: 4.3 },
  { id: 'DRV-009', name: 'Daniel Asare', phone: '0244-901-234', license: 'DL-2020-0567', status: 'active', assignedVehicle: 'AS-9012-26', assignedVehicleName: 'Ford Transit', route: 'Commercial → KSB', experience: '6 years', rating: 4.5 },
  { id: 'DRV-010', name: 'Grace Osei', phone: '0244-012-345', license: 'DL-2018-0789', status: 'on_break', assignedVehicle: 'AS-5432-26', assignedVehicleName: 'Volkswagen Transporter', route: 'Gaza → Pharmacy', experience: '5 years', rating: 4.4 },
  { id: 'DRV-011', name: 'Michael Adjei', phone: '0244-111-222', license: 'DL-2021-0901', status: 'active', assignedVehicle: 'AS-6789-26', assignedVehicleName: 'Fiat Ducato', route: 'Brunei → KSB', experience: '2 years', rating: 3.9 },
  { id: 'DRV-012', name: 'Patricia Amoah', phone: '0244-333-444', license: 'DL-2017-0123', status: 'offline', assignedVehicle: null, assignedVehicleName: null, route: 'Unassigned', experience: '9 years', rating: 4.7 },
];

export const MOCK_DRIVER_COLUMNS: Column<DriverRow>[] = [
  {
    key: 'name',
    label: 'Driver',
    icon: <HeaderIcon name="user" />,
    width: '30%',
    align: 'left',
    primaryKey: true,
    render: (r) => {
      const initial = r.name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className={'w-[32px] h-[32px] shrink-0 rounded-full flex items-center justify-center text-[14px] font-bold ' + getAvatarColor(r.name)}>
            {initial}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.name}</span>
            <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.phone}</span>
          </div>
        </div>
      );
    },
  },
  { key: 'status', label: 'Status', width: '15%', icon: <HeaderIcon name="check-circle" />, align: 'left', render: (r) => {
    const c: { [k: string]: string } = { active: 'bg-green-50 text-green-700 border-green-200', offline: 'bg-red-50 text-red-700 border-red-200', on_break: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    const l: { [k: string]: string } = { active: 'Active', offline: 'Offline', on_break: 'On Break' };
    return <span className={'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ' + c[r.status]}><span className="w-1.5 h-1.5 rounded-full bg-current" />{l[r.status]}</span>;
  }},
  { key: 'assignedVehicle', label: 'Vehicle', width: '25%', icon: <HeaderIcon name="bus" />, align: 'left', render: (r) => {
    if (!r.assignedVehicle) return <span className="text-[#555]">—</span>;
    return (
      <div className="flex items-center gap-3">
        <div className="w-[32px] h-[32px] shrink-0 rounded-lg bg-green-100 flex items-center justify-center">
          <Icon name="bus" size={18} color="#16a34a" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.assignedVehicleName || r.assignedVehicle}</span>
          <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.assignedVehicle}</span>
        </div>
      </div>
    );
  }},
  { key: 'route', label: 'Route', width: '20%', icon: <HeaderIcon name="map-pin" />, align: 'left', render: (r) => <span className="text-[#555]">{r.route}</span> },
];

export function driverRowActions(row: DriverRow): DropdownMenuItem[] {
  return [
    { label: 'View Profile', icon: <Icon name="view" size={14} color="#555" />, onClick: () => console.log('View:', row.id) },
    { label: 'Edit Driver', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => console.log('Edit:', row.id) },
    { label: 'Reassign Vehicle', icon: <Icon name="refresh" size={14} color="#555" />, onClick: () => console.log('Reassign:', row.id) },
    { label: 'Remove Driver', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => console.log('Remove:', row.id) },
  ];
}

// ============================================================
// MOCK DATA — Vehicles
// ============================================================

export const MOCK_VEHICLE_DATA: VehicleRow[] = [
  { id: 'VEH-001', plateNumber: 'AS-1234-26', model: 'Mercedes-Benz Sprinter', year: 2022, capacity: 40, status: 'active', assignedDriver: 'Kwame Mensah', driverPhone: '0244-123-456', route: 'Brunei → KSB' },
  { id: 'VEH-002', plateNumber: 'AS-5678-26', model: 'Toyota Coaster', year: 2021, capacity: 40, status: 'active', assignedDriver: 'Ama Asante', driverPhone: '0244-234-567', route: 'Commercial → KSB' },
  { id: 'VEH-003', plateNumber: 'AS-9012-26', model: 'Ford Transit', year: 2020, capacity: 30, status: 'maintenance', assignedDriver: null, driverPhone: null, route: null },
  { id: 'VEH-004', plateNumber: 'AS-3456-26', model: 'Nissan Civilian', year: 2022, capacity: 36, status: 'active', assignedDriver: 'Yaa Boateng', driverPhone: '0244-456-789', route: 'Brunei → KSB' },
  { id: 'VEH-005', plateNumber: 'AS-7890-26', model: 'Hyundai County', year: 2021, capacity: 35, status: 'inactive', assignedDriver: null, driverPhone: null, route: null },
  { id: 'VEH-006', plateNumber: 'AS-2468-26', model: 'Isuzu Journey', year: 2023, capacity: 42, status: 'active', assignedDriver: 'Akosua Manu', driverPhone: '0244-678-901', route: 'Gaza → Pharmacy' },
  { id: 'VEH-007', plateNumber: 'AS-1357-26', model: 'Mitsubishi Rosa', year: 2022, capacity: 38, status: 'active', assignedDriver: 'Emmanuel Tetteh', driverPhone: '0244-789-012', route: 'Brunei → KSB' },
  { id: 'VEH-008', plateNumber: 'AS-5432-26', model: 'Volkswagen Transporter', year: 2020, capacity: 28, status: 'active', assignedDriver: 'Grace Osei', driverPhone: '0244-012-345', route: 'Gaza → Pharmacy' },
  { id: 'VEH-009', plateNumber: 'AS-6789-26', model: 'Fiat Ducato', year: 2023, capacity: 32, status: 'active', assignedDriver: 'Michael Adjei', driverPhone: '0244-111-222', route: 'Brunei → KSB' },
  { id: 'VEH-010', plateNumber: 'AS-4321-26', model: 'Iveco Daily', year: 2019, capacity: 45, status: 'maintenance', assignedDriver: null, driverPhone: null, route: null },
  { id: 'VEH-011', plateNumber: 'AS-1111-26', model: 'Mercedes-Benz Sprinter', year: 2024, capacity: 40, status: 'active', assignedDriver: null, driverPhone: null, route: 'Commercial → KSB' },
  { id: 'VEH-012', plateNumber: 'AS-2222-26', model: 'Toyota Coaster', year: 2020, capacity: 40, status: 'inactive', assignedDriver: null, driverPhone: null, route: null },
];

export const MOCK_VEHICLE_COLUMNS: Column<VehicleRow>[] = [
  {
    key: 'vehicle',
    label: 'Vehicle',
    icon: <HeaderIcon name="bus" />,
    width: '30%',
    align: 'left',
    primaryKey: true,
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-[32px] h-[32px] shrink-0 rounded-lg bg-green-100 flex items-center justify-center">
          <Icon name="bus" size={18} color="#16a34a" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.model}</span>
          <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.plateNumber}</span>
        </div>
      </div>
    ),
  },
  { key: 'status', label: 'Status', width: '20%', icon: <HeaderIcon name="check-circle" />, align: 'left', render: (r) => {
    const c: { [k: string]: string } = { active: 'bg-green-50 text-green-700 border-green-200', inactive: 'bg-gray-50 text-gray-600 border-gray-200', maintenance: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    const l: { [k: string]: string } = { active: 'Active', inactive: 'Inactive', maintenance: 'Maintenance' };
    return <span className={'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ' + c[r.status]}><span className="w-1.5 h-1.5 rounded-full bg-current" />{l[r.status]}</span>;
  }},
  {
    key: 'driver',
    label: 'Driver',
    icon: <HeaderIcon name="user" />,
    width: '30%',
    align: 'left',
    render: (r) => {
      if (!r.assignedDriver) return <span className="text-[#555]">—</span>;
      const initial = r.assignedDriver.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className={'w-[32px] h-[32px] shrink-0 rounded-full flex items-center justify-center text-[14px] font-bold ' + getAvatarColor(r.assignedDriver)}>
            {initial}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.assignedDriver}</span>
            {r.driverPhone && <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.driverPhone}</span>}
          </div>
        </div>
      );
    },
  },
  { key: 'route', label: 'Route', width: '20%', icon: <HeaderIcon name="map-pin" />, align: 'left', render: (r) => <span className="text-[#555]">{r.route ?? '—'}</span> },
];

export function vehicleRowActions(row: VehicleRow): DropdownMenuItem[] {
  return [
    { label: 'View Details', icon: <Icon name="view" size={14} color="#555" />, onClick: () => console.log('View:', row.id) },
    { label: 'Edit Vehicle', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => console.log('Edit:', row.id) },
    { label: 'Service History', icon: <Icon name="wrench" size={14} color="#555" />, onClick: () => console.log('Service:', row.id) },
    { label: 'Remove Vehicle', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => console.log('Remove:', row.id) },
  ];
}

// ============================================================
// MOCK DATA — Routes
// ============================================================

export const MOCK_ROUTE_DATA: RouteRow[] = [
  { id: 'RTE-001', name: 'Brunei → KSB', stops: 5, distance: '4.2 km', duration: '18 min', status: 'active', assignedBuses: 4, peakHours: '7–9 AM, 3–5 PM', dailyTrips: 48 },
  { id: 'RTE-002', name: 'Commercial → KSB', stops: 4, distance: '5.8 km', duration: '24 min', status: 'active', assignedBuses: 3, peakHours: '7–9 AM, 4–6 PM', dailyTrips: 36 },
  { id: 'RTE-003', name: 'Gaza → Pharmacy', stops: 3, distance: '3.1 km', duration: '12 min', status: 'active', assignedBuses: 2, peakHours: '8–10 AM', dailyTrips: 24 },
  { id: 'RTE-004', name: 'Main Library Circuit', stops: 6, distance: '6.5 km', duration: '28 min', status: 'active', assignedBuses: 2, peakHours: 'All day', dailyTrips: 30 },
  { id: 'RTE-005', name: 'Hall 7 Express', stops: 2, distance: '1.8 km', duration: '7 min', status: 'inactive', assignedBuses: 0, peakHours: '—', dailyTrips: 0 },
  { id: 'RTE-006', name: 'Pentecost Loop', stops: 4, distance: '3.9 km', duration: '15 min', status: 'active', assignedBuses: 1, peakHours: '7–8 AM, 2–3 PM', dailyTrips: 16 },
  { id: 'RTE-007', name: 'SRC → Conti', stops: 3, distance: '2.4 km', duration: '10 min', status: 'inactive', assignedBuses: 0, peakHours: '—', dailyTrips: 0 },
  { id: 'RTE-008', name: 'Medical Village Shuttle', stops: 2, distance: '7.1 km', duration: '30 min', status: 'active', assignedBuses: 1, peakHours: '6–8 AM, 5–7 PM', dailyTrips: 12 },
];

export const MOCK_ROUTE_COLUMNS: Column<RouteRow>[] = [
  { key: 'name', label: 'Route Name', width: '22%', icon: <HeaderIcon name="map-pin" />, align: 'left', primaryKey: true, render: (r) => <span className="font-semibold text-[#111]">{r.name}</span> },
  { key: 'stops', label: 'Stops', width: '10%', icon: <HeaderIcon name="bus" />, align: 'left', render: (r) => <span className="text-[#555]">{r.stops}</span> },
  { key: 'duration', label: 'Duration', width: '14%', icon: <HeaderIcon name="bell" />, align: 'left', render: (r) => <span className="text-[#555]">{r.duration}</span> },
  { key: 'status', label: 'Status', width: '16%', icon: <HeaderIcon name="check-circle" />, align: 'left', render: (r) => {
    const c: { [k: string]: string } = { active: 'bg-green-50 text-green-700 border-green-200', inactive: 'bg-gray-50 text-gray-600 border-gray-200' };
    return <span className={'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ' + c[r.status]}><span className="w-1.5 h-1.5 rounded-full bg-current" />{r.status === 'active' ? 'Active' : 'Inactive'}</span>;
  }},
  { key: 'assignedBuses', label: 'Buses', width: '12%', icon: <HeaderIcon name="bus" />, align: 'left', render: (r) => <span className="text-[#555]">{r.assignedBuses}</span> },
  { key: 'dailyTrips', label: 'Daily Trips', width: '14%', icon: <HeaderIcon name="refresh" />, align: 'left', render: (r) => <span className="text-[#555]">{r.dailyTrips}</span> },
];

export function routeRowActions(row: RouteRow): DropdownMenuItem[] {
  return [
    { label: 'View on Map', icon: <Icon name="map-pin" size={14} color="#555" />, onClick: () => console.log('Map:', row.id) },
    { label: 'Edit Route', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => console.log('Edit:', row.id) },
    { label: 'View Schedule', icon: <Icon name="view" size={14} color="#555" />, onClick: () => console.log('Schedule:', row.id) },
    { label: 'Remove Route', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => console.log('Remove:', row.id) },
  ];
}

// ============================================================
// MOCK DATA — Workers (Maintenance Crew)
// ============================================================

export interface WorkerRow {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: 'active' | 'offline' | 'on_leave';
  specialty: string;
  assignedVehicle: string | null;
  experience: string;
}

export const MOCK_WORKER_DATA: WorkerRow[] = [
  { id: 'WRK-001', name: 'Oppong Mensah', phone: '0244-222-333', role: 'Lead Mechanic', status: 'active', specialty: 'Engine Repair', assignedVehicle: 'AS-1234-26', experience: '12 years' },
  { id: 'WRK-002', name: 'Isaac Boateng', phone: '0244-444-555', role: 'Technician', status: 'active', specialty: 'Electrical Systems', assignedVehicle: 'AS-5678-26', experience: '6 years' },
  { id: 'WRK-003', name: 'Abena Serwaa', phone: '0244-333-444', role: 'Technician', status: 'on_leave', specialty: 'Body Work', assignedVehicle: null, experience: '4 years' },
  { id: 'WRK-004', name: 'Patrick Amankwah', phone: '0244-777-888', role: 'Welder', status: 'active', specialty: 'Welding & Fabrication', assignedVehicle: 'AS-3456-26', experience: '8 years' },
  { id: 'WRK-005', name: 'Ernestina Frimpong', phone: '0244-666-777', role: 'Electrician', status: 'active', specialty: 'Automotive Wiring', assignedVehicle: 'AS-2468-26', experience: '5 years' },
  { id: 'WRK-006', name: 'Comfort Addo', phone: '0244-555-666', role: 'Technician', status: 'offline', specialty: 'Tire & Alignment', assignedVehicle: null, experience: '3 years' },
  { id: 'WRK-007', name: 'Michael Asiamah', phone: '0244-888-999', role: 'Apprentice', status: 'active', specialty: 'General Maintenance', assignedVehicle: 'AS-1357-26', experience: '1 year' },
  { id: 'WRK-008', name: 'Samuel Ofori', phone: '0244-999-000', role: 'Technician', status: 'active', specialty: 'Brake Systems', assignedVehicle: 'AS-9012-26', experience: '7 years' },
];

export const MOCK_WORKER_COLUMNS: Column<WorkerRow>[] = [
  { key: 'name', label: 'Worker', icon: <HeaderIcon name="user" />, width: '25%', align: 'left', primaryKey: true, render: (r) => {
    const initial = r.name.charAt(0).toUpperCase();
    return (
      <div className="flex items-center gap-3">
        <div className={'w-[32px] h-[32px] shrink-0 rounded-full flex items-center justify-center text-[14px] font-bold ' + getAvatarColor(r.name)}>{initial}</div>
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.name}</span>
          <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.phone}</span>
        </div>
      </div>
    );
  }},
  { key: 'role', label: 'Role', icon: <HeaderIcon name="gear" />, width: '15%', align: 'left', render: (r) => <span className="text-[#555]">{r.role}</span> },
  { key: 'specialty', label: 'Specialty', icon: <HeaderIcon name="wrench" />, width: '20%', align: 'left', render: (r) => <span className="text-[#555]">{r.specialty}</span> },
  { key: 'status', label: 'Status', icon: <HeaderIcon name="check-circle" />, width: '15%', align: 'left', render: (r) => {
    const c: { [k: string]: string } = { active: 'bg-green-50 text-green-700 border-green-200', offline: 'bg-red-50 text-red-700 border-red-200', on_leave: 'bg-blue-50 text-blue-700 border-blue-200' };
    const l: { [k: string]: string } = { active: 'Active', offline: 'Offline', on_leave: 'On Leave' };
    return <span className={'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ' + c[r.status]}><span className="w-1.5 h-1.5 rounded-full bg-current" />{l[r.status]}</span>;
  }},
  { key: 'assignedVehicle', label: 'Vehicle', icon: <HeaderIcon name="bus" />, width: '15%', align: 'left', render: (r) => <span className="text-[#555]">{r.assignedVehicle ?? '—'}</span> },
];

export function workerRowActions(row: WorkerRow): DropdownMenuItem[] {
  return [
    { label: 'View Profile', icon: <Icon name="view" size={14} color="#555" />, onClick: () => console.log('View:', row.id) },
    { label: 'Edit Worker', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => console.log('Edit:', row.id) },
    { label: 'Assign Vehicle', icon: <Icon name="refresh" size={14} color="#555" />, onClick: () => console.log('Assign:', row.id) },
    { label: 'Remove Worker', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => console.log('Remove:', row.id) },
  ];
}

export const WORKER_FILTER_OPTIONS = [
  { label: 'All Workers', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Offline', value: 'offline' },
  { label: 'On Leave', value: 'on_leave' },
];

// ============================================================
// FILTER OPTIONS
// ============================================================

export const DRIVER_FILTER_OPTIONS = [
  { label: 'All Drivers', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Offline', value: 'offline' },
  { label: 'On Break', value: 'on_break' },
];

export const VEHICLE_FILTER_OPTIONS = [
  { label: 'All Vehicles', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Maintenance', value: 'maintenance' },
];

export const ROUTE_FILTER_OPTIONS = [
  { label: 'All Routes', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

// ============================================================
// MOCK DATA — Attendance
// ============================================================

export interface AttendanceRow {
  id: string;
  name: string;
  phone: string;
  department: string;
  timeIn: string;
  timeOut: string | null;
  status: 'present' | 'absent' | 'late' | 'on_leave';
}

export const MOCK_ATTENDANCE_DATA: AttendanceRow[] = [
  { id: 'ATT-001', name: 'Kwame Mensah', phone: '0244-123-456', department: 'Driver', timeIn: '06:45 AM', timeOut: '05:30 PM', status: 'present' },
  { id: 'ATT-002', name: 'Ama Asante', phone: '0244-234-567', department: 'Driver', timeIn: '07:02 AM', timeOut: '04:45 PM', status: 'present' },
  { id: 'ATT-003', name: 'Kofi Owusu', phone: '0244-345-678', department: 'Driver', timeIn: '—', timeOut: '—', status: 'absent' },
  { id: 'ATT-004', name: 'Yaa Boateng', phone: '0244-456-789', department: 'Driver', timeIn: '06:50 AM', timeOut: '05:15 PM', status: 'present' },
  { id: 'ATT-005', name: 'Kwesi Adomako', phone: '0244-567-890', department: 'Driver', timeIn: '07:45 AM', timeOut: null, status: 'late' },
  { id: 'ATT-006', name: 'Akosua Manu', phone: '0244-678-901', department: 'Driver', timeIn: '06:30 AM', timeOut: '05:00 PM', status: 'present' },
  { id: 'ATT-007', name: 'Emmanuel Tetteh', phone: '0244-789-012', department: 'Driver', timeIn: '—', timeOut: '—', status: 'absent' },
  { id: 'ATT-008', name: 'Daniel Asare', phone: '0244-901-234', department: 'Driver', timeIn: '07:10 AM', timeOut: '04:30 PM', status: 'present' },
  { id: 'ATT-009', name: 'Grace Osei', phone: '0244-012-345', department: 'Driver', timeIn: '08:00 AM', timeOut: null, status: 'late' },
  { id: 'ATT-010', name: 'Michael Adjei', phone: '0244-111-222', department: 'Driver', timeIn: '06:55 AM', timeOut: '05:00 PM', status: 'present' },
  { id: 'ATT-011', name: 'Oppong Mensah', phone: '0244-222-333', department: 'Mechanic', timeIn: '07:30 AM', timeOut: '04:00 PM', status: 'present' },
  { id: 'ATT-012', name: 'Abena Serwaa', phone: '0244-333-444', department: 'Mechanic', timeIn: '—', timeOut: '—', status: 'on_leave' },
  { id: 'ATT-013', name: 'Isaac Boateng', phone: '0244-444-555', department: 'Mechanic', timeIn: '07:00 AM', timeOut: '05:00 PM', status: 'present' },
  { id: 'ATT-014', name: 'Comfort Addo', phone: '0244-555-666', department: 'Admin', timeIn: '07:15 AM', timeOut: '04:30 PM', status: 'present' },
  { id: 'ATT-015', name: 'Ernestina Frimpong', phone: '0244-666-777', department: 'Admin', timeIn: '08:30 AM', timeOut: null, status: 'late' },
  { id: 'ATT-016', name: 'Patrick Amankwah', phone: '0244-777-888', department: 'Security', timeIn: '06:00 AM', timeOut: '06:00 PM', status: 'present' },
];

export const MOCK_ATTENDANCE_COLUMNS: Column<AttendanceRow>[] = [
  {
    key: 'name', label: 'Name', icon: <HeaderIcon name="user" />, width: '30%', align: 'left', primaryKey: true,
    render: (r) => {
      const initial = r.name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className={'w-[32px] h-[32px] shrink-0 rounded-full flex items-center justify-center text-[14px] font-bold ' + getAvatarColor(r.name)}>{initial}</div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.name}</span>
            <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.phone}</span>
          </div>
        </div>
      );
    },
  },
  { key: 'department', label: 'Department', icon: <HeaderIcon name="gear" />, width: '15%', align: 'left', render: (r) => <span className="text-[#555]">{r.department}</span> },
  { key: 'timeIn', label: 'Check In', icon: <HeaderIcon name="check-circle" />, width: '15%', align: 'left', render: (r) => <span className="text-[#555]">{r.timeIn}</span> },
  { key: 'timeOut', label: 'Check Out', icon: <HeaderIcon name="bell" />, width: '15%', align: 'left', render: (r) => <span className="text-[#555]">{r.timeOut ?? '—'}</span> },
  { key: 'status', label: 'Status', icon: <HeaderIcon name="check-circle" />, width: '15%', align: 'left', render: (r) => {
    const c: { [k: string]: string } = { present: 'bg-green-50 text-green-700 border-green-200', absent: 'bg-red-50 text-red-700 border-red-200', late: 'bg-yellow-50 text-yellow-700 border-yellow-200', on_leave: 'bg-blue-50 text-blue-700 border-blue-200' };
    const l: { [k: string]: string } = { present: 'Present', absent: 'Absent', late: 'Late', on_leave: 'On Leave' };
    return <span className={'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ' + c[r.status]}><span className="w-1.5 h-1.5 rounded-full bg-current" />{l[r.status]}</span>;
  }},
];

export function attendanceRowActions(row: AttendanceRow): DropdownMenuItem[] {
  return [
    { label: 'View Profile', icon: <Icon name="view" size={14} color="#555" />, onClick: () => console.log('View:', row.id) },
    { label: 'Edit Record', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => console.log('Edit:', row.id) },
    { label: 'Mark Absent', icon: <Icon name="warning" size={14} color="#555" />, onClick: () => console.log('Absent:', row.id) },
    { label: 'Remove Entry', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => console.log('Remove:', row.id) },
  ];
}

export const ATTENDANCE_FILTER_OPTIONS = [
  { label: 'All Workers', value: 'all' },
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'On Leave', value: 'on_leave' },
];

// ============================================================
// KPI STATS
// ============================================================

export const MOCK_DRIVER_KPIS = {
  totalDrivers: { label: 'TOTAL DRIVERS', value: 12, sub: '7 active on duty today' },
  activeDrivers: { label: 'ACTIVE', value: 7, sub: 'Currently on route' },
  onBreak: { label: 'ON BREAK', value: 2, sub: 'Scheduled rest period' },
  offline: { label: 'OFFLINE', value: 3, sub: 'Not available for dispatch' },
};

export const MOCK_VEHICLE_KPIS = {
  totalVehicles: { label: 'TOTAL VEHICLES', value: 12, sub: '8 active on road today' },
  active: { label: 'ACTIVE', value: 8, sub: 'Currently in service' },
  maintenance: { label: 'IN MAINTENANCE', value: 2, sub: 'Scheduled repair' },
  inactive: { label: 'INACTIVE', value: 2, sub: 'Not assigned or parked' },
};

export const MOCK_ROUTE_KPIS = {
  totalRoutes: { label: 'TOTAL ROUTES', value: 8, sub: '6 active routes' },
  activeRoutes: { label: 'ACTIVE', value: 6, sub: 'Currently operating' },
  totalBuses: { label: 'ASSIGNED BUSES', value: 13, sub: 'Across all routes' },
  dailyTrips: { label: 'DAILY TRIPS', value: 166, sub: 'Combined total' },
};

export const MOCK_ATTENDANCE_KPIS = {
  totalWorkers: { label: 'TOTAL WORKERS', value: 16, sub: 'Across all departments' },
  present: { label: 'PRESENT', value: 11, sub: 'Checked in today' },
  late: { label: 'LATE', value: 3, sub: 'Arrived after 7:30 AM' },
  absent: { label: 'ABSENT', value: 2, sub: 'Not reported today' },
};

export const MOCK_WORKER_KPIS = {
  totalWorkers: { label: 'TOTAL WORKERS', value: 8, sub: 'Maintenance crew' },
  active: { label: 'ACTIVE', value: 6, sub: 'Currently on duty' },
  onLeave: { label: 'ON LEAVE', value: 1, sub: 'Approved absence' },
  offline: { label: 'OFFLINE', value: 1, sub: 'Not available' },
};

// ============================================================
// MOCK DATA — Bookings
// ============================================================

export interface BookingRow {
  id: string;
  passenger: string;
  phone: string;
  department: string;
  route: string;
  vehicle: string | null;
  vehicleName: string | null;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  fare: number;
}

export const MOCK_BOOKING_DATA: BookingRow[] = [
  { id: 'BKG-001', passenger: 'Kwame Owusu', phone: '0244-123-456', department: 'Computer Engineering Dept', route: 'Brunei → KSB', vehicle: 'AS-1234-26', vehicleName: 'Mercedes-Benz Sprinter', date: '14 Jun 2026', time: '10:00 AM', status: 'confirmed', fare: 400 },
  { id: 'BKG-002', passenger: 'Ama Boateng', phone: '0244-234-567', department: 'Student Affairs', route: 'Conti → SRC', vehicle: 'AS-5678-26', vehicleName: 'Toyota Coaster', date: '14 Jun 2026', time: '11:00 AM', status: 'confirmed', fare: 400 },
  { id: 'BKG-003', passenger: 'Yaw Asante', phone: '0244-345-678', department: 'Engineering Dept', route: 'Hall 7 → KSB', vehicle: 'AS-3456-26', vehicleName: 'Nissan Civilian', date: '14 Jun 2026', time: '12:00 PM', status: 'pending', fare: 400 },
  { id: 'BKG-004', passenger: 'Linda Owusu', phone: '0244-456-789', department: 'Student Affairs', route: 'Gaza → Pharmacy', vehicle: null, vehicleName: null, date: '15 Jun 2026', time: '8:30 AM', status: 'pending', fare: 350 },
  { id: 'BKG-005', passenger: 'Efua Adjei', phone: '0244-567-890', department: 'Registrar', route: 'Main Library → Commercial', vehicle: 'AS-7890-26', vehicleName: 'Hyundai County', date: '13 Jun 2026', time: '2:15 PM', status: 'completed', fare: 380 },
  { id: 'BKG-006', passenger: 'Kojo Antwi', phone: '0244-678-901', department: 'Engineering Dept', route: 'SRC → Conti', vehicle: 'AS-9012-26', vehicleName: 'Ford Transit', date: '13 Jun 2026', time: '9:00 AM', status: 'completed', fare: 320 },
  { id: 'BKG-007', passenger: 'Abena Owusu', phone: '0244-789-012', department: 'Finance Office', route: 'Brunei → KSB', vehicle: 'AS-2468-26', vehicleName: 'Isuzu Journey', date: '12 Jun 2026', time: '1:45 PM', status: 'cancelled', fare: 400 },
  { id: 'BKG-008', passenger: 'Frederick Ession', phone: '0244-890-123', department: 'Computer Engineering Dept', route: 'Commercial → KSB', vehicle: 'AS-1357-26', vehicleName: 'Mitsubishi Rosa', date: '16 Jun 2026', time: '7:30 AM', status: 'confirmed', fare: 400 },
  { id: 'BKG-009', passenger: 'Elorm Seyram', phone: '0244-901-234', department: 'Student Affairs', route: 'Gaza → Pharmacy', vehicle: 'AS-5432-26', vehicleName: 'Volkswagen Transporter', date: '16 Jun 2026', time: '10:15 AM', status: 'pending', fare: 350 },
  { id: 'BKG-010', passenger: 'Patricia Amoah', phone: '0244-012-345', department: 'Registrar', route: 'Brunei → KSB', vehicle: null, vehicleName: null, date: '17 Jun 2026', time: '3:00 PM', status: 'cancelled', fare: 400 },
];

export const MOCK_BOOKING_COLUMNS: Column<BookingRow>[] = [
  {
    key: 'passenger',
    label: 'Passenger',
    icon: <HeaderIcon name="user" />,
    width: '25%',
    align: 'left',
    primaryKey: true,
    render: (r) => {
      const initial = r.passenger.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className={'w-[32px] h-[32px] shrink-0 rounded-full flex items-center justify-center text-[14px] font-bold ' + getAvatarColor(r.passenger)}>
            {initial}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.passenger}</span>
            <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.department}</span>
          </div>
        </div>
      );
    },
  },
  { key: 'status', label: 'Status', width: '15%', icon: <HeaderIcon name="check-circle" />, align: 'left', render: (r) => {
    const c: { [k: string]: string } = { confirmed: 'bg-green-50 text-green-700 border-green-200', pending: 'bg-yellow-50 text-yellow-700 border-yellow-200', completed: 'bg-blue-50 text-blue-700 border-blue-200', cancelled: 'bg-red-50 text-red-700 border-red-200' };
    const l: { [k: string]: string } = { confirmed: 'Confirmed', pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled' };
    return <span className={'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ' + c[r.status]}><span className="w-1.5 h-1.5 rounded-full bg-current" />{l[r.status]}</span>;
  }},
  { key: 'route', label: 'Route', width: '20%', icon: <HeaderIcon name="map-pin" />, align: 'left', render: (r) => <span className="text-[#555]">{r.route}</span> },
  {
    key: 'vehicle',
    label: 'Vehicle',
    icon: <HeaderIcon name="bus" />,
    width: '25%',
    align: 'left',
    render: (r) => {
      if (!r.vehicle) return <span className="text-[#555]">—</span>;
      return (
        <div className="flex items-center gap-3">
          <div className="w-[32px] h-[32px] shrink-0 rounded-lg bg-green-100 flex items-center justify-center">
            <Icon name="bus" size={18} color="#16a34a" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.vehicleName || r.vehicle}</span>
            <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.vehicle}</span>
          </div>
        </div>
      );
    },
  },
  { key: 'date', label: 'Date & Time', icon: <HeaderIcon name="bell" />, width: '15%', align: 'left', render: (r) => (
    <div className="flex flex-col min-w-0">
      <span className="text-[13px] text-[#111] leading-tight">{r.date}</span>
      <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.time}</span>
    </div>
  )},
];

export function bookingRowActions(row: BookingRow): DropdownMenuItem[] {
  return [
    { label: 'View Booking', icon: <Icon name="view" size={14} color="#555" />, onClick: () => console.log('View:', row.id) },
    { label: 'Edit Booking', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => console.log('Edit:', row.id) },
    { label: 'Reassign Vehicle', icon: <Icon name="refresh" size={14} color="#555" />, onClick: () => console.log('Reassign:', row.id) },
    { label: 'Cancel Booking', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => console.log('Cancel:', row.id) },
  ];
}

export const BOOKING_FILTER_OPTIONS = [
  { label: 'All Bookings', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const MOCK_BOOKING_KPIS = {
  totalBookings: { label: 'TOTAL BOOKINGS', value: 10, sub: '3 confirmed today' },
  confirmed: { label: 'CONFIRMED', value: 3, sub: 'Ready for pickup' },
  pending: { label: 'PENDING', value: 3, sub: 'Awaiting vehicle assignment' },
  cancelled: { label: 'CANCELLED', value: 2, sub: 'Cancelled this week' },
};

// ============================================================
// MOCK DATA — Maintenance Expenses (Analytics)
// ============================================================

export interface ExpenseRow {
  id: string;
  date: string;
  vehicle: string;
  vehiclePlate: string;
  category: 'Fuel' | 'Maintenance' | 'Repairs' | 'Parts & Tires';
  description: string;
  amount: number;
  status: 'paid' | 'pending';
}

export const MOCK_EXPENSE_DATA: ExpenseRow[] = [
  { id: 'EXP-101', date: '24 Jun 2026', vehicle: 'Mercedes-Benz Sprinter', vehiclePlate: 'AS-1234-26', category: 'Fuel', description: 'Diesel refill — 80L', amount: 960, status: 'paid' },
  { id: 'EXP-102', date: '24 Jun 2026', vehicle: 'Toyota Camry SE', vehiclePlate: 'GH-2345-26', category: 'Repairs', description: 'Brake pad replacement', amount: 320, status: 'paid' },
  { id: 'EXP-103', date: '23 Jun 2026', vehicle: 'Nissan Civilian', vehiclePlate: 'AS-3456-26', category: 'Maintenance', description: 'Transmission check', amount: 850, status: 'pending' },
  { id: 'EXP-104', date: '23 Jun 2026', vehicle: 'Toyota Coaster', vehiclePlate: 'AS-5678-26', category: 'Parts & Tires', description: 'Tire rotation — 4 wheels', amount: 180, status: 'paid' },
  { id: 'EXP-105', date: '22 Jun 2026', vehicle: 'Hyundai County', vehiclePlate: 'AS-7890-26', category: 'Repairs', description: 'Windshield replacement', amount: 950, status: 'pending' },
  { id: 'EXP-106', date: '22 Jun 2026', vehicle: 'Mercedes-Benz Sprinter', vehiclePlate: 'AS-1234-26', category: 'Maintenance', description: 'Oil change & filter', amount: 120, status: 'paid' },
  { id: 'EXP-107', date: '21 Jun 2026', vehicle: 'Ford Transit', vehiclePlate: 'AS-9012-26', category: 'Fuel', description: 'Diesel refill — 65L', amount: 780, status: 'paid' },
  { id: 'EXP-108', date: '20 Jun 2026', vehicle: 'Isuzu Journey', vehiclePlate: 'AS-2468-26', category: 'Repairs', description: 'Brake system overhaul', amount: 650, status: 'pending' },
  { id: 'EXP-109', date: '19 Jun 2026', vehicle: 'Mitsubishi Rosa', vehiclePlate: 'AS-1357-26', category: 'Parts & Tires', description: 'Headlight assembly', amount: 240, status: 'paid' },
  { id: 'EXP-110', date: '18 Jun 2026', vehicle: 'Volkswagen Transporter', vehiclePlate: 'AS-5432-26', category: 'Fuel', description: 'Diesel refill — 70L', amount: 840, status: 'paid' },
];

export const MOCK_EXPENSE_COLUMNS: Column<ExpenseRow>[] = [
  {
    key: 'vehicle',
    label: 'Vehicle',
    icon: <HeaderIcon name="bus" />,
    width: '28%',
    align: 'left',
    primaryKey: true,
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-[32px] h-[32px] shrink-0 rounded-lg bg-green-100 flex items-center justify-center">
          <Icon name="bus" size={18} color="#16a34a" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.vehicle}</span>
          <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.vehiclePlate}</span>
        </div>
      </div>
    ),
  },
  { key: 'category', label: 'Category', width: '15%', icon: <HeaderIcon name="gear" />, align: 'left', render: (r) => {
    const c: { [k: string]: string } = { Fuel: 'bg-blue-50 text-blue-700 border-blue-200', Maintenance: 'bg-green-50 text-green-700 border-green-200', Repairs: 'bg-red-50 text-red-700 border-red-200', 'Parts & Tires': 'bg-amber-50 text-amber-700 border-amber-200' };
    return <span className={'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-medium ' + c[r.category]}>{r.category}</span>;
  }},
  { key: 'description', label: 'Description', width: '27%', icon: <HeaderIcon name="view" />, align: 'left', render: (r) => <span className="text-[#555]">{r.description}</span> },
  { key: 'date', label: 'Date', width: '15%', icon: <HeaderIcon name="bell" />, align: 'left', render: (r) => <span className="text-[#555]">{r.date}</span> },
  { key: 'amount', label: 'Amount', width: '15%', icon: <HeaderIcon name="check-circle" />, align: 'left', render: (r) => (
    <div className="flex flex-col">
      <span className="text-[14px] font-semibold text-[#111]">₵{r.amount.toLocaleString()}</span>
      <span className={`text-[11px] mt-0.5 ${r.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{r.status === 'paid' ? 'Paid' : 'Pending'}</span>
    </div>
  )},
];

export function expenseRowActions(row: ExpenseRow): DropdownMenuItem[] {
  return [
    { label: 'View Expense', icon: <Icon name="view" size={14} color="#555" />, onClick: () => console.log('View:', row.id) },
    { label: 'Edit Expense', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => console.log('Edit:', row.id) },
    { label: 'Mark as Paid', icon: <Icon name="check-circle" size={14} color="#16a34a" />, onClick: () => console.log('Mark Paid:', row.id) },
    { label: 'Delete Expense', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => console.log('Delete:', row.id) },
  ];
}

export const EXPENSE_FILTER_OPTIONS = [
  { label: 'All Categories', value: 'all' },
  { label: 'Fuel', value: 'Fuel' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Repairs', value: 'Repairs' },
  { label: 'Parts & Tires', value: 'Parts & Tires' },
];

export const MOCK_EXPENSE_CATEGORIES = [
  { label: 'Fuel', amount: 12400, color: 'bg-blue-500' },
  { label: 'Maintenance', amount: 8200, color: 'bg-green-500' },
  { label: 'Repairs', amount: 5600, color: 'bg-red-500' },
  { label: 'Parts & Tires', amount: 3100, color: 'bg-amber-500' },
];

export const MOCK_TOP_VEHICLES_BY_COST = [
  { vehicle: 'Mercedes-Benz Sprinter', plate: 'AS-1234-26', amount: 4820 },
  { vehicle: 'Toyota Camry SE', plate: 'GH-2345-26', amount: 3950 },
  { vehicle: 'Nissan Civilian', plate: 'AS-3456-26', amount: 3400 },
  { vehicle: 'Toyota Coaster', plate: 'AS-5678-26', amount: 2890 },
  { vehicle: 'Hyundai County', plate: 'AS-7890-26', amount: 2150 },
];

export const MOCK_EXPENSE_KPIS = {
  totalExpenses: { label: 'TOTAL EXPENSES', value: '₵29,300', sub: 'This month across 12 vehicles' },
  fuelCosts: { label: 'FUEL COSTS', value: '₵12,400', sub: '42% of total spend' },
  maintenanceRepairs: { label: 'MAINTENANCE & REPAIRS', value: '₵13,800', sub: '6 active work orders' },
  avgPerVehicle: { label: 'AVG COST / VEHICLE', value: '₵2,442', sub: 'Across fleet of 12' },
};

// ============================================================
// MOCK MAP BUSES
// ============================================================

// ============================================================
// MOCK DATA — Fault & Accident Reports
// ============================================================

export interface FaultReportRow {
  id: string;
  reportType: 'Fault' | 'Accident';
  vehicle: string;
  plateNumber: string;
  driver: string;
  damages: string;
  date: string;
  reportedBy: string;
  status: 'open' | 'in_progress' | 'resolved';
}

export const MOCK_FAULT_REPORT_DATA: FaultReportRow[] = [
  { id: 'FR-001', reportType: 'Accident', vehicle: 'Mercedes-Benz Sprinter', plateNumber: 'AS-1234-26', driver: 'Kwame Mensah', damages: 'Front bumper damage, cracked headlight', date: '14 June 2026', reportedBy: 'Oppong Mensah', status: 'open' },
  { id: 'FR-002', reportType: 'Fault', vehicle: 'Toyota Coaster', plateNumber: 'AS-5678-26', driver: 'Ama Asante', damages: 'Brake failure, worn brake pads', date: '12 June 2026', reportedBy: 'Isaac Boateng', status: 'in_progress' },
  { id: 'FR-003', reportType: 'Fault', vehicle: 'Ford Transit', plateNumber: 'AS-9012-26', driver: 'Kofi Owusu', damages: 'Engine overheating, coolant leak', date: '10 June 2026', reportedBy: 'Patrick Amankwah', status: 'open' },
  { id: 'FR-004', reportType: 'Accident', vehicle: 'Nissan Civilian', plateNumber: 'AS-3456-26', driver: 'Yaa Boateng', damages: 'Side mirror broken, scratch on door', date: '8 June 2026', reportedBy: 'Daniel Asare', status: 'resolved' },
  { id: 'FR-005', reportType: 'Fault', vehicle: 'Hyundai County', plateNumber: 'AS-7890-26', driver: 'Kwesi Adomako', damages: 'Transmission slipping, gear delay', date: '5 June 2026', reportedBy: 'Ernestina Frimpong', status: 'in_progress' },
  { id: 'FR-006', reportType: 'Accident', vehicle: 'Isuzu Journey', plateNumber: 'AS-2468-26', driver: 'Akosua Manu', damages: 'Rear collision, tail light shattered', date: '2 June 2026', reportedBy: 'Comfort Addo', status: 'open' },
  { id: 'FR-007', reportType: 'Fault', vehicle: 'Mitsubishi Rosa', plateNumber: 'AS-1357-26', driver: 'Emmanuel Tetteh', damages: 'Air conditioning failure, compressor dead', date: '28 May 2026', reportedBy: 'Michael Asiamah', status: 'resolved' },
  { id: 'FR-008', reportType: 'Accident', vehicle: 'Fiat Ducato', plateNumber: 'AS-6789-26', driver: 'Michael Adjei', damages: 'Front windshield cracked, dent on hood', date: '22 May 2026', reportedBy: 'Samuel Ofori', status: 'open' },
];

export const MOCK_FAULT_REPORT_COLUMNS: Column<FaultReportRow>[] = [
  { key: 'vehicle', label: 'Vehicle', icon: <HeaderIcon name="bus" />, width: '22%', align: 'left', primaryKey: true, render: (r) => (
    <div className="flex items-center gap-3">
      <div className="w-[32px] h-[32px] shrink-0 rounded-lg bg-green-100 flex items-center justify-center"><Icon name="bus" size={18} color="#16a34a" /></div>
      <div className="flex flex-col min-w-0">
        <span className="text-[15px] font-semibold text-[#111] leading-tight">{r.vehicle}</span>
        <span className="text-[12px] text-[#888] leading-tight mt-0.5">{r.plateNumber}</span>
      </div>
    </div>
  )},
  { key: 'driver', label: 'Driver', icon: <HeaderIcon name="user" />, width: '14%', align: 'left', render: (r) => <span className="text-[#555]">{r.driver}</span> },
  { key: 'damages', label: 'Damages', width: '22%', align: 'left', render: (r) => <span className="text-[#555] text-xs">{r.damages}</span> },
  { key: 'date', label: 'Date', icon: <HeaderIcon name="bell" />, width: '12%', align: 'left', render: (r) => <span className="text-[#555]">{r.date}</span> },
  { key: 'reportedBy', label: 'Reported By', icon: <HeaderIcon name="user" />, width: '12%', align: 'left', render: (r) => <span className="text-[#555]">{r.reportedBy}</span> },
  { key: 'status', label: 'Status', icon: <HeaderIcon name="check-circle" />, width: '12%', align: 'left', render: (r) => {
    const c: { [k: string]: string } = { open: 'bg-red-50 text-red-700 border-red-200', in_progress: 'bg-yellow-50 text-yellow-700 border-yellow-200', resolved: 'bg-green-50 text-green-700 border-green-200' };
    const l: { [k: string]: string } = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved' };
    return <span className={'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium ' + c[r.status]}><span className="w-1.5 h-1.5 rounded-full bg-current" />{l[r.status]}</span>;
  }},
];

export function faultReportRowActions(row: FaultReportRow): DropdownMenuItem[] {
  return [
    { label: 'View Details', icon: <Icon name="view" size={14} color="#555" />, onClick: () => console.log('View:', row.id) },
    { label: 'Edit Report', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => console.log('Edit:', row.id) },
    { label: 'Mark Resolved', icon: <Icon name="check-circle" size={14} color="#555" />, onClick: () => console.log('Resolve:', row.id) },
    { label: 'Delete Report', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => console.log('Delete:', row.id) },
  ];
}

export const FAULT_REPORT_FILTER_OPTIONS = [
  { label: 'All Reports', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
];

export interface MockMapBus {
  busID: string;
  driverID: string;
  active: boolean;
  busRoute: string[];
  coords: {
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
    timestamp: number;
  };
  driverName?: string;
  phoneNumber?: string;
  plateNumber?: string;
}

export const MOCK_MAP_BUSES: MockMapBus[] = [
  { busID: 'BUS-001', driverID: 'DRV-001', active: true, busRoute: ['Brunei', 'Main Library', 'Pentecost', 'SRC', 'KSB'], coords: { latitude: 6.6745, longitude: -1.5730, heading: 120, speed: 8.3, timestamp: Date.now() }, driverName: 'Kwame Mensah', phoneNumber: '024 412 3456', plateNumber: 'AS-1234-26' },
  { busID: 'BUS-002', driverID: 'DRV-002', active: true, busRoute: ['Commercial Area', 'Hall 7', 'Conti', 'KSB'], coords: { latitude: 6.6800, longitude: -1.5760, heading: 200, speed: 6.7, timestamp: Date.now() }, driverName: 'Ama Asante', phoneNumber: '024 523 7890', plateNumber: 'AS-5678-26' },
  { busID: 'BUS-003', driverID: 'DRV-004', active: true, busRoute: ['Brunei', 'SRC', 'Pentecost', 'KSB'], coords: { latitude: 6.6695, longitude: -1.5675, heading: 340, speed: 5.1, timestamp: Date.now() }, driverName: 'Yaa Boateng', phoneNumber: '024 645 1234', plateNumber: 'AS-3456-26' },
  { busID: 'BUS-004', driverID: 'DRV-006', active: true, busRoute: ['Gaza', 'Medical Village', 'Pharmacy'], coords: { latitude: 6.6860, longitude: -1.5570, heading: 80, speed: 7.2, timestamp: Date.now() }, driverName: 'Akosua Manu', phoneNumber: '024 678 9012', plateNumber: 'AS-2468-26' },
  { busID: 'BUS-005', driverID: 'DRV-007', active: true, busRoute: ['Brunei', 'Main Library', 'Pentecost', 'KSB'], coords: { latitude: 6.6780, longitude: -1.5710, heading: 160, speed: 9.5, timestamp: Date.now() }, driverName: 'Emmanuel Tetteh', phoneNumber: '024 789 0123', plateNumber: 'AS-1357-26' },
  { busID: 'BUS-006', driverID: 'DRV-009', active: true, busRoute: ['Commercial Area', 'Conti', 'SRC', 'KSB'], coords: { latitude: 6.6820, longitude: -1.5745, heading: 250, speed: 4.8, timestamp: Date.now() }, driverName: 'Daniel Asare', phoneNumber: '024 890 4567', plateNumber: 'AS-9012-26' },
  { busID: 'BUS-007', driverID: 'DRV-010', active: true, busRoute: ['Gaza', 'Pharmacy', 'Medical Village'], coords: { latitude: 6.6840, longitude: -1.5535, heading: 15, speed: 6.0, timestamp: Date.now() }, driverName: 'Grace Osei', phoneNumber: '024 901 8910', plateNumber: 'AS-5432-26' },
  { busID: 'BUS-008', driverID: 'DRV-011', active: true, busRoute: ['Main Library', 'Pentecost', 'SRC', 'KSB'], coords: { latitude: 6.6755, longitude: -1.5690, heading: 290, speed: 3.2, timestamp: Date.now() }, driverName: 'Michael Adjei', phoneNumber: '024 012 3456', plateNumber: 'AS-6789-26' },
  { busID: 'BUS-009', driverID: 'DRV-005', active: false, busRoute: ['Commercial Area', 'KSB'], coords: { latitude: 6.6815, longitude: -1.5770, heading: 0, speed: 0, timestamp: Date.now() }, driverName: 'Kwesi Adomako', phoneNumber: '024 567 8901', plateNumber: 'AS-7890-26' },
];

// Picks a consistent mock driver for a real bus/driver ID that has no match in MOCK_MAP_BUSES
// (e.g. real MQTT device IDs), so the UI always has a name/phone/plate to display.
export function getMockDriverForBus(id: string | number | null | undefined): MockMapBus {
  const str = String(id ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return MOCK_MAP_BUSES[hash % MOCK_MAP_BUSES.length];
}
