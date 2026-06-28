import { useState } from 'react';
import { setNavigate } from './lib/prefill';
import {
  House, User, Bus, Signpost, ClipboardText, CalendarBlank, Ticket,
  HardHat, Wrench, Warning, CaretUp, CaretDown, CaretRight, SidebarSimple,
  List, DeviceMobile,
} from '@phosphor-icons/react';
import Dashboard from './screens/Dashboard';
import Drivers from './screens/Drivers';
import Buses from './screens/Buses';
import Busstops from './screens/Busstops';
import Profile from './screens/Profile';
import Attendance from './screens/Attendance';
import Schedules from './screens/Schedules';
import Bookings from './screens/Bookings';
import Workers from './screens/Workers';
import Maintenance from './screens/Maintenance';
import FaultReports from './screens/FaultReports';

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; weight?: 'fill' | 'regular' | 'duotone' }>;
}

interface NavSection {
  key: string;
  label: string;
  collapsible: boolean;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    key: 'overview',
    label: 'GENERAL',
    collapsible: false,
    items: [
      { key: 'dashboard', label: 'Overview', icon: House },
      { key: 'drivers', label: 'Drivers', icon: User },
      { key: 'Buses', label: 'Vehicles', icon: Bus },
      { key: 'attendance', label: 'Attendance', icon: ClipboardText },
    ],
  },
  {
    key: 'fleet-service',
    label: 'FLEET SERVICE',
    collapsible: true,
    items: [
      { key: 'schedules', label: 'Schedules', icon: CalendarBlank },
      { key: 'bookings', label: 'Bookings', icon: Ticket },
      { key: 'busstops', label: 'Shuttle Routes', icon: Signpost },
    ],
  },
  {
    key: 'maintenance',
    label: 'MAINTENANCE',
    collapsible: true,
    items: [
      { key: 'workers', label: 'Workers', icon: HardHat },
      { key: 'maintenance', label: 'Maintenance Overview', icon: Wrench },
      { key: 'faults', label: 'Fault & Accident Reports', icon: Warning },
    ],
  },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  setNavigate(setActiveTab);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'drivers': return <Drivers />;
      case 'Buses': return <Buses />;
      case 'busstops': return <Busstops />;
      case 'profile': return <Profile />;
      case 'attendance': return <Attendance />;
      case 'schedules': return <Schedules />;
      case 'bookings': return <Bookings />;
      case 'workers': return <Workers />;
      case 'maintenance': return <Maintenance />;
      case 'faults': return <FaultReports />;
      default: return <Dashboard />;
    }
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  };

  return (
    <>
      {/* Mobile screen-size gate */}
      <div className="sm:hidden h-screen w-screen flex flex-col items-center justify-center gap-4 px-8 text-center bg-white">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
          <DeviceMobile size={28} className="text-black/40" weight="duotone" />
        </div>
        <h2 className="text-black text-lg font-bold">Best Viewed on a Larger Screen</h2>
        <p className="text-black/50 text-sm max-w-xs">
          This dashboard is designed for use on a laptop, tablet, or desktop. Please switch to a larger device for the best experience.
        </p>
      </div>

      <div className="hidden sm:flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-9 h-9 flex items-center justify-center rounded-md bg-white border border-black/10 shadow-sm"
      >
        <List size={20} />
      </button>

      {/* Sidebar backdrop for mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`w-70 shrink-0 h-screen border-r border-black/10 flex flex-col bg-neutral-50 transition-transform duration-300 z-40
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 fixed top-0 left-0`}>
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-black text-lg font-bold">Shuttle App</p>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-black/10 text-black/40 hover:bg-zinc-50 transition-colors">
            <SidebarSimple size={14} />
          </button>
        </div>

        <div className="px-4 pb-4">
          <button className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-black/10 hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                T
              </div>
              <div className="flex flex-col items-start">
                <p className="text-black text-sm font-semibold leading-none">Transport Dept.</p>
                <p className="text-black/40 text-xs mt-1">Transport Engineer</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <CaretUp size={12} color="rgba(0,0,0,0.4)" weight="duotone" />
              <CaretDown size={12} color="rgba(0,0,0,0.4)" weight="duotone" />
            </div>
          </button>
        </div>

        <section className="flex-1 overflow-y-auto flex flex-col gap-5 px-4">
          {NAV_SECTIONS.map((section) => {
            const isCollapsed = section.collapsible && collapsedSections.has(section.key);
            return (
              <div key={section.key} className="flex flex-col gap-2">
                {section.collapsible ? (
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="flex items-center justify-between px-1 text-left"
                  >
                    <p className="text-black text-[13px] font-bold tracking-wide">{section.label}</p>
                    <CaretRight
                      size={14}
                      color="rgba(0,0,0,0.5)"
                      weight="duotone"
                      className={`transition-transform duration-200 ${!isCollapsed ? 'rotate-90' : ''}`}
                    />
                  </button>
                ) : (
                  <p className="text-black text-[13px] text-left font-bold tracking-wide px-1">{section.label}</p>
                )}

                {!isCollapsed && (
                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const selected = activeTab === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => { setActiveTab(item.key); setMobileSidebarOpen(false); }}
                          className={`flex items-center gap-3 px-2.5 py-2 rounded-lg w-full ${
                            selected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                          }`}
                        >
                          <Icon size={15} color={selected ? '#16a34a' : 'rgba(0,0,0,0.45)'} weight="duotone" />
                          <p className={`text-sm ${selected ? 'text-green-600 font-medium' : 'text-black/70 font-normal'}`}>
                            {item.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-3 px-4 py-4 text-left ${
            activeTab === 'profile' ? 'bg-zinc-100' : ''
          }`}
        >
          <div className="relative w-9 h-9 shrink-0">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="flex flex-col items-start">
            <p className="text-black text-sm font-medium leading-none">Essandoh Prince</p>
            <p className="text-black/40 text-xs mt-1">princeessandoh316@gmail.com</p>
          </div>
        </button>
      </aside>

      <div className="flex-1 overflow-y-auto">{renderTab()}</div>
      </div>
    </>
  );
};

export default App;
