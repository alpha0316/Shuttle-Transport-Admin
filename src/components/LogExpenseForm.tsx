import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { getPrefillVehicle, setPrefillVehicle } from '../lib/prefill';

interface LogExpenseFormProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Fuel', 'Parts', 'Labour', 'Repairs', 'Tires', 'Insurance', 'Cleaning', 'Miscellaneous'];
const VEHICLES = ['AS-1234-26 (Mercedes-Benz Sprinter)', 'AS-5678-26 (Toyota Coaster)', 'AS-3456-26 (Nissan Civilian)', 'AS-2468-26 (Isuzu Journey)', 'AS-1357-26 (Mitsubishi Rosa)', 'AS-9012-26 (Ford Transit)'];
const STEPS = ['Details', 'Vehicle', 'Items'];

export function LogExpenseForm({ open, onClose }: LogExpenseFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');

  useEffect(() => {
    if (open) {
      const prefillVehicle = getPrefillVehicle();
      if (prefillVehicle) {
        const matched = VEHICLES.find((v) => v.startsWith(prefillVehicle));
        setSelectedVehicle(matched ?? prefillVehicle);
      }
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
      setPrefillVehicle(null);
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); setStep(0); }}
      title="Log Expense"
      width="w-[420px]"
      footer={
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button type="button" onClick={handleBack} className="flex-1 flex items-center justify-center gap-1.5 py-3.5 border border-black/10 rounded-2xl text-black/70 text-sm font-medium hover:bg-neutral-50 transition-colors">
              <CaretLeft size={14} /> Back
            </button>
          )}
          {step < 2 ? (
            <button type="button" onClick={handleNext} className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-green-600 rounded-2xl text-white text-base font-semibold hover:bg-green-700 transition-colors">
              Next <CaretRight size={14} />
            </button>
          ) : (
            <button type="submit" form="log-expense-form" disabled={submitting} className="flex-1 py-3.5 bg-green-600 rounded-2xl text-white text-base font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors">
              {submitting ? 'Saving...' : 'Log Expense'}
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

      <form id="log-expense-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {step === 0 && (
          <>
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl text-xs text-black/40">
              Expense ID: <span className="text-black/70 font-mono font-medium">EX-{String(Date.now()).slice(-6)}</span>
            </div>
            <Field label="Expense name" placeholder="e.g. Oil Change" />
            <div className="grid grid-cols-2 gap-4">
              <DropdownField label="Category" options={CATEGORIES} />
              <Field label="Amount (₵)" placeholder="0.00" type="number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Issued by" placeholder="Full name" />
              <Field label="Phone" placeholder="024 XXX XXXX" />
            </div>
            <DropdownField label="Status" options={['Paid', 'Pending']} />
            <Field label="Notes" placeholder="Additional notes..." />
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
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date" placeholder="" type="date" />
              <Field label="Time" placeholder="" type="time" />
            </div>
            <Field label="Location" placeholder="e.g. Shell - Ayeduase" />
            <Field label="Odometer (km)" placeholder="e.g. 45,230" type="number" />
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-black text-xs text-left">Line items</label>
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" placeholder="Item name" className="flex-1 px-3 py-2 bg-neutral-50 rounded-lg text-sm text-black placeholder:text-black/30 outline-1 outline-black/5" />
                    <input type="number" placeholder="Qty" className="w-16 px-2 py-2 bg-neutral-50 rounded-lg text-sm text-black placeholder:text-black/30 outline-1 outline-black/5" />
                    <input type="number" placeholder="₵" className="w-24 px-2 py-2 bg-neutral-50 rounded-lg text-sm text-black placeholder:text-black/30 outline-1 outline-black/5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl text-xs text-black/40">
              Total: <span className="text-black/70 font-semibold">—</span>
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
