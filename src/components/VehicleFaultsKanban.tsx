import { UserPlus } from '@phosphor-icons/react';
import { Icon } from './Icon';

interface FaultTicket {
  id: string;
  title: string;
  severity: 'Critical' | 'Medium' | 'Low';
  vehicleName: string;
  vehiclePlate: string;
  reportedAt: string;
  estimatedCost: number;
  assignee?: string;
}

interface FaultColumn {
  key: string;
  label: string;
  dotColor: string;
  tickets: FaultTicket[];
}

const SEVERITY_BAR_COLORS: Record<FaultTicket['severity'], string> = {
  Critical: 'bg-red-400',
  Medium: 'bg-amber-300',
  Low: 'bg-blue-300',
};

const ASSIGNEE_COLORS: Record<string, string> = {
  'Kojo Mensah': 'bg-teal-500',
  'Elorm Seyram': 'bg-orange-500',
  'Yaw Boateng': 'bg-blue-500',
};

const FAULT_COLUMNS: FaultColumn[] = [
  {
    key: 'pending',
    label: 'Pending',
    dotColor: 'bg-orange-500',
    tickets: [
      { id: 'FLT-1039', title: 'Brake System Overhaul', severity: 'Critical', vehicleName: 'Mercedes-Benz Sprinter', vehiclePlate: 'AS-1234-26', reportedAt: '2:01PM', estimatedCost: 650 },
    ],
  },
  {
    key: 'in-progress',
    label: 'In Progress',
    dotColor: 'bg-red-500',
    tickets: [
      { id: 'FLT-1037', title: 'Engine Check', severity: 'Medium', vehicleName: 'Toyota Camry SE', vehiclePlate: 'GH-2345-26', reportedAt: '2:01PM', estimatedCost: 400, assignee: 'Kojo Mensah' },
    ],
  },
  {
    key: 'awaiting-parts',
    label: 'Awaiting Parts',
    dotColor: 'bg-purple-500',
    tickets: [
      { id: 'FLT-1041', title: 'Transmission Check', severity: 'Critical', vehicleName: 'Nissan Civilian', vehiclePlate: 'AS-3456-26', reportedAt: '2:01PM', estimatedCost: 850, assignee: 'Elorm Seyram' },
      { id: 'FLT-1036', title: 'Tire Rotation', severity: 'Medium', vehicleName: 'Toyota Coaster', vehiclePlate: 'AS-5678-26', reportedAt: '2:01PM', estimatedCost: 180, assignee: 'Kojo Mensah' },
    ],
  },
  {
    key: 'completed',
    label: 'Completed',
    dotColor: 'bg-green-500',
    tickets: [
      { id: 'FLT-1040', title: 'Oil Change', severity: 'Medium', vehicleName: 'Mercedes-Benz Sprinter', vehiclePlate: 'AS-1234-26', reportedAt: '2:01PM', estimatedCost: 120, assignee: 'Yaw Boateng' },
      { id: 'FLT-1038', title: 'Windshield Replacement', severity: 'Low', vehicleName: 'Hyundai County', vehiclePlate: 'AS-7890-26', reportedAt: '2:01PM', estimatedCost: 950, assignee: 'Elorm Seyram' },
      { id: 'FLT-1035', title: 'Brake Pad Replacement', severity: 'Low', vehicleName: 'Toyota Camry SE', vehiclePlate: 'GH-2345-26', reportedAt: '2:01PM', estimatedCost: 320, assignee: 'Kojo Mensah' },
    ],
  },
];

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

const TicketCard = ({ ticket }: { ticket: FaultTicket }) => (
  <div className="relative bg-white rounded-xl shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] outline-1 outline-offset-[-1px] outline-black/5 overflow-hidden p-3 pl-4 flex flex-col gap-2.5">
    <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[16px] ${SEVERITY_BAR_COLORS[ticket.severity]}`} />

    <div className="flex justify-between items-start gap-2">
      <div className="flex flex-col gap-1 text-left min-w-0">
        <span className="text-xs font-bold text-black">{ticket.id}</span>
        <span className="text-xs font-medium text-black truncate">{ticket.title}</span>
      </div>
      <span className="text-xs font-semibold text-black shrink-0">₵{ticket.estimatedCost.toFixed(2)}</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="w-7 h-6 bg-neutral-50 rounded-md flex items-center justify-center shrink-0">
        <Icon name="bus" size={14} color="#888" />
      </div>
      <div className="flex flex-col min-w-0 text-left">
        <span className="text-[10px] text-black/60 truncate">{ticket.vehicleName}</span>
        <span className="text-[10px] text-black/40 truncate">{ticket.vehiclePlate}</span>
      </div>
      <span className="ml-auto text-[10px] text-black/40 shrink-0">{ticket.reportedAt}</span>
    </div>

    <div className="h-px bg-black/10" />

    {ticket.assignee ? (
      <div className="flex items-center gap-2">
        <div
          className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-medium shrink-0 ${
            ASSIGNEE_COLORS[ticket.assignee] ?? 'bg-zinc-400'
          }`}
        >
          {getInitial(ticket.assignee)}
        </div>
        <span className="text-sm text-black truncate">{ticket.assignee}</span>
      </div>
    ) : (
      <button className="flex items-center gap-2 text-black/40 hover:text-black/60 transition-colors">
        <UserPlus size={14} />
        <span className="text-sm">Tap To Assign</span>
      </button>
    )}
  </div>
);

const VehicleFaultsKanban = () => (
  <div className="flex gap-3.5 overflow-x-auto pb-1">
    {FAULT_COLUMNS.map((column) => (
      <div key={column.key} className="w-64 shrink-0 bg-neutral-50 rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className={`w-1.5 h-1.5 rounded-full ${column.dotColor}`} />
            <span className="text-base font-semibold text-black">{column.label}</span>
          </div>
          <div className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center">
            <span className="text-sm text-black/60">{column.tickets.length}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {column.tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default VehicleFaultsKanban;
