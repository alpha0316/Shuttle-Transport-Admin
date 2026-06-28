import { Icon } from './Icon';

interface TopVehicleCost {
  vehicle: string;
  plate: string;
  amount: number;
}

interface TopVehiclesByCostCardProps {
  data: TopVehicleCost[];
  trendPercent?: number;
}

type Corner = 'tl' | 'tr' | 'br' | 'bl';

const SEGMENT_COLORS = ['#36C5F0', '#9CA84A', '#FF8A4C', '#E63950'];
const CORNERS: Corner[] = ['tl', 'tr', 'br', 'bl'];

const R = 40;
const STROKE = 14;
const GAP_DEG = 8;
const CIRCUMFERENCE = 2 * Math.PI * R;

// Quadrant order matches the corner labels: tl, tr, br, bl
const ARC_RANGES: [number, number][] = [
  [270 + GAP_DEG / 2, 360 - GAP_DEG / 2],
  [0 + GAP_DEG / 2, 90 - GAP_DEG / 2],
  [90 + GAP_DEG / 2, 180 - GAP_DEG / 2],
  [180 + GAP_DEG / 2, 270 - GAP_DEG / 2],
];

function arcDashArray(start: number, end: number) {
  const len = ((end - start) / 360) * CIRCUMFERENCE;
  return `${len} ${CIRCUMFERENCE - len}`;
}

const LABEL_POSITION_CLASSES: Record<Corner, string> = {
  tl: 'top-[36px] left-[6px] items-start text-left',
  tr: 'top-[36px] right-[6px] items-end text-right',
  br: 'bottom-[28px] right-[6px] items-end text-right',
  bl: 'bottom-[28px] left-[6px] items-start text-left',
};

const CONNECTOR_CLASSES: Record<Corner, string> = {
  tl: 'top-[58px] left-[96px] rotate-[22deg]',
  tr: 'top-[58px] right-[96px] -rotate-[22deg]',
  br: 'bottom-[50px] right-[96px] rotate-[22deg]',
  bl: 'bottom-[50px] left-[96px] -rotate-[22deg]',
};

export default function TopVehiclesByCostCard({ data, trendPercent = 8.2 }: TopVehiclesByCostCardProps) {
  const items = data.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-black text-left">Top 4 Vehicles by Cost</h3>
        <p className="text-xs">
          <span className="text-[#ff383c]">↑</span>{' '}
          <span className="text-black font-medium">+{trendPercent}%</span>{' '}
          <span className="text-black/40">vs last month</span>
        </p>
      </div>

      <div className="relative w-full max-w-[420px] h-[280px] mx-auto">
        <svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px]">
          {items.map((_, i) => {
            const [start, end] = ARC_RANGES[i];
            return (
              <circle
                key={i}
                cx={50}
                cy={50}
                r={R}
                fill="none"
                stroke={SEGMENT_COLORS[i]}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={arcDashArray(start, end)}
                transform={`rotate(${start - 90} 50 50)`}
              />
            );
          })}
        </svg>

        {items.map((item, i) => {
          const corner = CORNERS[i];
          return (
            <div key={item.plate} className={`absolute h-0 w-10 border-t border-dashed border-black/15 ${CONNECTOR_CLASSES[corner]}`} />
          );
        })}

        {items.map((item, i) => {
          const corner = CORNERS[i];
          return (
            <div key={item.plate} className={`absolute flex flex-col gap-1 ${LABEL_POSITION_CLASSES[corner]}`}>
              <div className="flex items-center gap-1.5">
                <Icon name="bus" size={16} color={SEGMENT_COLORS[i]} />
                <span className="text-sm font-medium text-black truncate max-w-[130px]">{item.vehicle}</span>
              </div>
              <span className="text-xs text-black/40">₵{item.amount.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
