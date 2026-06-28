import { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { MagnifyingGlass, Bus } from '@phosphor-icons/react';
import { MOCK_VEHICLE_DATA } from '../mockData/index';

interface AssignShuttleModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (vehicleId: string) => void;
  currentVehicle?: string | null;
}

export function AssignShuttleModal({ open, onClose, onAssign, currentVehicle }: AssignShuttleModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const handleSave = () => {
    if (selected) { onAssign(selected); onClose(); }
  };

  const filtered = useMemo(() => {
    let d = MOCK_VEHICLE_DATA.filter(v => v.status === 'active');
    if (search) d = d.filter(v => v.plateNumber.toLowerCase().includes(search.toLowerCase()) || v.model.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign Shuttle"
      width="w-[420px]"
      footer={
        selected ? (
          <button onClick={handleSave} className="w-full py-3.5 bg-green-600 rounded-2xl text-white text-base font-semibold hover:bg-green-700 transition-colors">
            Save Assignment
          </button>
        ) : (
          <button disabled className="w-full py-3.5 bg-neutral-100 rounded-2xl text-black/30 text-base font-semibold cursor-not-allowed">
            Select a shuttle
          </button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 rounded-xl outline-1 outline-black/5">
          <MagnifyingGlass size={14} className="text-black/40 shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles..." className="text-sm text-black placeholder:text-black/30 outline-none bg-transparent w-full" />
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-black/40 text-center py-8">No available vehicles found.</p>
          ) : (
            filtered.map((v) => {
              const isCurrent = v.plateNumber === currentVehicle;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelected(v.plateNumber === selected ? null : v.plateNumber)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${v.plateNumber === selected ? 'bg-green-50 outline-2 outline-green-500' : v.plateNumber === currentVehicle ? 'bg-neutral-100 outline-1 outline-black/5' : 'bg-neutral-50 hover:bg-neutral-100 outline-1 outline-black/5'}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Bus size={18} color="#16a34a" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-black">{v.plateNumber}</span>
                    <span className="text-xs text-black/50">{v.model}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs text-black/50">{v.capacity} seats</span>
                    {v.plateNumber === currentVehicle && <span className="text-[10px] text-green-700 font-medium bg-green-100 px-1.5 py-0.5 rounded-full">Current</span>}
                    {v.plateNumber === selected && <span className="text-[10px] text-green-700 font-medium bg-green-100 px-1.5 py-0.5 rounded-full">Selected</span>}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
