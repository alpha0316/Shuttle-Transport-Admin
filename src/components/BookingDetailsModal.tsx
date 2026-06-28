import { Modal } from './Modal';
import { Buildings, MapPin, Clock, Bus } from '@phosphor-icons/react';
import type { VehicleBooking } from './VehicleBookingCalendar';

interface BookingDetailsModalProps {
  booking: VehicleBooking | null;
  onClose: () => void;
}

export function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  return (
    <Modal open={!!booking} onClose={onClose} title={booking?.title ?? 'Booking'} width="w-[420px]">
      {booking && (
        <div className="flex flex-col gap-4 pb-5">
          <span className={`self-start px-2.5 py-1 rounded-full text-xs font-medium ${booking.urgent ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {booking.urgent ? 'Urgent' : 'Scheduled'}
          </span>

          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
              <Buildings size={16} className="text-black/50" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-black/40">Booked By</span>
              <span className="text-sm font-medium text-black truncate">{booking.bookedBy}</span>
              <span className="text-xs text-black/50 truncate">{booking.department}</span>
            </div>
          </div>

          {booking.vehiclePlate && (
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                <Bus size={16} className="text-black/50" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-black/40">Vehicle</span>
                <span className="text-sm font-medium text-black truncate">{booking.vehiclePlate}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-black/50" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-black/40">Destination</span>
              <span className="text-sm font-medium text-black truncate">{booking.destination}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
              <Clock size={16} className="text-black/50" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-black/40">Schedule</span>
              <span className="text-sm font-medium text-black truncate">{booking.dueBy}</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 pt-2 border-t border-black/10">
            <span className="text-sm text-black/50">Estimated Cost</span>
            <span className="text-base font-semibold text-black">₵{booking.estimatedCost.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
