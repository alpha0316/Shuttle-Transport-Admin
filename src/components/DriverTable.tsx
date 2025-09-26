import React, { useState } from 'react';

const CustomTable = ({ 
  data = [
    {
      id: 1,
      name: 'Olivia Rhye',
      speed: '45 km/h',
      status: 'Active',
      route: 'Brunei -> KSB',
      statusColor: 'green'
    },
    {
      id: 2,
      name: 'Phoenix Baker',
      speed: '52 km/h',
      status: 'Active',
      route: 'Brunei -> KSB',
      statusColor: 'green'
    },
    {
      id: 3,
      name: 'Lana Steiner',
      speed: '0 km/h',
      status: 'Offline',
      route: 'Commercial -> KSB',
      statusColor: 'red'
    },
    {
      id: 4,
      name: 'Demi Wilkinson',
      speed: '38 km/h',
      status: 'Break',
      route: 'Gaza -> Pharmacy',
      statusColor: 'yellow'
    },
    {
      id: 5,
      name: 'Candice Wu',
      speed: '41 km/h',
      status: 'Active',
      route: 'Commercial -> KSB',
      statusColor: 'green'
    }
  ],
  title = "Drivers",
  onCreateNew = () => console.log('Create new clicked'),
  onView = (driver) => console.log('View driver:', driver),
  onRemove = (driver) => console.log('Remove driver:', driver)
}) => {
  const drivers = data;

  const [selectedDrivers, setSelectedDrivers] = useState(new Set());

  const toggleDriver = (driverId) => {
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

  const getStatusBadge = (status, statusColor) => {
    const colorClasses = {
      green: 'bg-green-50 text-green-700 outline-green-200',
      red: 'bg-red-50 text-red-700 outline-red-200',
      yellow: 'bg-yellow-50 text-yellow-700 outline-yellow-200'
    };

    return (
      <div className={`pl-1.5 pr-2 py-0.5 rounded-2xl outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-1 ${colorClasses[statusColor]}`}>
        <div className="text-center justify-start text-xs font-medium leading-none">{status}</div>
      </div>
    );
  };

  return (
    <main className='w-[1123px] m-10 flex flex-col items-start justify-start rounded-xl border border-black/10'>
      {/* Header */}
      <header className='px-6 py-5 items-center justify-between max-w-full border-b border-black/10 flex w-full'>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-gray-900 text-lg font-semibold'>{title}</p>
          <p className='text-violet-700 text-sm font-medium px-2 py-0.5 bg-purple-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200'>
            {drivers.length} {title}
          </p>
        </div>

        <button 
          onClick={onCreateNew}
          className='px-2.5 py-1 bg-green-600 rounded-[10px] inline-flex justify-center items-center text-white hover:bg-green-700 transition-colors'
        >
          Create New {title.slice(0, -1)}
        </button>
      </header>

      {/* Table Header */}
      <section className='flex w-full items-center h-11 px-6 py-3 border-b border-black/10 justify-between'>
        <div className='flex gap-2 items-center w-80'>
          <input
            type="checkbox"
            checked={selectedDrivers.size === drivers.length}
            onChange={toggleAllDrivers}
            className="w-5 h-5 rounded border border-zinc-300"
          />
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Driver Name</p>
        </div>

        <div className='flex gap-1 items-center w-24 '>
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Speed</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Status</p>
        </div>

        <div className='flex gap-1 items-center w-32'>
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Route</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Action</p>
        </div>
      </section>

      {/* Table Rows */}
      {drivers.map((driver, index) => (
        <section 
          key={driver.id} 
          className={`flex w-full items-center h-16 px-6 py-3 ${index < drivers.length - 1 ? 'border-b border-black/10' : ''} justify-between ${
            index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
          } hover:bg-gray-100 transition-colors`}
        >
          <div className='flex gap-2 items-center w-80'>
            <input
              type="checkbox"
              checked={selectedDrivers.has(driver.id)}
              onChange={() => toggleDriver(driver.id)}
              className="w-5 h-5 rounded border border-zinc-300"
            />
            <div className='w-6 h-6 rounded-full bg-amber-100'>

            </div>
            <p className="justify-start text-gray-900 text-sm font-medium leading-none">{driver.name}</p>
          </div>

          <div className='flex gap-1 items-center w-24'>
            <p className="justify-start text-gray-600 text-sm leading-none">{driver.speed}</p>
          </div>

          <div className='flex gap-1 items-center w-24'>
            {getStatusBadge(driver.status, driver.statusColor)}
          </div>

          <div className='flex gap-1 items-center w-32'>
            <p className="justify-start text-gray-600 text-sm leading-none">{driver.route}</p>
          </div>

          <div className='flex gap-1 items-center w-24'>
            <button 
              onClick={() => onView(driver)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View
            </button>
            <span className="text-gray-300 mx-1">|</span>
            <button 
              onClick={() => onRemove(driver)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </section>
      ))}

      {/* Footer with selection info */}
      {selectedDrivers.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-black/10 w-full">
          <p className="text-blue-700 text-sm">
            {selectedDrivers.size} driver{selectedDrivers.size > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </main>
  );
};

export default CustomTable;