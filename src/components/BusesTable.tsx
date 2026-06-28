import React, { useState, useRef } from 'react';
import { Plus, Bus, X, Image, Tag, User, CircleDashed, Signpost, DotsThree } from '@phosphor-icons/react';
import StatusBadge from './StatusBadge';
import { FilterBar } from './FilterBar';
import DetailPanel, { type DetailPanelEntity } from './DetailPanel';

interface Bus {
  id: string;
  busNumber: string;
  vehicleName: string;
  driverName: string;
  speed: number;
  status: 'Active' | 'Inactive' | 'Maintenance';
  route: string;
  lastUpdated: string;
  capacity: number;
  currentPassengers: number;
  imageUrl?: string;
}

interface NewBusData {
  busNumber: string;
  vehicleName: string;
  driverName: string;
  driverPhone: string;
  route: string;
  capacity: number;
  initialStatus: 'Active' | 'Inactive' | 'Maintenance';
  imageFile?: File;
}

interface BusTableProps {
  data?: Bus[];
  title?: string;
  onCreateNew?: (busData: NewBusData) => void;
  onView?: (bus: Bus) => void;
  onRemove?: (bus: Bus) => void;
}

const BusTable: React.FC<BusTableProps> = ({ 
  data = [
    {
      id: 'BUS001',
      busNumber: 'AS-1234-26',
      vehicleName: 'Mercedes-Benz Sprinter',
      driverName: 'Kwame Mensah',
      speed: 45,
      status: 'Active',
      route: 'Brunei -> KSB',
      lastUpdated: '2 mins ago',
      capacity: 40,
      currentPassengers: 28,
      imageUrl: '/api/placeholder/40/40'
    },
    {
      id: 'BUS002',
      busNumber: 'AS-5678-26',
      vehicleName: 'Toyota Coaster',
      driverName: 'Ama Asante',
      speed: 38,
      status: 'Active',
      route: 'Commercial -> KSB',
      lastUpdated: '5 mins ago',
      capacity: 40,
      currentPassengers: 35,
      imageUrl: '/api/placeholder/40/40'
    },
    {
      id: 'BUS003',
      busNumber: 'AS-9012-26',
      vehicleName: 'Ford Transit',
      driverName: 'Kofi Owusu',
      speed: 0,
      status: 'Maintenance',
      route: 'Gaza -> Pharmacy',
      lastUpdated: '1 hour ago',
      capacity: 40,
      currentPassengers: 0,
      imageUrl: '/api/placeholder/40/40'
    },
    {
      id: 'BUS004',
      busNumber: 'AS-3456-26',
      vehicleName: 'Nissan Civilian',
      driverName: 'Yaa Boateng',
      speed: 42,
      status: 'Active',
      route: 'Brunei -> KSB',
      lastUpdated: '3 mins ago',
      capacity: 40,
      currentPassengers: 22,
      imageUrl: '/api/placeholder/40/40'
    },
    {
      id: 'BUS005',
      busNumber: 'AS-7890-26',
      vehicleName: 'Hyundai County',
      driverName: 'Kwesi Adomako',
      speed: 0,
      status: 'Inactive',
      route: 'Commercial -> KSB',
      lastUpdated: '45 mins ago',
      capacity: 40,
      currentPassengers: 0,
      imageUrl: '/api/placeholder/40/40'
    }
  ],
  title = "Shuttle Buses",
  onCreateNew = () => console.log('Create new clicked'),
  onView = (bus: Bus) => console.log('View bus:', bus),
  onRemove = (bus: Bus) => console.log('Remove bus:', bus)
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const buses = data.filter((bus) => {
    const matchesStatus = statusFilter === 'all' || bus.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q === '' || bus.busNumber.toLowerCase().includes(q) ||
      bus.vehicleName.toLowerCase().includes(q) || bus.driverName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const [selectedBuses, setSelectedBuses] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBusData, setNewBusData] = useState<NewBusData>({
    busNumber: '',
    vehicleName: '',
    driverName: '',
    driverPhone: '',
    route: 'Brunei - KSB',
    capacity: 40,
    initialStatus: 'Active'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const availableRoutes = [
    'Brunei - KSB',
    'Commercial - KSB',
    'Gaza - Pharmacy Bus stop',
  ];

  // Common vehicle names for suggestions
  const commonVehicleNames = [
    'Mercedes-Benz Sprinter',
    'Toyota Coaster',
    'Ford Transit',
    'Nissan Civilian',
    'Hyundai County',
    'Isuzu Journey',
    'Mitsubishi Rosa',
    'Volkswagen Transporter',
    'Fiat Ducato',
    'Iveco Daily'
  ];

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setNewBusData({
      busNumber: '',
      vehicleName: '',
      driverName: '',
      driverPhone: '',
      route: 'Brunei - KSB',
      capacity: 40,
      initialStatus: 'Active'
    });
    setImagePreview(null);
    setIsUploading(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // Store file in form data
      setNewBusData(prev => ({
        ...prev,
        imageFile: file
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    setNewBusData(prev => ({
      ...prev,
      imageFile: undefined
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateBus = () => {
    if (newBusData.busNumber.trim() && newBusData.vehicleName.trim() && newBusData.driverName.trim()) {
      onCreateNew(newBusData);
      closeModal();
    }
  };

  const handleInputChange = (field: keyof NewBusData, value: string | number) => {
    setNewBusData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleBus = (busId: string) => {
    const newSelected = new Set(selectedBuses);
    if (newSelected.has(busId)) {
      newSelected.delete(busId);
    } else {
      newSelected.add(busId);
    }
    setSelectedBuses(newSelected);
  };

  const toggleAllBuses = () => {
    if (selectedBuses.size === buses.length) {
      setSelectedBuses(new Set());
    } else {
      setSelectedBuses(new Set(buses.map(b => b.id)));
    }
  };

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);


  const BusAvatar: React.FC<{ bus: Bus; size?: 'sm' | 'md' | 'lg' }> = ({ bus, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    if (bus.imageUrl) {
      return (
        <img
          src={bus.imageUrl}
          alt={`Bus ${bus.busNumber}`}
          className={`${sizeClasses[size]} rounded-lg object-cover border border-gray-200`}
        />
      );
    }

    return (
      <div className={`${sizeClasses[size]} bg-green-100 rounded-lg flex items-center justify-center border border-green-200`}>
        <Bus size={size === 'lg' ? 24 : 20} color="#16a34a" weight="duotone" />
      </div>
    );
  };

  return (
    <main className='w-full max-w-7xl mx-auto my-10 flex flex-col items-start justify-start rounded-xl border border-black/10 bg-white shadow-sm'>
      {/* Header */}
      <header className='px-6 py-5 items-center justify-between max-w-full border-b border-black/10 flex w-full'>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-gray-900 text-lg font-semibold'>{title}</p>
          <div className='text-green-700 text-sm font-medium px-2 py-0.5 bg-green-50 rounded-2xl outline-1 outline-offset-[-1px] outline-green-200'>
            {buses.length} Active
          </div>
        </div>

        <button 
          onClick={openModal}
          className='px-4 py-2 bg-green-600 rounded-lg inline-flex justify-center items-center text-white hover:bg-green-700 transition-colors duration-200 text-sm font-semibold'
        >
          <Plus size={16} weight="duotone" />
          Add New Bus
        </button>
      </header>

      <FilterBar
        searchPlaceholder="Search buses"
        onSearch={setSearchQuery}
        filterLabel={statusFilter === 'all' ? 'All Buses' : statusFilter}
        filterOptions={[
          { label: 'All Buses', value: 'all' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
          { label: 'Maintenance', value: 'Maintenance' },
        ]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Table Header */}
      <section className='grid grid-cols-[2fr_1.6fr_1fr_0.9fr_1.2fr_0.9fr] gap-6 items-center w-full px-6 py-3 border-b border-black/10 bg-gray-50'>
        <div className='flex gap-3 items-center min-w-0'>
          <input
            type="checkbox"
            checked={selectedBuses.size === buses.length && buses.length > 0}
            onChange={toggleAllBuses}
            className="w-4 h-4 rounded border border-zinc-300 text-green-600 focus:ring-green-500"
          />
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold text-left"><Bus size={12} />Bus Details</p>
        </div>

        <div className='min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold text-left"><Tag size={12} />Vehicle Name</p>
        </div>

        <div className='min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold text-left"><User size={12} />Driver</p>
        </div>

        <div className='min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold text-left"><CircleDashed size={12} />Status</p>
        </div>

        <div className='min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold text-left"><Signpost size={12} />Route</p>
        </div>

        <div className='min-w-0'>
          <p className="flex items-center gap-1 text-gray-600 text-xs font-semibold text-left"><DotsThree size={12} />Actions</p>
        </div>
      </section>

      {/* Table Rows */}
      {buses.length === 0 ? (
        <div className="flex items-center justify-center py-12 w-full">
          <div className="text-center">
            <Bus size={64} className="mx-auto text-gray-400 mb-4" weight="duotone" />
            <p className="text-gray-900 text-base font-medium mb-1">No buses found</p>
            <p className="text-gray-500 text-sm mb-4">Get started by adding your first shuttle bus</p>
            <button 
              onClick={openModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Add Bus
            </button>
          </div>
        </div>
      ) : (
        buses.map((bus, index) => (
          <section
            key={bus.id}
            className={`grid grid-cols-[2fr_1.6fr_1fr_0.9fr_1.2fr_0.9fr] gap-6 items-center w-full min-h-16 px-6 py-3 ${index < buses.length - 1 ? 'border-b border-black/10' : ''} hover:bg-gray-50 transition-colors duration-150`}
          >
            <div className='flex gap-3 items-center min-w-0'>
              <input
                type="checkbox"
                checked={selectedBuses.has(bus.id)}
                onChange={() => toggleBus(bus.id)}
                className="w-4 h-4 rounded border border-zinc-300 text-green-600 focus:ring-green-500"
              />
              <BusAvatar bus={bus} />
              <div className="flex flex-col items-start min-w-0">
                <p className="text-gray-900 text-base font-bold leading-none truncate w-full">{bus.busNumber}</p>
                <p className="text-gray-400 text-sm mt-1.5 truncate w-full">{bus.lastUpdated}</p>
              </div>
            </div>

            <div className='flex gap-2 items-center min-w-0'>
              <BusAvatar bus={bus} size="sm" />
              <div className="flex flex-col items-start min-w-0">
                <p className="text-gray-900 text-sm font-semibold truncate w-full">{bus.vehicleName}</p>
                <p className="text-gray-500 text-xs mt-0.5 truncate w-full">{bus.busNumber}</p>
              </div>
            </div>

            <div className='min-w-0'>
              <p className="text-gray-900 text-sm font-medium truncate">{bus.driverName}</p>
            </div>

            <div className='min-w-0'>
              <StatusBadge status={bus.status} />
            </div>

            <div className='min-w-0'>
              <p className="text-gray-600 text-sm truncate">{bus.route}</p>
            </div>

            <div className='flex gap-2 items-center min-w-0'>
              <button
                onClick={() => { setSelectedBus(bus); onView(bus); }}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                View
              </button>
              <button 
                onClick={() => onRemove(bus)}
                className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </section>
        ))
      )}

      {/* Footer with selection info */}
      {selectedBuses.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 w-full flex items-center justify-between">
          <p className="text-blue-700 text-sm font-medium">
            {selectedBuses.size} bus{selectedBuses.size > 1 ? 'es' : ''} selected
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium">
              Export Selected
            </button>
            <button className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
              Remove Selected
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 text-left">Add New Shuttle Bus</h2>
                  <p className="text-sm text-gray-600 mt-1 text-left">Enter the bus details</p>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} weight="duotone" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Bus Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Bus preview"
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Image size={24} className="text-gray-400" weight="duotone" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or WEBP. Max 5MB.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Bus Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBusData.busNumber}
                  onChange={(e) => handleInputChange('busNumber', e.target.value)}
                  placeholder="e.g., AS-1234-26"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Vehicle Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBusData.vehicleName}
                  onChange={(e) => handleInputChange('vehicleName', e.target.value)}
                  placeholder="e.g., Mercedes-Benz Sprinter"
                  list="vehicle-names"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
                <datalist id="vehicle-names">
                  {commonVehicleNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Driver Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBusData.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  placeholder="e.g., Kwame Mensah"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Driver Phone Number
                </label>
                <input
                  type="tel"
                  value={newBusData.driverPhone}
                  onChange={(e) => handleInputChange('driverPhone', e.target.value)}
                  placeholder="e.g., 024-123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Route <span className="text-red-500">*</span>
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
                  Bus Capacity
                </label>
                <input
                  type="number"
                  value={newBusData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 40)}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Initial Status
                </label>
                <select
                  value={newBusData.initialStatus}
                  onChange={(e) => handleInputChange('initialStatus', e.target.value as Bus['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBus}
                disabled={!newBusData.busNumber.trim() || !newBusData.vehicleName.trim() || !newBusData.driverName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Add Bus
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBus && (
        <DetailPanel
          entity={{
            title: selectedBus.busNumber,
            driverName: selectedBus.driverName,
            driverId: selectedBus.id,
            status: selectedBus.status,
            timeCheckIn: '07:01AM',
            lastUpdated: selectedBus.lastUpdated,
            details: [
              { label: 'Vehicle Number Plate', value: selectedBus.busNumber },
              { label: 'Date Added', value: '25th Feb 2026' },
              { label: 'Distance Covered', value: '420 km' },
            ],
            ctaLabel: 'Book Vehicle',
          } satisfies DetailPanelEntity}
          onClose={() => setSelectedBus(null)}
        />
      )}
    </main>
  );
};

export default BusTable;