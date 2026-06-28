import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { getPrefillVehicle, getPrefillDriver, getPrefillDate, setPrefillVehicle, setPrefillDriver, setPrefillDate } from '../lib/prefill';

interface NewBookingFormProps {
  open: boolean;
  onClose: () => void;
}

const DEPARTMENTS = ['Student Affairs', 'Computer Engineering', 'Faculty of Law', 'Medical School', 'Business School', 'Engineering Dept', 'Science Faculty', 'Sports Directorate', 'Chaplaincy', 'SRC'];

const VEHICLES = [
  'AS-1234-26 (Mercedes-Benz Sprinter)',
  'AS-5678-26 (Toyota Coaster)',
  'AS-3456-26 (Nissan Civilian)',
  'AS-2468-26 (Isuzu Journey)',
  'AS-1357-26 (Mitsubishi Rosa)',
  'AS-9012-26 (Ford Transit)',
];

const DRIVERS = ['Kwame Mensah', 'Ama Asante', 'Yaa Boateng', 'Akosua Manu', 'Emmanuel Tetteh', 'Daniel Asare', 'Michael Adjei'];

const STEPS = ['Person', 'Vehicle', 'Schedule'];

export function NewBookingForm({ open, onClose }: NewBookingFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (open) {
      const prefillVehicle = getPrefillVehicle();
      if (prefillVehicle) {
        const matched = VEHICLES.find((v) => v.startsWith(prefillVehicle));
        setSelectedVehicle(matched ?? prefillVehicle);
      }
      const prefillDriver = getPrefillDriver();
      if (prefillDriver && DRIVERS.includes(prefillDriver)) setSelectedDriver(prefillDriver);
      const prefillDate = getPrefillDate();
      if (prefillDate) setSelectedDate(prefillDate);
    }
  }, [open]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 2));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
      setStep(0);
      setSelectedVehicle('');
      setSelectedDriver('');
      setSelectedDate('');
      setPrefillVehicle(null);
      setPrefillDriver(null);
      setPrefillDate(null);
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); setStep(0); }}
      title="Book Vehicle"
      width="w-[420px]"
      footer={
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-1.5 py-3.5 border border-black/10 rounded-2xl text-black/70 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              <CaretLeft size={14} /> Back
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-green-600 rounded-2xl text-white text-base font-semibold hover:bg-green-700 transition-colors"
            >
              Next <CaretRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              form="new-booking-form"
              disabled={submitting}
              className="flex-1 py-3.5 bg-green-600 rounded-2xl text-white text-base font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          )}
        </div>
      }
    >
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i <= step ? 'bg-green-600 text-white' : 'bg-neutral-100 text-black/30'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${i <= step ? 'text-black' : 'text-black/30'}`}>{label}</span>
            {i < 2 && <div className={`flex-1 h-px ${i < step ? 'bg-green-600' : 'bg-neutral-100'}`} />}
          </div>
        ))}
      </div>

      <form id="new-booking-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {step === 0 && (
          <>
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl text-xs text-black/40">
              Booking ID: <span className="text-black/70 font-mono font-medium">BK-{String(Date.now()).slice(-6)}</span>
            </div>
            <Field label="Full name" placeholder="e.g. Kwame Mensah" />
            <Field label="Phone number" placeholder="024 XXX XXXX" />
            <Field label="Email (optional)" placeholder="email@example.com" type="email" />
            <DropdownField label="Department" options={DEPARTMENTS} />
            <Field label="Notes" placeholder="Any special requests..." />
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-black text-xs text-left">Vehicle</label>
              <select className="w-full px-3 py-2.5 bg-neutral-50 rounded-xl text-sm text-black outline-1 outline-black/5" value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
                <option value="" disabled>Select vehicle</option>
                {VEHICLES.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-black text-xs text-left">Driver</label>
              <select className="w-full px-3 py-2.5 bg-neutral-50 rounded-xl text-sm text-black outline-1 outline-black/5" value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
                <option value="" disabled>Select</option>
                {DRIVERS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <Field label="No. of passengers" placeholder="e.g. 25" type="number" />
            <Field label="Estimated cost (₵)" placeholder="0.00" type="number" />
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-black text-xs text-left">Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 rounded-xl text-sm text-black placeholder:text-black/30 outline-1 outline-black/5 [color-scheme:light]" />
              </div>
              <Field label="Time" placeholder="" type="time" />
            </div>
            <Field label="Pickup location" placeholder="e.g. Brunei" />
            <Field label="Destination" placeholder="e.g. KSB" />
            <DropdownField label="Status" options={['Confirmed', 'Pending']} />
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl text-xs text-black/40">
              Duration estimate: <span className="text-black/70 font-medium">~18 min</span>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-black text-xs text-left">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full px-3 py-2.5 bg-neutral-50 rounded-xl text-sm text-black placeholder:text-black/30 outline-1 outline-black/5 [color-scheme:light]" />
    </div>
  );
}

function DropdownField({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-black text-xs text-left">{label}</label>
      <select className="w-full px-3 py-2.5 bg-neutral-50 rounded-xl text-sm text-black outline-1 outline-black/5" defaultValue="">
        <option value="" disabled>Select</option>
        {options.map((opt) => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
