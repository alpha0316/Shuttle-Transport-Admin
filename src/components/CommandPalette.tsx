import { useState, useMemo, useEffect, useRef } from 'react';
import { MagnifyingGlass, User, Bus, Signpost, CalendarBlank, Warning, HardHat, ClipboardText, Plus, Receipt } from '@phosphor-icons/react';
import { MOCK_DRIVER_DATA, MOCK_VEHICLE_DATA, MOCK_FAULT_REPORT_DATA } from '../mockData/index';
import { setPrefillVehicle, navigateTo, triggerBookingForm, triggerExpenseForm } from '../lib/prefill';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.metaKey && e.key === 'k') { e.preventDefault(); onClose(); }
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const items: SearchResult[] = [];

    items.push({ id: 'nav-drivers', label: 'Drivers', subtitle: 'Manage driver records', icon: <User size={16} />, action: () => navigateTo('drivers'), category: 'Pages' });
    items.push({ id: 'nav-vehicles', label: 'Vehicles', subtitle: 'Manage vehicles', icon: <Bus size={16} />, action: () => navigateTo('Buses'), category: 'Pages' });
    items.push({ id: 'nav-routes', label: 'Shuttle Routes', subtitle: 'Manage routes', icon: <Signpost size={16} />, action: () => navigateTo('busstops'), category: 'Pages' });
    items.push({ id: 'nav-schedules', label: 'Schedules', subtitle: 'View bookings', icon: <CalendarBlank size={16} />, action: () => navigateTo('schedules'), category: 'Pages' });
    items.push({ id: 'nav-faults', label: 'Fault Reports', subtitle: 'View fault reports', icon: <Warning size={16} />, action: () => navigateTo('faults'), category: 'Pages' });
    items.push({ id: 'nav-workers', label: 'Workers', subtitle: 'Maintenance crew', icon: <HardHat size={16} />, action: () => navigateTo('workers'), category: 'Pages' });
    items.push({ id: 'nav-attendance', label: 'Attendance', subtitle: 'Worker attendance', icon: <ClipboardText size={16} />, action: () => navigateTo('attendance'), category: 'Pages' });

    MOCK_DRIVER_DATA.filter(d => d.name.toLowerCase().includes(q) || d.phone.includes(q)).forEach(d => {
      items.push({ id: `driver-${d.id}`, label: d.name, subtitle: `${d.phone} · ${d.route}`, icon: <User size={16} color="#16a34a" />, action: () => navigateTo('drivers'), category: 'Drivers' });
    });

    MOCK_VEHICLE_DATA.filter(v => v.plateNumber.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)).forEach(v => {
      items.push({ id: `veh-${v.id}`, label: `${v.plateNumber} — ${v.model}`, subtitle: `${v.capacity} seats · ${v.status}`, icon: <Bus size={16} color="#3b82f6" />, action: () => { setPrefillVehicle(v.plateNumber); navigateTo('dashboard'); }, category: 'Vehicles' });
    });

    MOCK_FAULT_REPORT_DATA.filter(r => r.vehicle.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q) || r.damages.toLowerCase().includes(q)).forEach(r => {
      items.push({ id: `fault-${r.id}`, label: r.vehicle, subtitle: `${r.damages} · ${r.status}`, icon: <Warning size={16} color="#ef4444" />, action: () => navigateTo('faults'), category: 'Fault Reports' });
    });

    return items.slice(0, 20);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[520px] max-h-[60vh] bg-white rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5">
          <MagnifyingGlass size={18} className="text-black/40 shrink-0" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search drivers, vehicles, faults..." className="text-base text-black placeholder:text-black/30 outline-none bg-transparent w-full" autoFocus />
          <kbd className="text-[10px] text-black/30 bg-neutral-100 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
        </div>

        <div className="overflow-y-auto flex-1">
          {!query.trim() ? (
            <div className="p-4 flex flex-col gap-1">
              <p className="text-xs text-black/40 mb-3 text-left">Quick actions</p>
              <button onClick={() => { triggerBookingForm(); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0"><Plus size={16} color="#16a34a" /></div>
                <div><span className="text-sm font-medium text-black">New Booking</span><p className="text-xs text-black/40">Book a shuttle for a trip</p></div>
              </button>
              <button onClick={() => { triggerExpenseForm(); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><Receipt size={16} color="#d97706" /></div>
                <div><span className="text-sm font-medium text-black">Log Expense</span><p className="text-xs text-black/40">Record a maintenance cost</p></div>
              </button>
              <button onClick={() => { navigateTo('drivers'); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0"><User size={16} color="#2563eb" /></div>
                <div><span className="text-sm font-medium text-black">Add Driver</span><p className="text-xs text-black/40">Register a new driver</p></div>
              </button>
              <button onClick={() => { navigateTo('schedules'); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0"><CalendarBlank size={16} color="#7c3aed" /></div>
                <div><span className="text-sm font-medium text-black">View Schedules</span><p className="text-xs text-black/40">Check booking calendar</p></div>
              </button>
              <button onClick={() => { navigateTo('faults'); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0"><Warning size={16} color="#dc2626" /></div>
                <div><span className="text-sm font-medium text-black">Report Fault</span><p className="text-xs text-black/40">Log a vehicle issue</p></div>
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sm text-black/40">No results found.</div>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => { r.action(); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  {r.icon}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-black">{r.label}</span>
                  <span className="text-xs text-black/50">{r.subtitle}</span>
                </div>
                <span className="text-[10px] text-black/30 bg-neutral-50 px-1.5 py-0.5 rounded shrink-0">{r.category}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
