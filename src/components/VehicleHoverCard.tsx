interface VehicleHoverCardProps {
  driverName: string;
  phone?: string;
  routeFrom?: string;
  routeTo?: string;
  progress?: number;
  photoUrl?: string;
  x?: number;
  y?: number;
  onTrack?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

export function VehicleHoverCard({
  driverName,
  phone,
  routeFrom = 'Start',
  routeTo = 'Destination',
  photoUrl,
  x = 0,
  y = 0,
  onTrack,
  onMouseEnter,
  onMouseLeave,
}: VehicleHoverCardProps) {
  const initials = driverName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="fixed z-[9999] w-60 p-2 bg-white rounded-2xl shadow-[0px_16px_32px_-4px_rgba(12,12,13,0.10)] flex flex-col justify-center items-start gap-2 pointer-events-auto"
      style={{ left: Math.min(x - 120, window.innerWidth - 256), top: y + 12 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="self-stretch flex justify-between items-start">
        {photoUrl ? (
          <img className="size-7 rounded-full object-cover" src={photoUrl} alt={driverName} />
        ) : (
          <div className="size-7 rounded-full bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-700">
            {initials}
          </div>
        )}
        {onTrack && (
          <button
            onClick={(e) => { e.stopPropagation(); onTrack(); }}
            className="px-2.5 py-1.5 bg-green-600 rounded-lg flex justify-center items-center hover:bg-green-700 transition-colors"
          >
            <span className="text-white text-xs font-bold">Track</span>
          </button>
        )}
      </div>

      <div className="self-stretch flex flex-col justify-center items-start gap-0.5">
        <div className="text-black text-sm font-semibold">{driverName}</div>
        {phone && <div className="text-black/60 text-xs">{phone}</div>}
      </div>

      <div className="self-stretch h-px bg-black/10" />

      <div className="self-stretch px-1.5 py-2 bg-neutral-50 rounded-2xl flex justify-start items-center gap-1.5">
        <span className="text-black text-xs font-medium w-16 text-center shrink-0 truncate">{routeFrom}</span>
        <div className="flex-1 flex items-center gap-0.5">
          <div className="w-6 h-0.5 bg-green-600 rounded-3xl shrink-0" />
          <div className="flex-1 h-1.5 relative bg-zinc-100 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-px h-1.5 bg-black/10"
                  style={{ marginLeft: i === 0 ? 0 : `${(100 - 6) / 19}%`, transform: 'rotate(22deg)' }}
                />
              ))}
            </div>
          </div>
          <div className="w-6 h-0.5 bg-green-600 rounded-3xl shrink-0" />
        </div>
        <span className="w-16 text-black text-xs font-medium text-center shrink-0 truncate">{routeTo}</span>
      </div>
    </div>
  );
}
