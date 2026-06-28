import { useState, useEffect } from 'react';
import { setBookingTrigger, setExpenseTrigger } from '../lib/prefill';
import { Plus, Receipt, MagnifyingGlass, Question, Bell, User, Bus } from '@phosphor-icons/react';
import { NewBookingForm } from './NewBookingForm';
import { LogExpenseForm } from './LogExpenseForm';
import { AddDriverForm } from './AddDriverForm';
import { AddVehicleForm } from './AddVehicleForm';
import { CommandPalette } from './CommandPalette';

interface TopHeaderProps {
  icon: React.ReactNode;
  title: string;
  pageKey?: string;
  onPrimaryAction?: () => void;
}

const PAGE_ACTIONS: Record<string, { label: string; icon: React.ReactNode }> = {
  drivers: { label: 'Add Driver', icon: <User size={14} weight="duotone" /> },
  Buses: { label: 'Add Vehicle', icon: <Bus size={14} weight="duotone" /> },
  busstops: { label: 'Add Route', icon: <Plus size={14} weight="duotone" /> },
  bookings: { label: 'New Booking', icon: <Plus size={14} weight="duotone" /> },
  attendance: { label: 'New Booking', icon: <Plus size={14} weight="duotone" /> },
  maintenance: { label: 'Log Expense', icon: <Receipt size={14} weight="duotone" /> },
};

const TopHeader: React.FC<TopHeaderProps> = ({
  icon,
  title,
  pageKey,
  onPrimaryAction = () => {},
}: TopHeaderProps) => {
  const [showBooking, setShowBooking] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const action = pageKey ? PAGE_ACTIONS[pageKey] : null;

  useEffect(() => {
    setBookingTrigger(() => setShowBooking(true));
    setExpenseTrigger(() => setShowExpense(true));
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between px-6 h-16 border-b border-black/10 w-full bg-white">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-black text-sm font-medium">{title}</p>
        </div>

        <div className="flex items-center gap-3">
          {action ? (
            <button
              onClick={() => {
                if (pageKey === 'drivers') { setShowAddDriver(true); }
                else if (pageKey === 'Buses') { setShowAddVehicle(true); }
                else { onPrimaryAction(); }
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 rounded-lg text-white text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              {action.icon}
              {action.label}
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowBooking(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 rounded-lg text-white text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                <Plus size={14} weight="duotone" />
                New Booking
              </button>
              <button
                onClick={() => setShowExpense(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-black/10 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Receipt size={14} weight="duotone" />
                Log Expense
              </button>
            </>
          )}

          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 bg-neutral-50 py-2 border border-black/10 rounded-lg w-48 hover:bg-neutral-100 transition-colors"
          >
            <MagnifyingGlass size={14} className="text-gray-400" />
            <span className="text-sm text-gray-400">Search...</span>
          </button>

          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
            <Question size={18} className="text-gray-500" />
          </button>

          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
            <Bell size={18} className="text-gray-500" />
          </button>
        </div>
      </nav>

      <NewBookingForm open={showBooking} onClose={() => setShowBooking(false)} />
      <LogExpenseForm open={showExpense} onClose={() => setShowExpense(false)} />
      <AddDriverForm open={showAddDriver} onClose={() => setShowAddDriver(false)} />
      <AddVehicleForm open={showAddVehicle} onClose={() => setShowAddVehicle(false)} />
      <CommandPalette open={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default TopHeader;
