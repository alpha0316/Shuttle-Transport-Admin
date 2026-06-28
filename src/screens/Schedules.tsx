import { useState, useMemo } from 'react';
import { CalendarBlank, CaretLeft, CaretRight, MagnifyingGlass } from '@phosphor-icons/react';
import TopHeader from './../components/TopHeader';
import { StatCard, StatCardGroup } from '../components/StatCard';
import VehicleBookingCalendar, { type CalendarDay, type VehicleBooking } from '../components/VehicleBookingCalendar';
import { BookingDetailsModal } from '../components/BookingDetailsModal';
import { setPrefillVehicle, setPrefillDriver, setPrefillDate, triggerBookingForm } from '../lib/prefill';

interface Booking {
  id: string;
  month: string;
  date: number;
  name: string;
  destination: string;
  duration: string;
  amount: string;
  status: 'confirmed' | 'pending' | 'completed';
  vehicle: string;
  bookedBy: string;
  department: string;
  time: string;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 'BK-001', month: 'June', date: 7, name: 'KNUST Main Campus', destination: 'KSB', duration: '18 min', amount: '₵180', status: 'confirmed', vehicle: 'AS-1234-26', bookedBy: 'Kwame Mensah', department: 'Computer Engineering Dept', time: '7:00 AM' },
  { id: 'BK-002', month: 'June', date: 7, name: 'College of Science', destination: 'Commercial', duration: '24 min', amount: '₵240', status: 'completed', vehicle: 'AS-5678-26', bookedBy: 'Ama Asante', department: 'Student Affairs', time: '8:00 AM' },
  { id: 'BK-003', month: 'June', date: 8, name: 'Faculty of Law', destination: 'Conti', duration: '10 min', amount: '₵100', status: 'confirmed', vehicle: 'AS-3456-26', bookedBy: 'Yaw Asante', department: 'Faculty of Law', time: '9:00 AM' },
  { id: 'BK-004', month: 'June', date: 9, name: 'Engineering Dept.', destination: 'KSB', duration: '15 min', amount: '₵150', status: 'pending', vehicle: 'AS-2468-26', bookedBy: 'Linda Owusu', department: 'Engineering Dept', time: '10:00 AM' },
  { id: 'BK-005', month: 'June', date: 10, name: 'Medical School', destination: 'Pharmacy', duration: '12 min', amount: '₵120', status: 'confirmed', vehicle: 'AS-1357-26', bookedBy: 'Efua Adjei', department: 'Medical School', time: '11:00 AM' },
  { id: 'BK-006', month: 'June', date: 11, name: 'Business School', destination: 'KSB', duration: '24 min', amount: '₵240', status: 'completed', vehicle: 'AS-5678-26', bookedBy: 'Kojo Antwi', department: 'Business School', time: '12:00 PM' },
  { id: 'BK-007', month: 'June', date: 11, name: 'Sports Complex', destination: 'Conti', duration: '10 min', amount: '₵100', status: 'confirmed', vehicle: 'AS-5432-26', bookedBy: 'Abena Owusu', department: 'Sports Directorate', time: '1:00 PM' },
  { id: 'BK-008', month: 'June', date: 12, name: 'Science Faculty', destination: 'Main Library', duration: '14 min', amount: '₵140', status: 'confirmed', vehicle: 'AS-6789-26', bookedBy: 'Frederick Ession', department: 'Science Faculty', time: '2:00 PM' },
  { id: 'BK-009', month: 'June', date: 13, name: 'Pentecost Parish', destination: 'KSB', duration: '16 min', amount: '₵160', status: 'pending', vehicle: 'AS-1234-26', bookedBy: 'Elorm Seyram', department: 'Chaplaincy', time: '3:00 PM' },
  { id: 'BK-010', month: 'June', date: 14, name: 'SRC Event', destination: 'Commercial', duration: '20 min', amount: '₵200', status: 'confirmed', vehicle: 'AS-9012-26', bookedBy: 'Patricia Amoah', department: 'SRC', time: '4:00 PM' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const HOURS = ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];

function getWeekDates(offset: number) {
  const now = new Date();
  now.setDate(now.getDate() + offset * 7);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const dates: { day: number; month: number; year: number; full: Date }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push({ day: d.getDate(), month: d.getMonth(), year: d.getFullYear(), full: d });
  }
  return dates;
}

function parseAmount(amount: string) {
  return parseInt(amount.replace('₵', ''), 10);
}

function Schedules() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const today = new Date().getDate();
  const currentMonth = MONTHS[weekDates[3].month];
  const currentDay = weekDates[3];

  const filteredBookings = useMemo(() => {
    let d = MOCK_BOOKINGS;
    if (statusFilter !== 'all') d = d.filter(b => b.status === statusFilter);
    if (search) d = d.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
    if (fromDate) {
      const fromD = parseInt(fromDate.split('-')[2]);
      if (dateRange && toDate) {
        const toD = parseInt(toDate.split('-')[2]);
        d = d.filter(b => b.date >= fromD && b.date <= toD);
      } else {
        d = d.filter(b => b.date === fromD);
      }
    }
    return d;
  }, [search, statusFilter, fromDate, toDate, dateRange]);

  const kpi = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
    pending: filteredBookings.filter(b => b.status === 'pending').length,
    totalAmount: filteredBookings.reduce((sum, b) => sum + parseAmount(b.amount), 0),
  };

  const calendarDays: CalendarDay[] = useMemo(
    () =>
      weekDates.map((d, i) => ({
        label: d.full.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.day,
        isToday: weekOffset === 0 && i === weekDates.findIndex((w) => w.day === today),
      })),
    [weekDates, weekOffset, today]
  );

  const calendarBookings: VehicleBooking[] = useMemo(
    () =>
      filteredBookings.map((b, i) => ({
        id: b.id,
        title: b.name,
        dayIndex: i % 7,
        hourIndex: Math.max(0, HOURS.indexOf(b.time.replace(':00 ', '').replace(' ', ''))),
        dueBy: `Departs ${b.time}`,
        urgent: b.status === 'pending',
        bookedBy: b.bookedBy,
        department: b.department,
        destination: `${b.name} → ${b.destination}`,
        estimatedCost: parseAmount(b.amount),
        vehiclePlate: b.vehicle,
      })),
    [filteredBookings]
  );

  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(null);

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<CalendarBlank size={14} color="black" weight="duotone" />} title="Schedules" pageKey="schedules" />
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        <StatCardGroup>
          <StatCard label="TOTAL BOOKINGS" value={kpi.total} sub={`₵${kpi.totalAmount.toLocaleString()} total value`} />
          <StatCard label="CONFIRMED" value={kpi.confirmed} sub="Awaiting departure" accent="text-green-700" />
          <StatCard label="PENDING" value={kpi.pending} sub="Requires approval" accent="text-yellow-600" />
          <StatCard label="COMPLETED" value={filteredBookings.filter(b => b.status === 'completed').length} sub="Finished trips" />
        </StatCardGroup>

        {/* Filters + Month nav */}
        <div className="flex items-center gap-3 mt-6 mb-4">
          <div className="w-56 p-2 bg-neutral-50 rounded-3xl outline-1 outline-offset-[-1px] outline-black/5 flex items-center gap-1.5">
            <MagnifyingGlass size={14} className="text-black/40" weight="duotone" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="text-black/40 text-sm bg-transparent outline-none w-full placeholder:text-black/40" />
          </div>
          <StatusPill active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} label="All" />
          <StatusPill active={statusFilter === 'confirmed'} onClick={() => setStatusFilter('confirmed')} label="Confirmed" />
          <StatusPill active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} label="Pending" />

          {/* Date picker */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDateRange(!dateRange)}
              className={`px-2 py-1.5 rounded-full text-xs font-medium transition-colors ${dateRange ? 'bg-green-600 text-white' : 'bg-neutral-50 text-black/60 hover:bg-neutral-100'}`}
            >
              {dateRange ? 'Range' : 'Day'}
            </button>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1.5 bg-neutral-50 rounded-full text-xs text-black border border-black/5 [color-scheme:light]"
            />
            {dateRange && (
              <>
                <span className="text-black/40 text-xs">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2 py-1.5 bg-neutral-50 rounded-full text-xs text-black border border-black/5 [color-scheme:light]"
                />
              </>
            )}
            {(fromDate || toDate) && (
              <button
                onClick={() => { setFromDate(''); setToDate(''); }}
                className="text-black/40 text-xs hover:text-black/60"
              >
                Clear
              </button>
            )}
          </div>

          {/* Month/week nav */}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setWeekOffset(w => w - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-50"><CaretLeft size={14} /></button>
            <span className="text-black text-sm font-medium">
              {currentMonth} {currentDay?.year || ''} · Week {weekOffset === 0 ? '(Current)' : weekOffset > 0 ? `+${weekOffset}` : weekOffset}
            </span>
            <button onClick={() => setWeekOffset(w => w + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-50"><CaretRight size={14} /></button>
          </div>
        </div>

        {/* 7-day hourly calendar */}
        <div className="flex-1 min-h-[640px] flex flex-col">
          <VehicleBookingCalendar
            days={calendarDays}
            bookings={calendarBookings}
            visibleDays={7}
            onAddSchedule={({ dayIndex }) => {
              setPrefillVehicle(null);
              setPrefillDriver(null);
              const targetDate = weekDates[dayIndex]?.full;
              setPrefillDate(targetDate ? targetDate.toISOString().slice(0, 10) : null);
              triggerBookingForm();
            }}
            onBookingClick={(booking) => setSelectedBooking(booking)}
          />
        </div>
      </div>

      <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
}

function StatusPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active ? 'bg-green-600 text-white' : 'bg-neutral-50 text-black/60 hover:bg-neutral-100'
      }`}
    >
      {label}
    </button>
  );
}

export default Schedules;
