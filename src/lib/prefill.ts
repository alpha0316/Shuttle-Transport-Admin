// Shared prefill state for forms (module-level singleton)
let _prefillVehiclePlate: string | null = null;
export function setPrefillVehicle(plate: string | null) { _prefillVehiclePlate = plate; }
export function getPrefillVehicle(): string | null { return _prefillVehiclePlate; }

let _prefillDriverName: string | null = null;
export function setPrefillDriver(name: string | null) { _prefillDriverName = name; }
export function getPrefillDriver(): string | null { return _prefillDriverName; }

let _prefillDateStr: string | null = null;
export function setPrefillDate(isoDate: string | null) { _prefillDateStr = isoDate; }
export function getPrefillDate(): string | null { return _prefillDateStr; }

// Global navigation callback
let _onNavigate: ((key: string) => void) | null = null;
export function setNavigate(cb: (key: string) => void) { _onNavigate = cb; }
export function navigateTo(key: string) { _onNavigate?.(key); }

// Global form triggers (for cross-component communication)
let _triggerBooking: (() => void) | null = null;
let _triggerExpense: (() => void) | null = null;
export function setBookingTrigger(fn: () => void) { _triggerBooking = fn; }
export function setExpenseTrigger(fn: () => void) { _triggerExpense = fn; }
export function triggerBookingForm() { _triggerBooking?.(); }
export function triggerExpenseForm() { _triggerExpense?.(); }
