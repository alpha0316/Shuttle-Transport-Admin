import { useMemo } from 'react';
import { Buildings, MapPin, Plus } from '@phosphor-icons/react';

const HOURS = ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];
const OFF_HOURS_START_INDEX = 10; // 5PM onward shaded as outside business hours
const ROW_HEIGHT = 150;
const HEADER_HEIGHT = 44;
const TIME_GUTTER = 48;
const VISIBLE_DAYS = 5;

export interface CalendarDay {
  label: string;
  date: number;
  isToday?: boolean;
}

const DAYS: CalendarDay[] = [
  { label: 'Mon', date: 13 },
  { label: 'Tue', date: 14, isToday: true },
  { label: 'Wed', date: 15 },
  { label: 'Thu', date: 16 },
  { label: 'Fri', date: 17 },
  { label: 'Sat', date: 18 },
  { label: 'Sun', date: 19 },
];

export interface VehicleBooking {
  id: string;
  title: string;
  dayIndex: number;
  hourIndex: number;
  dueBy: string;
  urgent: boolean;
  bookedBy: string;
  department: string;
  destination: string;
  estimatedCost: number;
  vehiclePlate?: string;
}

const VEHICLE_BOOKINGS: VehicleBooking[] = [
  { id: '1', title: 'KNUST Campus Run', dayIndex: 0, hourIndex: 2, dueBy: 'Departs 10 AM', urgent: true, bookedBy: 'Kwame Owusu', department: 'Computer Engineering Dept', destination: 'Main Library', estimatedCost: 400 },
  { id: '2', title: 'Conti → SRC Shuttle', dayIndex: 2, hourIndex: 3, dueBy: 'Departs 11 AM', urgent: false, bookedBy: 'Ama Boateng', department: 'Student Affairs', destination: 'SRC Hostel', estimatedCost: 400 },
  { id: '3', title: 'Engineering Dept Errand', dayIndex: 5, hourIndex: 4, dueBy: 'Departs 12 PM', urgent: false, bookedBy: 'Yaw Asante', department: 'Engineering Dept', destination: 'Hall 7', estimatedCost: 400 },
];

const BookingCard = ({ booking, onClick }: { booking: VehicleBooking; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`group relative bg-white border border-black/5 rounded-lg shadow-[0px_16px_32px_-4px_rgba(12,12,13,0.10)] overflow-hidden h-full flex flex-col p-3 gap-2 m-1 ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[16px] ${booking.urgent ? 'bg-[#FF3B30]' : 'bg-[#34C759]'}`} />

    <div
      className="absolute top-1.5 right-1.5 bg-black text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
    >
      ₵{booking.estimatedCost}
    </div>

    <div className="flex flex-col gap-1 pl-1.5">
      <div className="flex items-center gap-1">
        <Buildings size={12} className="text-black/50" />
        <span className="text-[10px] text-black/50">Booked By</span>
      </div>
      <div className="flex flex-col min-w-0 text-left">
        <span className="text-xs text-black/70 truncate">{booking.bookedBy}</span>
        <span className="text-[10px] text-black/40 truncate">{booking.department}</span>
      </div>
    </div>

    <div className="mt-auto flex flex-col gap-1.5 pl-1.5">
      <div className="h-px bg-black/10" />
      <div className="flex items-center gap-1">
        <MapPin size={12} className="text-black/50 shrink-0" />
        <span className="text-[10px] text-black/70 truncate">{booking.destination}</span>
      </div>
    </div>
  </div>
);

const NowIndicator = () => {
  const offset = useMemo(() => {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    if (hour < 7 || hour >= 21) return null;
    return HEADER_HEIGHT + (hour - 7) * ROW_HEIGHT;
  }, []);

  if (offset === null) return null;

  const label = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="absolute left-0 right-0 z-10 pointer-events-none flex items-center" style={{ top: offset }}>
      <span
        className="bg-[#ED3237] text-white text-[8px] rounded-full px-1.5 py-0.5 -translate-y-1/2 shrink-0"
        style={{ marginLeft: TIME_GUTTER - 8 }}
      >
        {label}
      </span>
      <div className="h-px bg-[#ED3237] flex-1" />
    </div>
  );
};

interface VehicleBookingCalendarProps {
  days?: CalendarDay[];
  bookings?: VehicleBooking[];
  visibleDays?: number;
  onAddSchedule?: (info: { dayIndex: number; hourIndex: number; day: CalendarDay }) => void;
  onBookingClick?: (booking: VehicleBooking) => void;
}

const VehicleBookingCalendar = ({ days = DAYS, bookings = VEHICLE_BOOKINGS, visibleDays = VISIBLE_DAYS, onAddSchedule, onBookingClick }: VehicleBookingCalendarProps) => {
  const occupied = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => set.add(`${b.dayIndex}-${b.hourIndex}`));
    return set;
  }, [bookings]);

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-auto flex-1 min-h-0">
      <div
        className="relative"
        style={{
          display: 'grid',
          gridTemplateColumns: `${TIME_GUTTER}px repeat(${days.length}, calc((100% - ${TIME_GUTTER}px) / ${visibleDays}))`,
        }}
      >
        {/* Header row */}
        <div className="h-11 sticky top-0 z-20 bg-[#f4f4f4] border-b border-black/5" style={{ gridColumn: 1, gridRow: 1 }} />
        {days.map((day, i) => (
          <div
            key={day.label}
            className="h-11 min-w-0 sticky top-0 z-20 bg-[#f4f4f4] flex items-center justify-center gap-1.5 border-b border-l border-black/5 text-sm"
            style={{ gridColumn: i + 2, gridRow: 1 }}
          >
            <span className={day.isToday ? 'font-semibold text-black' : 'text-black/50'}>{day.label}</span>
            {day.isToday ? (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-xs font-medium shrink-0">
                {day.date}
              </span>
            ) : (
              <span className="text-black/50">{day.date}</span>
            )}
          </div>
        ))}

        {/* Hour labels */}
        {HOURS.map((hourLabel, hourIndex) => (
          <div
            key={`time-${hourLabel}`}
            className="relative -translate-y-1/2 text-[8px] font-medium text-black/40 px-1"
            style={{ gridColumn: 1, gridRow: hourIndex + 2 }}
          >
            {hourLabel}
          </div>
        ))}

        {/* Grid cells */}
        {HOURS.map((_, hourIndex) =>
          days.map((day, dayIndex) => {
            const isOccupied = occupied.has(`${dayIndex}-${hourIndex}`);
            return (
              <div
                key={`cell-${hourIndex}-${dayIndex}`}
                onClick={!isOccupied && onAddSchedule ? () => onAddSchedule({ dayIndex, hourIndex, day }) : undefined}
                className={`group/cell relative min-w-0 border-l border-t border-black/5 ${hourIndex >= OFF_HOURS_START_INDEX ? 'bg-neutral-50' : 'bg-white'} ${!isOccupied && onAddSchedule ? 'cursor-pointer' : ''}`}
                style={{ gridColumn: dayIndex + 2, gridRow: hourIndex + 2, height: ROW_HEIGHT }}
              >
                {!isOccupied && onAddSchedule && (
                  <div className="absolute inset-0 hidden group-hover/cell:flex items-center justify-center bg-[#f5f5f5]">
                    <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-black/5 shadow-sm text-xs font-medium text-black/60">
                      <Plus size={12} weight="bold" />
                      Add Schedule
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Bookings */}
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="min-w-0"
            style={{ gridColumn: booking.dayIndex + 2, gridRow: booking.hourIndex + 2, height: ROW_HEIGHT }}
          >
            <BookingCard booking={booking} onClick={onBookingClick ? () => onBookingClick(booking) : undefined} />
          </div>
        ))}

        <NowIndicator />
      </div>
    </div>
  );
};

export default VehicleBookingCalendar;
