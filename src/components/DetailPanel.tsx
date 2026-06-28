import React, { useState } from 'react';
import { X, CaretDown, UsersThree, Phone, FileText, Receipt, UserPlus } from '@phosphor-icons/react';
import { Icon } from './Icon';
import VehicleBookingCalendar, { type VehicleBooking } from './VehicleBookingCalendar';
import VehicleFaultsKanban from './VehicleFaultsKanban';
import { DropdownMenu, type DropdownMenuItem } from './DropdownMenu';
import { BookingDetailsModal } from './BookingDetailsModal';
import { setPrefillVehicle, setPrefillDriver, setPrefillDate, triggerBookingForm } from '../lib/prefill';

const DEFAULT_VEHICLE_IMAGE = '/Image/image%201.png';
const DEFAULT_DRIVER_IMAGE = '/Image/Driver.png';

export interface DetailPanelEntity {
  title: string;
  driverPhotoUrl?: string;
  driverName: string;
  driverPhone?: string;
  driverId?: string;
  status: string;
  timeCheckIn?: string;
  lastUpdated?: string;
  imageUrl?: string;
  details: { label: string; value: string }[];
  detailsSecondary?: { label: string; value: string }[];
  ctaLabel?: string;
  vehiclePlate?: string;
}

interface DetailPanelProps {
  entity: DetailPanelEntity;
  onClose: () => void;
  variant?: 'vehicle' | 'driver';
  size?: 'compact' | 'wide';
  onEdit?: () => void;
  onAssign?: () => void;
  onDelete?: () => void;
  onBookVehicle?: () => void;
  onLogExpense?: () => void;
}

// ── Per-vehicle realistic mock data ───────────────────────────

const VEHICLE_SCHEDULES: Record<string, { month: string; date: string; name: string; destination: string; duration: string; amount: string }[][]> = {
  'AS-1234-26': [
    [{ month: 'June', date: '7', name: 'KNUST Main Campus', destination: 'KSB', duration: '18 min', amount: '₵180' }],
    [{ month: 'June', date: '12', name: 'College of Science', destination: 'Commercial', duration: '24 min', amount: '₵240' }, { month: 'June', date: '18', name: 'Faculty of Law', destination: 'Conti', duration: '10 min', amount: '₵100' }, { month: 'June', date: '28', name: 'Engineering Dept.', destination: 'KSB', duration: '15 min', amount: '₵150' }],
    [{ month: 'July', date: '4', name: 'Medical School', destination: 'Pharmacy', duration: '12 min', amount: '₵120' }],
  ],
  'AS-5678-26': [
    [{ month: 'June', date: '8', name: 'Business School', destination: 'KSB', duration: '24 min', amount: '₵240' }],
    [{ month: 'June', date: '15', name: 'Science Faculty', destination: 'Main Library', duration: '14 min', amount: '₵140' }],
    [{ month: 'July', date: '2', name: 'Sports Complex', destination: 'Conti', duration: '10 min', amount: '₵100' }],
  ],
};



const DEFAULT_SCHEDULES: { month: string; date: string; name: string; destination: string; duration: string; amount: string }[][] = [
  [{ month: 'June', date: '7', name: 'KNUST Main Campus', destination: 'KSB', duration: '18 min', amount: '₵180' }],
  [{ month: 'June', date: '12', name: 'College of Science', destination: 'Commercial', duration: '24 min', amount: '₵240' }, { month: 'June', date: '18', name: 'Faculty of Law', destination: 'Conti', duration: '10 min', amount: '₵100' }, { month: 'June', date: '28', name: 'Engineering Dept.', destination: 'KSB', duration: '15 min', amount: '₵150' }],
  [{ month: 'July', date: '4', name: 'Medical School', destination: 'Pharmacy', duration: '12 min', amount: '₵120' }],
];

const DriverIdentity = ({ entity, onAssignDriver }: { entity: DetailPanelEntity; onAssignDriver: () => void }) => {
  if (!entity.driverName) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-neutral-50 border border-dashed border-black/15 flex items-center justify-center">
          <UserPlus size={22} className="text-black/30" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-black/40">No Driver Assigned</p>
          <button
            onClick={onAssignDriver}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 rounded-lg text-white text-xs font-semibold hover:bg-green-700 transition-colors"
          >
            <UserPlus size={12} weight="bold" />
            Assign Driver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <img src={entity.driverPhotoUrl ?? DEFAULT_DRIVER_IMAGE} alt={entity.driverName} className="w-16 h-16 rounded-full object-cover" />
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-base font-semibold text-black">{entity.driverName}</p>
        {entity.driverPhone && <p className="text-xs text-gray-900">{entity.driverPhone}</p>}
      </div>
    </div>
  );
};

const VEHICLE_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'schedules', label: 'Schedules' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'faults', label: 'Faults' },
] as const;

const DRIVER_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'buses-driven', label: 'Buses Driven' },
  { key: 'logs', label: 'Logs' },
  { key: 'complaints', label: 'Complaints' },
] as const;

type TabKey = typeof VEHICLE_TABS[number]['key'] | typeof DRIVER_TABS[number]['key'];

const SchedulesView = ({ vehiclePlate, driverName, size = 'compact' }: { vehiclePlate?: string; driverName?: string; size?: 'compact' | 'wide' }) => {
  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(null);

  if (size === 'wide') {
    return (
      <>
        <VehicleBookingCalendar
          onAddSchedule={({ day }) => {
            setPrefillVehicle(vehiclePlate ?? null);
            setPrefillDriver(driverName || null);
            const now = new Date();
            const synthDate = new Date(now.getFullYear(), now.getMonth(), day.date);
            setPrefillDate(synthDate.toISOString().slice(0, 10));
            triggerBookingForm();
          }}
          onBookingClick={(booking) => setSelectedBooking(booking)}
        />
        <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      </>
    );
  }

  const scheduleGroups = (vehiclePlate && VEHICLE_SCHEDULES[vehiclePlate]) || DEFAULT_SCHEDULES;
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = [1, 2, 3, 4, 5, 6, 7];
  const today = 7;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center bg-neutral-50 rounded-2xl px-4 py-3 gap-0">
        <div className="flex flex-col gap-1.5 w-24">
          <div className="text-black/50 text-xs font-semibold uppercase">Orders</div>
          <div className="text-black text-base font-semibold">{scheduleGroups.flat().length}</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">Total Spent</div>
          <div className="text-black text-base font-semibold">₵{(scheduleGroups.flat().length * 3800).toLocaleString()}</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">AVG Order</div>
          <div className="text-black text-base font-semibold">₵167.14</div>
        </div>
      </div>

      <div className="flex bg-neutral-50 border-t border-b border-black/5 rounded-lg mt-4">
        {weekDays.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-start py-2 gap-0.5 w-full">
            <span className="text-black/80 text-sm">{day}</span>
            <span className={`text-xs ${dates[i] === today ? 'text-pink-600 font-medium' : 'text-black/40'}`}>
              {dates[i]}
            </span>
            {dates[i] === today && (
              <span className="w-1.5 h-1.5 rounded-full bg-pink-600 border border-white -mt-0.5" />
            )}
          </div>
        ))}
      </div>

      <BookingSection title="JUNE 7" subtitle="· TODAY" bookings={scheduleGroups[0] || []} />
      <BookingSection title="UPCOMING ACTIVITIES" bookings={scheduleGroups[1] || []} />
      {scheduleGroups.length > 2 && (
        <BookingSection title="NEXT MONTH" bookings={scheduleGroups[2] || []} />
      )}
    </div>
  );
};

interface Booking {
  month: string;
  date: string;
  name: string;
  destination: string;
  duration: string;
  amount?: string;
}

const BookingSection = ({ title, subtitle, bookings }: { title: string; subtitle?: string; bookings: Booking[] }) => (
  <div className="flex flex-col gap-3.5 mt-4">
    <div className="text-black/70 text-sm text-left">
      {title}
      {subtitle && <span className="text-black/50">{subtitle}</span>}
    </div>
    {bookings.map((b, i) => (
      <div key={i} className="group flex items-center gap-3 bg-white rounded-2xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] outline outline-offset-[-1px] outline-black/5 p-2 relative overflow-hidden">
        {/* Date badge */}
        <div className="w-12 h-14 rounded-[10px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] overflow-hidden shrink-0">
          <div className="bg-green-600 px-1.5 pt-1 pb-1 flex justify-center items-center rounded-t-[10px]">
            <span className="text-white text-[10px] font-medium">{b.month}</span>
          </div>
          <div className="flex-1 bg-white flex justify-center items-center rounded-b-[10px] py-0.5">
            <span className="text-black/70 text-base font-bold">{b.date}</span>
          </div>
        </div>
        <div className="w-px h-14 bg-black/10 rotate-0" />
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="text-black text-sm font-medium truncate text-left">{b.name}</div>
          <div className="flex items-center gap-2">
            <span className="text-black/50 text-xs text-left">{b.destination}</span>
            <span className="w-[3px] h-[3px] bg-zinc-300 rounded-full" />
            <span className="text-black/40 text-xs">{b.duration}</span>
          </div>
        </div>
        {/* Amount on hover */}
        {b.amount && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-black text-sm font-semibold">{b.amount}</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

const FaultsView = ({ size = 'compact' }: { size?: 'compact' | 'wide' }) => {
  if (size === 'wide') {
    return <VehicleFaultsKanban />;
  }

  return (
  <div className="flex flex-col gap-4">
    <div className="flex items-center bg-neutral-50 rounded-2xl px-4 py-3 gap-0">
      <div className="flex flex-col gap-1.5 w-24">
        <div className="text-black/50 text-xs font-semibold uppercase">Open</div>
        <div className="text-black text-base font-semibold">3</div>
      </div>
      <div className="w-px h-10 bg-black/10 mx-4" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="text-black/50 text-xs font-semibold uppercase">Critical</div>
        <div className="text-red-600 text-base font-semibold">1</div>
      </div>
      <div className="w-px h-10 bg-black/10 mx-4" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="text-black/50 text-xs font-semibold uppercase">Resolved</div>
        <div className="text-black text-base font-semibold">12</div>
      </div>
    </div>

    <div className="flex flex-col gap-3">
      <p className="text-black text-sm font-semibold text-left">Active Faults</p>

      {/* Fault Card - High */}
      <div className="bg-white rounded-xl outline outline-offset-[-1px] outline-black/5 overflow-hidden relative p-4">
        <div className="w-[3px] h-full absolute left-0 top-0 bg-red-400 rounded-l-2xl" />
        <div className="flex justify-between items-start mb-3">
          <span className="text-black text-sm font-semibold">Brake System Overhaul</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 rounded-2xl outline-1 outline-offset-[-1px] outline-red-200 text-[10px] font-medium text-red-700">Critical</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-7 p-2 bg-neutral-50 rounded-lg flex items-center justify-center">
            <Icon name="bus" size={16} color="#888" />
          </div>
          <div className="flex flex-col">
            <span className="text-black/70 text-xs text-left">Toyota Camry SE</span>
            <span className="text-black/40 text-[10px] text-left">GH-2345-26</span>
          </div>
        </div>
        <div className="w-full h-px bg-black/10 mb-3" />
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white font-bold">K</div>
          <span className="text-black/70 text-sm">Kwame <span className="text-black/50">(Technician)</span></span>
        </div>
      </div>

      {/* Fault Card - Medium */}
      <div className="bg-white rounded-xl outline outline-offset-[-1px] outline-black/5 overflow-hidden relative p-4">
        <div className="w-[3px] h-full absolute left-0 top-0 bg-amber-300 rounded-l-2xl" />
        <div className="flex justify-between items-start mb-3">
          <span className="text-black text-sm font-semibold">Oil Change</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-2xl outline-1 outline-offset-[-1px] outline-amber-200 text-[10px] font-medium text-amber-700">Medium</span>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1.5" y="0.6" width="8" height="4" rx="1" fill="rgba(0,0,0,0.4)"/><rect x="1.5" y="5" width="8" height="6" rx="1" fill="rgba(0,0,0,0.4)"/></svg>
          <span className="text-black/50 text-[10px]">Scheduled</span>
          <span className="text-red-500 text-[10px] ml-2">Due by 14 Mar</span>
        </div>
        <div className="flex items-center gap-2 mb-3 ml-2">
          <div className="w-8 h-7 p-2 bg-neutral-50 rounded-lg flex items-center justify-center">
            <Icon name="bus" size={16} color="#888" />
          </div>
          <div className="flex flex-col">
            <span className="text-black/70 text-xs">Toyota Camry SE</span>
            <span className="text-black/40 text-[10px]">GH-2345-26</span>
          </div>
        </div>
        <div className="w-full h-px bg-black/10 mb-3" />
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold">A</div>
          <span className="text-black/70 text-sm">Prof Akwesi Arthur</span>
        </div>
      </div>

      {/* Fault Card - Low */}
      <div className="bg-white rounded-xl outline-1 outline-offset-[-1px] outline-black/5 overflow-hidden relative p-4">
        <div className="w-[3px] h-full absolute left-0 top-0 bg-blue-300 rounded-l-2xl" />
        <div className="flex justify-between items-start mb-3">
          <span className="text-black text-sm font-semibold">Windshield Replacement</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-2xl outline-1 outline-offset-[-1px] outline-blue-200 text-[10px] font-medium text-blue-700">Low</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-7 p-2 bg-neutral-50 rounded-lg flex items-center justify-center">
            <Icon name="bus" size={16} color="#888" />
          </div>
          <div className="flex flex-col">
            <span className="text-black/70 text-xs">Hyundai County</span>
            <span className="text-black/40 text-[10px]">AS-7890-26</span>
          </div>
        </div>
        <div className="w-full h-px bg-black/10 mb-3" />
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-[8px] text-white font-bold">E</div>
          <span className="text-black/70 text-sm">Emmanuel <span className="text-black/50">(Technician)</span></span>
        </div>
      </div>
    </div>
  </div>
  );
};

interface ExpenseCategory {
  label: string;
  value: number;
  color: string;
}

interface ExpenseLineItem {
  label: string;
  quantity?: number;
  amount: number;
  muted?: boolean;
}

interface ExpenseEntry {
  id: string;
  name: string;
  category: string;
  time: string;
  date: string;
  status: string;
  issuerName: string;
  issuerPhone: string;
  issuerLocation: string;
  items: ExpenseLineItem[];
  total: number;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { label: 'Fuel', value: 380, color: 'bg-green-500' },
  { label: 'Parts', value: 290, color: 'bg-emerald-500' },
  { label: 'Labour', value: 250, color: 'bg-amber-500' },
  { label: 'Repairs', value: 320, color: 'bg-orange-500' },
  { label: 'Tires', value: 180, color: 'bg-red-500' },
  { label: 'Insurance', value: 150, color: 'bg-blue-500' },
  { label: 'Cleaning', value: 90, color: 'bg-purple-500' },
  { label: 'Misc', value: 65, color: 'bg-pink-500' },
];

const EXPENSE_ENTRIES: ExpenseEntry[] = [
  {
    id: '1',
    name: 'Oil Change & Filter',
    category: 'Maintenance',
    time: '10:42 AM',
    date: '12 Feb 2026',
    status: 'Paid',
    issuerName: 'Ama Boateng',
    issuerPhone: '024 412 7790',
    issuerLocation: 'Total Energies - Ayeduase',
    items: [
      { label: 'Engine Oil (5W-30, 5L)', quantity: 1, amount: 145 },
      { label: 'Oil Filter', quantity: 1, amount: 36 },
      { label: 'Labour', amount: 50, muted: true },
    ],
    total: 231,
  },
  {
    id: '2',
    name: 'Diesel Fuel Top Up',
    category: 'Fuel',
    time: '6:15 AM',
    date: '9 Feb 2026',
    status: 'Paid',
    issuerName: 'Kwame Osei',
    issuerPhone: '055 234 8810',
    issuerLocation: 'Shell - Ayeduase',
    items: [{ label: 'Diesel (40L)', amount: 480 }],
    total: 480,
  },
  {
    id: '3',
    name: 'Brake Pad Replacement',
    category: 'Repairs',
    time: '2:30 PM',
    date: '5 Feb 2026',
    status: 'Pending',
    issuerName: 'Yaw Mensah',
    issuerPhone: '020 567 3421',
    issuerLocation: 'KNUST Auto Shop',
    items: [
      { label: 'Front Brake Pads (Set)', quantity: 1, amount: 320 },
      { label: 'Brake Fluid', quantity: 2, amount: 45 },
      { label: 'Labour', amount: 80, muted: true },
    ],
    total: 445,
  },
  {
    id: '4',
    name: 'Tire Rotation & Balance',
    category: 'Parts & Tires',
    time: '9:00 AM',
    date: '1 Feb 2026',
    status: 'Paid',
    issuerName: 'Akosua Donkor',
    issuerPhone: '027 891 4567',
    issuerLocation: 'Vulcanizer - Kotei',
    items: [
      { label: 'Tire Rotation (All 4)', amount: 80 },
      { label: 'Wheel Balancing', amount: 60 },
      { label: 'Valve Stems (4 pcs)', quantity: 1, amount: 20, muted: true },
    ],
    total: 160,
  },
];

const ExpensesView = () => {
  const [expandedId, setExpandedId] = useState<string | null>(EXPENSE_ENTRIES[0]?.id ?? null);
  const maxCategoryValue = Math.max(...EXPENSE_CATEGORIES.map((c) => c.value));

  return (
    <div className="flex flex-col gap-8">
      {/* Stats row */}
      <div className="flex items-center bg-neutral-50 rounded-2xl px-4 py-3 gap-0">
        <div className="flex flex-col gap-1.5 w-24">
          <div className="text-black/50 text-xs font-semibold uppercase">Orders</div>
          <div className="text-black text-base font-semibold">14</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">Total Spent</div>
          <div className="text-black text-base font-semibold">₵48,260</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">AVG Order</div>
          <div className="text-black text-base font-semibold">₵167.14</div>
        </div>
      </div>

      {/* Category Breakdown with bar chart */}
      <div className="bg-white rounded-3xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] overflow-hidden p-4">
        <div className="text-black text-base font-bold capitalize text-left mb-8">Category Breakdown</div>
        <div className="flex items-end gap-6 h-44">
          <div className="flex flex-col justify-between h-full py-0.5">
            {['1000', '800', '600', '400', '200', '0'].map((l, i) => (
              <span key={i} className="text-[10px] text-stone-400 leading-none">{l}</span>
            ))}
          </div>
          <div className="flex-1 flex items-end gap-3.5 h-full pt-[20%]">
            {EXPENSE_CATEGORIES.map((cat) => {
              const barMaxH = 134;
              const height = Math.max(6, (cat.value / maxCategoryValue) * barMaxH);
              const barColor = cat.color === 'bg-green-500' ? '#22c55e' : cat.color === 'bg-emerald-500' ? '#10b981' : cat.color === 'bg-amber-500' ? '#f59e0b' : cat.color === 'bg-orange-500' ? '#f97316' : cat.color === 'bg-red-500' ? '#ef4444' : cat.color === 'bg-blue-500' ? '#3b82f6' : cat.color === 'bg-purple-500' ? '#a855f7' : '#ec4899';
              return (
                <div key={cat.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end px-1">
                  <div className="w-full bg-zinc-100 rounded-sm relative" style={{ height: `${barMaxH}px` }}>
                    <div className="absolute bottom-0 w-full rounded-sm" style={{ height: `${height}px`, backgroundColor: cat.color === 'bg-orange-500' ? '#3b82f6' : barColor }} />
                  </div>
                  <span className="text-[10px] text-black/60">{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expense list */}
      <div className="flex flex-col gap-3">
        <div className="text-black text-sm font-semibold text-left">Expense</div>
        <div className="w-full bg-neutral-50 rounded-[20px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] outline-1 outline-offset-[-1px] outline-black/5 flex flex-col">
          {EXPENSE_ENTRIES.map((entry, index) => {
            const expanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className={index < EXPENSE_ENTRIES.length - 1 ? 'border-b border-black/5' : ''}
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-black/80 text-sm font-medium truncate">{entry.name}</p>
                    <p className="text-black/50 text-sm truncate">
                      {entry.category} · {entry.time} · {entry.date} · {entry.status}
                    </p>
                  </div>
                  <CaretDown
                    size={16}
                    className={`text-black/50 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {expanded && (
                  <div className="px-2 pb-2">
                    <div className="bg-white rounded-2xl outline-1 outline-offset-[-1px] outline-black/5 overflow-hidden">
                      {/* Issuer */}
                      <div className="px-4 py-3 border-b border-black/5 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <UsersThree size={16} className="text-black/50" />
                          <span className="text-black/40 text-xs">Issuer</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-black/70 text-base font-semibold text-left">{entry.issuerName}</p>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-black/60 text-sm">{entry.issuerPhone}</span>
                              <Phone size={14} className="text-black" />
                            </div>
                            <span className="text-black/40 text-sm underline">{entry.issuerLocation}</span>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="py-3 flex flex-col gap-4">
                        <div className="px-4 flex justify-between items-end gap-7">
                          <div className="flex-1 flex flex-col gap-2.5">
                            <div className="text-black/40 text-sm text-left">Item</div>
                            <div className="flex flex-col gap-2">
                              {entry.items.map((item) => (
                                <div
                                  key={item.label}
                                  className={`text-sm text-left ${item.muted ? 'text-black/40' : 'text-black/80'}`}
                                >
                                  {item.label}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="text-black/40 text-sm">Quantity</div>
                            <div className="flex flex-col items-end gap-2">
                              {entry.items.map((item) => (
                                <div key={item.label} className="text-black/80 text-sm">
                                  {item.quantity ?? ''}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2.5">
                            <div className="text-black/40 text-sm">Amount</div>
                            <div className="flex flex-col items-end gap-2">
                              {entry.items.map((item) => (
                                <div
                                  key={item.label}
                                  className={`text-sm ${item.muted ? 'text-black/40' : 'text-black/80'}`}
                                >
                                  ₵{item.amount.toFixed(2)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="h-px bg-black/10 w-full" />
                        <div className="px-4 flex justify-between items-center">
                          <div className="text-black/40 text-sm">Total</div>
                          <div className="text-black text-sm font-semibold">₵{entry.total.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface ComplianceDoc {
  name: string;
  number: string;
  expiry: string;
  status: 'Valid' | 'Expiring' | 'Expired';
}

const COMPLIANCE_DOCS: ComplianceDoc[] = [
  { name: "Driver's License", number: 'DL-22-0457-2026', expiry: '14 Nov 2026', status: 'Valid' },
  { name: 'National ID (Ghana Card)', number: 'GHA-887654321-0', expiry: '—', status: 'Valid' },
  { name: 'Medical Certificate', number: 'MC-2026-1183', expiry: '02 Mar 2026', status: 'Expiring' },
  { name: 'Background Check', number: 'BGC-2025-4471', expiry: '18 Dec 2025', status: 'Expired' },
];

const COMPLIANCE_STATUS_STYLES: Record<ComplianceDoc['status'], string> = {
  Valid: 'bg-green-50 text-green-700 outline-green-200',
  Expiring: 'bg-amber-50 text-amber-700 outline-amber-200',
  Expired: 'bg-red-50 text-red-700 outline-red-200',
};

const ComplianceView = () => {
  const counts = COMPLIANCE_DOCS.reduce(
    (acc, doc) => {
      acc[doc.status] += 1;
      return acc;
    },
    { Valid: 0, Expiring: 0, Expired: 0 } as Record<ComplianceDoc['status'], number>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center bg-neutral-50 rounded-2xl px-4 py-3 gap-0">
        <div className="flex flex-col gap-1.5 w-20">
          <div className="text-black/50 text-xs font-semibold uppercase">Valid</div>
          <div className="text-green-600 text-base font-semibold">{counts.Valid}</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">Expiring</div>
          <div className="text-amber-600 text-base font-semibold">{counts.Expiring}</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">Expired</div>
          <div className="text-red-600 text-base font-semibold">{counts.Expired}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-black text-sm font-semibold text-left">Documents</p>
        {COMPLIANCE_DOCS.map((doc) => (
          <div
            key={doc.name}
            className="bg-white rounded-xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] outline outline-offset-[-1px] outline-black/5 p-4 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-black/50" />
                </div>
                <span className="text-black text-sm font-medium truncate text-left">{doc.name}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-2xl outline-1 outline-offset-[-1px] text-xs font-medium shrink-0 ${COMPLIANCE_STATUS_STYLES[doc.status]}`}
              >
                {doc.status}
              </span>
            </div>
            <div className="h-px bg-black/10" />
            <div className="flex justify-between items-center">
              <span className="text-black/40 text-xs">{doc.number}</span>
              <span className="text-black/60 text-xs">Expires {doc.expiry}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BusDriven {
  busNumber: string;
  vehicleName: string;
  trips: number;
  distanceKm: number;
  lastDriven: string;
}

const BUSES_DRIVEN: BusDriven[] = [
  { busNumber: 'AS-1234-26', vehicleName: 'Mercedes-Benz Sprinter', trips: 142, distanceKm: 3280, lastDriven: 'Today, 7:01 AM' },
  { busNumber: 'AS-5678-26', vehicleName: 'Toyota Coaster', trips: 36, distanceKm: 860, lastDriven: '14 Feb 2026' },
];

const BusesDrivenView = () => {
  const totalTrips = BUSES_DRIVEN.reduce((sum, b) => sum + b.trips, 0);
  const totalDistance = BUSES_DRIVEN.reduce((sum, b) => sum + b.distanceKm, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center bg-neutral-50 rounded-2xl px-4 py-3 gap-0">
        <div className="flex flex-col gap-1.5 w-24">
          <div className="text-black/50 text-xs font-semibold uppercase">Vehicles</div>
          <div className="text-black text-base font-semibold">{BUSES_DRIVEN.length}</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">Total Trips</div>
          <div className="text-black text-base font-semibold">{totalTrips}</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">Distance</div>
          <div className="text-black text-base font-semibold">{totalDistance.toLocaleString()} km</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-black text-sm font-semibold text-left">Vehicle History</p>
        {BUSES_DRIVEN.map((bus) => (
          <div
            key={bus.busNumber}
            className="flex items-center gap-3 bg-white rounded-2xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] outline-1 outline-offset-[-1px] outline-black/5 p-3"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
              <Icon name="bus" size={18} color="#888" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-black text-sm font-medium truncate text-left">{bus.vehicleName}</p>
              <p className="text-black/40 text-xs truncate text-left">{bus.busNumber} · Last driven {bus.lastDriven}</p>
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <p className="text-black/70 text-sm font-medium">{bus.distanceKm.toLocaleString()} km</p>
              <p className="text-black/40 text-xs">{bus.trips} trips</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LogEntry {
  id: string;
  action: string;
  detail: string;
  time: string;
  date: string;
}

const DRIVER_LOGS: LogEntry[] = [
  { id: '1', action: 'Checked In', detail: 'Started shift on AS-1234-26', time: '7:01 AM', date: 'Today' },
  { id: '2', action: 'Trip Completed', detail: 'Brunei → KSB · 18 min', time: '7:24 AM', date: 'Today' },
  { id: '3', action: 'Break Started', detail: '15 min rest stop', time: '11:40 AM', date: 'Today' },
  { id: '4', action: 'Checked Out', detail: 'Ended shift on AS-1234-26', time: '5:12 PM', date: 'Yesterday' },
];

const LogsView = () => (
  <div className="flex flex-col gap-3">
    <p className="text-black text-sm font-semibold text-left">Activity Logs</p>
    <div className="flex flex-col">
      {DRIVER_LOGS.map((log, index) => (
        <div key={log.id} className="flex gap-3">
          <div className="flex flex-col items-center pt-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            {index < DRIVER_LOGS.length - 1 && <span className="w-px flex-1 bg-black/10 mt-1" />}
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] outline-1 outline-offset-[-1px] outline-black/5 p-3 mb-3">
            <div className="flex justify-between items-center mb-1 gap-2">
              <span className="text-black text-sm font-medium text-left">{log.action}</span>
              <span className="text-black/40 text-xs shrink-0">{log.time}</span>
            </div>
            <p className="text-black/50 text-xs text-left">{log.detail}</p>
            <p className="text-black/30 text-[10px] mt-1 text-left">{log.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface Complaint {
  id: string;
  title: string;
  detail: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Resolved';
  date: string;
}

const DRIVER_COMPLAINTS: Complaint[] = [
  { id: '1', title: 'Late Pickup', detail: 'Arrived 12 minutes late at KSB stop', severity: 'Medium', status: 'Resolved', date: '02 Mar 2026' },
  { id: '2', title: 'Reckless Driving', detail: 'Reported by passenger near Conti junction', severity: 'High', status: 'Open', date: '18 Feb 2026' },
];

const SEVERITY_BADGE_STYLES: Record<Complaint['severity'], string> = {
  High: 'bg-red-50 text-red-700 outline-red-200',
  Medium: 'bg-amber-50 text-amber-700 outline-amber-200',
  Low: 'bg-blue-50 text-blue-700 outline-blue-200',
};

const SEVERITY_BAR_STYLES: Record<Complaint['severity'], string> = {
  High: 'bg-red-400',
  Medium: 'bg-amber-300',
  Low: 'bg-blue-300',
};

const ComplaintsView = () => {
  const open = DRIVER_COMPLAINTS.filter((c) => c.status === 'Open').length;
  const resolved = DRIVER_COMPLAINTS.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center bg-neutral-50 rounded-2xl px-4 py-3 gap-0">
        <div className="flex flex-col gap-1.5 w-24">
          <div className="text-black/50 text-xs font-semibold uppercase">Total</div>
          <div className="text-black text-base font-semibold">{DRIVER_COMPLAINTS.length}</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">Open</div>
          <div className="text-red-600 text-base font-semibold">{open}</div>
        </div>
        <div className="w-px h-10 bg-black/10 mx-4" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="text-black/50 text-xs font-semibold uppercase">Resolved</div>
          <div className="text-black text-base font-semibold">{resolved}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-black text-sm font-semibold text-left">Complaints</p>
        {DRIVER_COMPLAINTS.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl outline-1 outline-offset-[-1px] outline-black/5 overflow-hidden relative p-4"
          >
            <div className={`w-[3px] h-full absolute left-0 top-0 rounded-l-2xl ${SEVERITY_BAR_STYLES[c.severity]}`} />
            <div className="flex justify-between items-start mb-2 gap-2">
              <span className="text-black text-sm font-semibold text-left">{c.title}</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-2xl outline-1 outline-offset-[-1px] text-[10px] font-medium shrink-0 ${SEVERITY_BADGE_STYLES[c.severity]}`}
              >
                {c.severity}
              </span>
            </div>
            <p className="text-black/50 text-xs mb-3 text-left">{c.detail}</p>
            <div className="w-full h-px bg-black/10 mb-3" />
            <div className="flex justify-between items-center">
              <span className="text-black/40 text-xs">{c.date}</span>
              <span className={`text-xs font-medium ${c.status === 'Open' ? 'text-red-600' : 'text-green-600'}`}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailPanel: React.FC<DetailPanelProps> = ({ entity, onClose, variant = 'vehicle', size = 'compact', onEdit, onAssign, onDelete, onBookVehicle, onLogExpense }) => {
  const tabs = variant === 'driver' ? DRIVER_TABS : VEHICLE_TABS;
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const moreActions: DropdownMenuItem[] = variant === 'driver' ? [
    { label: 'Edit Driver', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => onEdit?.() },
    { label: 'Assign Shuttle', icon: <Icon name="bus" size={14} color="#555" />, onClick: () => onAssign?.() },
    { label: 'Delete Driver', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => onDelete?.() },
  ] : [
    { label: 'Edit Vehicle', icon: <Icon name="edit" size={14} color="#555" />, onClick: () => onEdit?.() },
    { label: 'Assign Driver', icon: <Icon name="user" size={14} color="#555" />, onClick: () => onAssign?.() },
    { label: 'Delete Vehicle', icon: <Icon name="trash" size={14} color="#de3d36" />, destructive: true, onClick: () => onDelete?.() },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-6 right-6 bottom-6 z-50 bg-white rounded-3xl border-b border-black/5 shadow-xl overflow-hidden flex flex-col ${
          size === 'wide' ? 'w-[886px]' : 'w-100'
        }`}
      >
        {/* Header */}
        <div className="relative shrink-0 bg-neutral-50 px-5 pt-5">
          <div className="absolute right-4 top-2.5 flex items-center gap-2">
            <DropdownMenu
              items={moreActions}
              triggerClassName="w-9 h-9 rounded-full bg-white shadow-[0px_2px_6px_2px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
            />
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white shadow-[0px_2px_6px_2px_rgba(0,0,0,0.15)] flex items-center justify-center"
            >
              <X size={16} weight="bold" className="text-gray-700" />
            </button>
          </div>

          <p className="text-base font-bold text-black capitalize text-left mb-5">
            {entity.title}
            {entity.vehiclePlate && <span className="text-black/40 font-medium"> · {entity.vehiclePlate}</span>}
          </p>

          <nav className="flex items-center gap-5 border-b border-black/10 overflow-x-auto">
            {tabs.map((tab) => {
              const selected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 text-sm border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    selected ? 'border-green-600 text-black font-medium' : 'border-transparent text-black/50 font-normal'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
          {activeTab === 'schedules' ? (
            <SchedulesView size={size} vehiclePlate={entity.vehiclePlate} driverName={entity.driverName} />
          ) : activeTab === 'faults' ? (
            <FaultsView size={size} />
          ) : activeTab === 'expenses' ? (
            <ExpensesView />
          ) : activeTab === 'compliance' ? (
            <ComplianceView />
          ) : activeTab === 'buses-driven' ? (
            <BusesDrivenView />
          ) : activeTab === 'logs' ? (
            <LogsView />
          ) : activeTab === 'complaints' ? (
            <ComplaintsView />
          ) : activeTab === 'overview' && size === 'wide' ? (
            <>
              <div className="flex flex-wrap gap-4 items-start">
                <div className="flex-1 min-w-[320px] flex flex-col items-center gap-5 bg-white rounded-3xl shadow-[0px_4px_12px_-4px_rgba(12,12,13,0.10)] px-6 py-3.5">
                  <DriverIdentity entity={entity} onAssignDriver={() => onAssign?.()} />

                  <div className="w-full flex justify-between items-start">
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-sm text-black/50">Time Check In</p>
                      <p className="text-xs font-medium text-black">{entity.timeCheckIn ?? '—'}</p>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-sm text-black/50">Status</p>
                      <div className="pl-1.5 pr-2 py-0.5 bg-green-50 rounded-2xl outline outline-offset-[-1px] outline-green-200 inline-flex items-center gap-1">
                        <p className="text-xs font-medium text-green-700 leading-4">{entity.status}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-sm text-black/50">Last Updated</p>
                      <p className="text-xs font-medium text-black">{entity.lastUpdated ?? '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-[320px] h-56 bg-white rounded-2xl outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden flex items-center justify-center">
                  <img src={entity.imageUrl ?? DEFAULT_VEHICLE_IMAGE} alt={entity.title} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-start">
                <div className="flex-1 min-w-[320px] px-4 py-6 bg-white rounded-2xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex flex-col justify-start items-start gap-6">
                  <div className="self-stretch flex flex-col justify-start items-center gap-6">
                    {entity.details.map((row, index) => (
                      <div key={row.label} className="flex flex-col gap-4 self-stretch">
                        <div className="self-stretch flex justify-between items-center">
                          <div className="text-black/50 text-sm">{row.label}</div>
                          <div className="text-black text-sm font-medium">{row.value}</div>
                        </div>
                        {index < entity.details.length - 1 && (
                          <div className="self-stretch h-px bg-black/10" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {entity.detailsSecondary && (
                  <div className="flex-1 min-w-[320px] px-4 py-6 bg-white rounded-2xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-center gap-6">
                      {entity.detailsSecondary.map((row, index) => (
                        <div key={row.label} className="flex flex-col gap-4 self-stretch">
                          <div className="self-stretch flex justify-between items-center">
                            <div className="text-black/50 text-sm">{row.label}</div>
                            <div className="text-black text-sm font-medium">{row.value}</div>
                          </div>
                          {entity.detailsSecondary && index < entity.detailsSecondary.length - 1 && (
                            <div className="self-stretch h-px bg-black/10" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === 'overview' ? (
            <>
              <div className="flex flex-col items-center gap-5 bg-white rounded-3xl shadow-[0px_4px_12px_-4px_rgba(12,12,13,0.10)] px-6 py-3.5">
                <DriverIdentity entity={entity} onAssignDriver={() => onAssign?.()} />

                <div className="w-full flex justify-between items-start">
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-black/50">Time Check In</p>
                    <p className="text-xs font-medium text-black">{entity.timeCheckIn ?? '—'}</p>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-black/50">Status</p>
                    <div className="pl-1.5 pr-2 py-0.5 bg-green-50 rounded-2xl outline-1 outline-offset-[-1px] outline-green-200 inline-flex items-center gap-1">
                      <p className="text-xs font-medium text-green-700 leading-4">{entity.status}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-black/50">Last Updated</p>
                    <p className="text-xs font-medium text-black">{entity.lastUpdated ?? '—'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-full h-44 bg-white rounded-2xl shadow-[0px_16px_32px_-4px_rgba(12,12,13,0.10)] outline-1 outline-offset-[-1px] outline-gray-50 overflow-hidden flex items-center justify-center">
                  <img src={entity.imageUrl ?? DEFAULT_VEHICLE_IMAGE} alt={entity.title} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="w-full px-4 py-6 bg-white rounded-2xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex flex-col justify-start items-start gap-6">
                <div className="text-black text-base font-bold capitalize">Details</div>
                <div className="self-stretch flex flex-col justify-start items-center gap-6">
                  {entity.details.map((row, index) => (
                    <div key={row.label} className="flex flex-col gap-4 self-stretch">
                      <div className="self-stretch flex justify-between items-center">
                        <div className="text-black/50 text-sm">{row.label}</div>
                        <div className="text-black text-sm font-medium">{row.value}</div>
                      </div>
                      {index < entity.details.length - 1 && (
                        <div className="self-stretch h-px bg-black/10" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-400 text-sm">Coming soon</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {entity.ctaLabel && (
          <div className="shrink-0 bg-neutral-50 border-t border-black/10 px-3.5 py-4 flex items-center justify-between gap-3">
            {variant === 'vehicle' && size === 'wide' && (
              <button
                onClick={() => { onLogExpense?.(); }}
                className="px-2.5 py-3 bg-white rounded-lg shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] inline-flex items-center gap-2.5"
              >
                <Receipt size={16} className="text-black/60" />
                <span className="text-black/60 text-xs font-bold">Log Expense</span>
              </button>
            )}
            <button
              onClick={() => { onBookVehicle?.(); }}
              className={
                size === 'wide'
                  ? 'px-4 py-3 bg-green-600 rounded-lg shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] text-white text-sm font-semibold hover:bg-green-700 transition-colors'
                  : 'flex-1 p-4 bg-green-600 rounded-2xl text-white text-base font-semibold hover:bg-green-700 transition-colors'
              }
            >
              {entity.ctaLabel}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default DetailPanel;
