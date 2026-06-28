import React, { useEffect, useState } from 'react';

export interface BusHoverCardProps {
  x: number;
  y: number;
  photoUrl?: string;
  driverName: string;
  phone?: string;
  routeFrom: string;
  routeTo: string;
  progress: number;
  onTrack?: () => void;
}

const BusHoverCard: React.FC<BusHoverCardProps> = ({
  x, y, photoUrl, driverName, phone, routeFrom, routeTo, progress, onTrack,
}) => {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`fixed z-[60] pointer-events-none transition-all duration-300 ease-out ${
        entered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'
      }`}
      style={{ left: x + 16, top: y - 12 }}
    >
      <div className="w-60 p-4 bg-white rounded-2xl shadow-[0px_16px_32px_-4px_rgba(12,12,13,0.10)] flex flex-col items-start gap-2 pointer-events-auto">
        <div className="w-full flex justify-between items-start">
          {photoUrl ? (
            <img src={photoUrl} alt={driverName} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-semibold">
              {driverName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
          <button
            onClick={onTrack}
            className="px-2.5 py-1.5 bg-green-600 rounded-lg text-white text-xs font-bold hover:bg-green-700 transition-colors"
          >
            Track
          </button>
        </div>

        <div className="flex flex-col items-start gap-0.5">
          <p className="text-sm font-semibold text-black">{driverName}</p>
          {phone && <p className="text-xs text-black/60">{phone}</p>}
        </div>

        <div className="w-full h-px bg-black/10" />

        <div className="w-full px-1.5 py-2 bg-neutral-50 rounded-2xl flex items-center gap-1.5">
          <p className="text-xs font-medium text-black">{routeFrom}</p>
          <div className="flex-1 flex items-center gap-1">
            <div className="w-2 h-0.5 bg-green-600 rounded-full shrink-0" />
            <div className="flex-1 h-1 bg-zinc-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
            </div>
          </div>
          <p className="text-xs font-medium text-black">{routeTo}</p>
        </div>
      </div>
    </div>
  );
};

export default BusHoverCard;
