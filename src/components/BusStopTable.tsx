import React, { useState } from 'react';

const CustomTable = ({ 
  data = [
    {
      id: 1,
      name: 'KSB',
      crowdSize: '25+ people',
      status: 'Active',
      activeBuses: '3 buses',
      statusColor: 'green'
    },
    {
      id: 2,
      name: 'Brunei',
      crowdSize: '12+ people',
      status: 'Active',
      activeBuses: '2 buses',
      statusColor: 'green'
    },
    {
      id: 3,
      name: 'Commercial Area',
      crowdSize: '0 people',
      status: 'Inactive',
      activeBuses: '0 buses',
      statusColor: 'red'
    },
    {
      id: 4,
      name: 'Gaza',
      crowdSize: '8+ people',
      status: 'Maintenance',
      activeBuses: '1 bus',
      statusColor: 'yellow'
    },
    {
      id: 5,
      name: 'Pharmacy',
      crowdSize: '15+ people',
      status: 'Active',
      activeBuses: '2 buses',
      statusColor: 'green'
    }
  ],
  title = "Bus Stops",
  onCreateNew = () => console.log('Create new clicked'),
  onView = (stop) => console.log('View stop:', stop),
  onRemove = (stop) => console.log('Remove stop:', stop)
}) => {
  const busStops = data;

  const [selectedStops, setSelectedStops] = useState(new Set());

  const toggleStop = (stopId) => {
    const newSelected = new Set(selectedStops);
    if (newSelected.has(stopId)) {
      newSelected.delete(stopId);
    } else {
      newSelected.add(stopId);
    }
    setSelectedStops(newSelected);
  };

  const toggleAllStops = () => {
    if (selectedStops.size === busStops.length) {
      setSelectedStops(new Set());
    } else {
      setSelectedStops(new Set(busStops.map(s => s.id)));
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

  const getStopIcon = (status) => {
    const iconColor = status === 'Active' ? 'bg-green-500' : 
                     status === 'Inactive' ? 'bg-red-500' : 'bg-yellow-500';
    
    return <div className={`w-6 h-6 rounded-full ${iconColor}`}></div>;
  };

  return (
    <main className='w-[1123px] m-10 flex flex-col items-start justify-between rounded-xl border border-black/10 '>
      {/* Header */}
      <header className='px-6 py-5 items-center justify-between max-w-full border-b border-black/10 flex w-full'>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-gray-900 text-lg font-semibold'>{title}</p>
          <p className='text-violet-700 text-sm font-medium px-2 py-0.5 bg-purple-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-200'>
            {busStops.length} {title}
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
            checked={selectedStops.size === busStops.length}
            onChange={toggleAllStops}
            className="w-5 h-5 rounded border border-zinc-300"
          />
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Stop Name</p>
        </div>

        <div className='flex gap-1 items-center w-28'>
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Crowd Size</p>
        </div>

        <div className='flex gap-1 items-center w-28'>
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Status</p>
        </div>

        <div className='flex gap-1 items-center w-28'>
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Active Buses</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="justify-start text-gray-600 text-xs font-semibold leading-none">Action</p>
        </div>
      </section>

      {/* Table Rows */}
      {busStops.map((stop, index) => (
        <section 
          key={stop.id} 
          className={`flex w-full items-center h-16 px-6 py-3 justify-between ${index < busStops.length - 1 ? 'border-b border-black/10' : ''}
          ${ index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
        >
          <div className='flex gap-2 items-center w-80'>
            <input
              type="checkbox"
              checked={selectedStops.has(stop.id)}
              onChange={() => toggleStop(stop.id)}
              className="w-5 h-5 rounded border border-zinc-300"
            />
   
            <p className="justify-start text-gray-900 text-sm font-medium leading-none">{stop.name}</p>
          </div>

          <div className='flex gap-1 items-center w-28'>
            <p className="justify-start text-gray-600 text-sm leading-none">{stop.crowdSize}</p>
          </div>

          <div className='flex gap-1 items-center w-28'>
            {getStatusBadge(stop.status, stop.statusColor)}
          </div>

          <div className='flex gap-1 items-center w-28'>
            <p className="justify-start text-gray-600 text-sm leading-none font-medium">{stop.activeBuses}</p>
          </div>

          <div className='flex gap-1 items-center w-24'>
            <button 
              onClick={() => onView(stop)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View
            </button>
            <span className="text-gray-300 mx-1">|</span>
            <button 
              onClick={() => onRemove(stop)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </section>
      ))}

      {/* Footer with selection info */}
      {selectedStops.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-black/10 w-full">
          <p className="text-blue-700 text-sm">
            {selectedStops.size} stop{selectedStops.size > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </main>
  );
};

export default CustomTable;