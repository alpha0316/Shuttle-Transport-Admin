import { useState } from 'react';
import { Modal } from './Modal';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

interface AddVehicleFormProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ['Details', 'Specs', 'Driver'];

export function AddVehicleForm({ open, onClose }: AddVehicleFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => setStep((s) => Math.min(s + 1, 2));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); onClose(); setStep(0); }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); setStep(0); }}
      title="Add Vehicle"
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
            <button type="submit" form="add-vehicle-form" disabled={submitting} className="flex-1 py-3.5 bg-green-600 rounded-2xl text-white text-base font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors">
              {submitting ? 'Adding...' : 'Add Vehicle'}
            </button>
          )}
        </div>
      }
    >
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

      <form id="add-vehicle-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {step === 0 && (
          <>
            <Field label="Plate number" placeholder="e.g. AS-1234-26" />
            <Field label="Model / Vehicle name" placeholder="e.g. Mercedes-Benz Sprinter" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Year" placeholder="e.g. 2024" type="number" />
              <DropdownField label="Type" options={['Bus', 'Mini Bus', 'Van', 'Truck']} />
            </div>
            <Field label="Color" placeholder="e.g. White" />
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Capacity (seats)" placeholder="e.g. 40" type="number" />
              <Field label="Fuel type" placeholder="e.g. Diesel" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Odometer (km)" placeholder="e.g. 45,000" type="number" />
              <Field label="Fuel tank (L)" placeholder="e.g. 80" type="number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Purchase date" placeholder="" type="date" />
              <DropdownField label="Status" options={['Active', 'Inactive', 'Maintenance']} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DropdownField label="Assigned driver" options={['Kwame Mensah', 'Ama Asante', 'Yaa Boateng', 'Akosua Manu', 'Emmanuel Tetteh', 'Daniel Asare', 'Michael Adjei', 'Unassigned']} />
            <DropdownField label="Route" options={['Brunei → KSB', 'Commercial → KSB', 'Gaza → Pharmacy', 'Main Library Circuit', 'Hall 7 Express', 'Pentecost Loop', 'Unassigned']} />
            <Field label="Insurance policy no." placeholder="e.g. INS-2024-001" />
            <Field label="Notes" placeholder="Additional notes..." />
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
