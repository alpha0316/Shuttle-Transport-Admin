import React, { useState } from 'react';
import { Plus, FileText, X, User, Gauge, CircleDashed, Signpost, DotsThree } from '@phosphor-icons/react';
import StatusBadge from './StatusBadge';
import { FilterBar } from './FilterBar';
import DetailPanel, { type DetailPanelEntity } from './DetailPanel';

interface Driver {
  id: number;
  name: string;
  speed: string;
  status: string;
  route: string;
  statusColor: 'green' | 'red' | 'yellow';
}

interface NewBusData {
  phone: string | number | readonly string[] | undefined;
  name: string;
  driver: string;
  route: string;
  initialStatus: string;
}

interface CustomTableProps {
  data?: Driver[];
  title?: string;
  onCreateNew?: (busData: NewBusData) => void;
  onView?: (driver: Driver) => void;
  onRemove?: (driver: Driver) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({ 
  data = [
    {
      id: 1,
      name: 'Olivia Rhye',
      speed: '45 km/h',
      status: 'Active',
      route: 'Brunei -> KSB',
      statusColor: 'green' as const
    },
    {
      id: 2,
      name: 'Phoenix Baker',
      speed: '52 km/h',
      status: 'Active',
      route: 'Brunei -> KSB',
      statusColor: 'green' as const
    },
    {
      id: 3,
      name: 'Lana Steiner',
      speed: '0 km/h',
      status: 'Offline',
      route: 'Commercial -> KSB',
      statusColor: 'red' as const
    },
    {
      id: 4,
      name: 'Demi Wilkinson',
      speed: '38 km/h',
      status: 'Break',
      route: 'Gaza -> Pharmacy',
      statusColor: 'yellow' as const
    },
    {
      id: 5,
      name: 'Candice Wu',
      speed: '41 km/h',
      status: 'Active',
      route: 'Commercial -> KSB',
      statusColor: 'green' as const
    }
  ],
  title = "Drivers",
  onCreateNew = () => console.log('Create new clicked'),
  onView = (driver: Driver) => console.log('View driver:', driver),
  onRemove = (driver: Driver) => console.log('Remove driver:', driver)
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const drivers = data.filter((driver) => {
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q === '' || driver.name.toLowerCase().includes(q) || driver.route.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const [selectedDrivers, setSelectedDrivers] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBusData, setNewBusData] = useState<NewBusData>({
    name: '',
    driver: '',
    phone: '',
    route: 'Brunei - KSB',
    initialStatus: 'Active'
  });

  // Available routes for the dropdown
  const availableRoutes = [
    'Brunei - KSB',
    'Commercial - KSB',
    'Gaza - Pharmacy Bus stop',
  ];

  // Modal handlers
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewBusData({
      name: '',
      driver: '',
      phone: '',
      route: 'Brunei - KSB',
      initialStatus: 'Active'
    });
  };

  const handleCreateBus = () => {
    if (newBusData.name.trim() && newBusData.driver.trim() && newBusData.route.trim() ) {
      onCreateNew(newBusData);
      closeModal();
    }
  };

  const handleInputChange = (field: keyof NewBusData, value: string) => {
    setNewBusData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDriver = (driverId: number) => {
    const newSelected = new Set(selectedDrivers);
    if (newSelected.has(driverId)) {
      newSelected.delete(driverId);
    } else {
      newSelected.add(driverId);
    }
    setSelectedDrivers(newSelected);
  };

  const toggleAllDrivers = () => {
    if (selectedDrivers.size === drivers.length) {
      setSelectedDrivers(new Set());
    } else {
      setSelectedDrivers(new Set(drivers.map(d => d.id)));
    }
  };

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <main className='w-full max-w-7xl mx-auto my-10 flex flex-col items-start justify-start rounded-xl border border-black/10 bg-white shadow-sm'>
      {/* Header */}
      <header className='px-6 py-5 items-center justify-between max-w-full border-b border-black/10 flex w-full'>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-gray-900 text-lg font-semibold'>{title}</p>
          <div className='text-violet-700 text-sm font-medium px-2 py-0.5 bg-purple-50 rounded-2xl  outline-1 outline-offset-[-1px] outline-gray-200'>
            {drivers.length} {title}
          </div>
        </div>

        <button 
          onClick={openModal}
          className='px-3 py-2 bg-green-600 rounded-lg inline-flex justify-center items-center text-white hover:bg-green-700 transition-colors duration-200 text-sm font-medium'
        >
          <Plus size={16} weight="duotone" />
          Create New {title.slice(0, -1)}
        </button>
      </header>

      <FilterBar
        searchPlaceholder="Search drivers"
        onSearch={setSearchQuery}
        filterLabel={statusFilter === 'all' ? 'All Drivers' : statusFilter}
        filterOptions={[
          { label: 'All Drivers', value: 'all' },
          { label: 'Active', value: 'Active' },
          { label: 'Offline', value: 'Offline' },
          { label: 'Break', value: 'Break' },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Table Header */}
      <section className='grid grid-cols-[2.2fr_0.8fr_0.9fr_1.2fr_0.8fr] gap-6 items-center w-full px-6 py-3 border-b border-black/10 bg-gray-50'>
        <div className='flex gap-3 items-center min-w-0'>
          <input
            type="checkbox"
            checked={selectedDrivers.size === drivers.length && drivers.length > 0}
            onChange={toggleAllDrivers}
            className="w-4 h-4 rounded border border-zinc-300 text-green-600 focus:ring-green-500"
          />
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold leading-none text-left"><User size={12} />Driver Name</p>
        </div>

        <div className='flex gap-1 items-center min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold leading-none text-left"><Gauge size={12} />Speed</p>
        </div>

        <div className='flex gap-1 items-center min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold leading-none text-left"><CircleDashed size={12} />Status</p>
        </div>

        <div className='flex gap-1 items-center min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold leading-none text-left"><Signpost size={12} />Route</p>
        </div>

        <div className='flex gap-1 items-center min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold leading-none text-left"><DotsThree size={12} />Actions</p>
        </div>
      </section>

      {/* Table Rows */}
      {drivers.length === 0 ? (
        <div className="flex items-center justify-center py-12 w-full">
          <div className="text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" weight="duotone" />
            <p className="text-gray-500 text-sm">No drivers found</p>
            <button 
              onClick={openModal}
              className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Add your first driver
            </button>
          </div>
        </div>
      ) : (
        drivers.map((driver, index) => (
          <section
            key={driver.id}
            onClick={() => { setSelectedDriver(driver); onView(driver); }}
            className={`grid grid-cols-[2.2fr_0.8fr_0.9fr_1.2fr_0.8fr] gap-6 items-center w-full min-h-16 px-6 py-3 cursor-pointer ${index < drivers.length - 1 ? 'border-b border-black/10' : ''} ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            } hover:bg-gray-100 transition-colors duration-150`}
          >
            <div className='flex gap-3 items-center min-w-0' onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedDrivers.has(driver.id)}
                onChange={() => toggleDriver(driver.id)}
                className="w-4 h-4 rounded border border-zinc-300 text-green-600 focus:ring-green-500"
              />
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold shrink-0 ${getAvatarColor(driver.name)}`}>
                {getInitials(driver.name)}
              </div>
              <div className="flex flex-col items-start min-w-0">
                <p className="text-gray-900 text-base font-bold leading-none truncate w-full">{driver.name}</p>
                <p className="text-gray-400 text-sm mt-1.5 truncate w-full">Bus Number: {driver.id.toString().padStart(3, '0')}</p>
              </div>
            </div>

            <div className='flex gap-1 items-center min-w-0'>
              <p className="text-gray-600 text-sm leading-none font-medium truncate">{driver.speed}</p>
            </div>

            <div className='flex gap-1 items-center min-w-0'>
              <StatusBadge status={driver.status} />
            </div>

            <div className='flex gap-1 items-center min-w-0'>
              <p className="text-gray-600 text-sm leading-none truncate">{driver.route}</p>
            </div>

            <div className='flex gap-2 items-center min-w-0' onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => { setSelectedDriver(driver); onView(driver); }}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                View
              </button>
              <button
                onClick={() => onRemove(driver)}
                className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </section>
        ))
      )}

      {/* Footer with selection info */}
      {selectedDrivers.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 w-full flex items-center justify-between">
          <p className="text-blue-700 text-sm font-medium">
            {selectedDrivers.size} driver{selectedDrivers.size > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors text-sm">
              Export Selected
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 text-left">Add New Bus</h2>
                  <p className="text-sm text-gray-600 mt-1 text-left">Enter the details for the new bus</p>
                </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} weight="duotone" />
                  </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={newBusData.driver}
                  onChange={(e) => handleInputChange('driver', e.target.value)}
                  placeholder="e.g., Mr Kwame Agyei"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newBusData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g., 024 -"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Bus Number
                </label>
                <input
                  type="text"
                  value={newBusData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., AS-1234-26"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Route
                </label>
                <select
                  value={newBusData.route}
                  onChange={(e) => handleInputChange('route', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  {availableRoutes.map((route) => (
                    <option key={route} value={route}>
                      {route}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Initial Status
                </label>
                <select
                  value={newBusData.initialStatus}
                  onChange={(e) => handleInputChange('initialStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Break">Break</option>
                  <option value="Offline">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBus}
                disabled={!newBusData.name.trim() || !newBusData.driver.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Bus
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDriver && (
        <DetailPanel
          entity={{
            title: `Driver ${selectedDriver.id.toString().padStart(3, '0')}`,
            driverName: selectedDriver.name,
            driverId: `Bus Number: ${selectedDriver.id.toString().padStart(3, '0')}`,
            status: selectedDriver.status,
            timeCheckIn: '07:01AM',
            details: [
              { label: 'Route', value: selectedDriver.route },
              { label: 'Speed', value: selectedDriver.speed },
              { label: 'Date Added', value: '25th Feb 2026' },
            ],
          } satisfies DetailPanelEntity}
          variant="driver"
          onClose={() => setSelectedDriver(null)}
        />
      )}
    </main>
  );
};

export default CustomTable;