import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { CaretLeft, CaretRight, Image } from '@phosphor-icons/react';
import type { DriverRow } from '../mockData/index';

interface AddDriverFormProps {
  open: boolean;
  onClose: () => void;
  driver?: DriverRow | null;
}

const VEHICLES = ['AS-1234-26 (Mercedes-Benz Sprinter)', 'AS-5678-26 (Toyota Coaster)', 'AS-3456-26 (Nissan Civilian)', 'AS-2468-26 (Isuzu Journey)', 'AS-1357-26 (Mitsubishi Rosa)', 'AS-9012-26 (Ford Transit)', 'Unassigned'];
const ROUTES = ['Brunei → KSB', 'Commercial → KSB', 'Gaza → Pharmacy', 'Main Library Circuit', 'Hall 7 Express', 'Pentecost Loop', 'SRC → Conti', 'Medical Village Shuttle', 'Unassigned'];

const STEPS = ['Personal', 'License', 'Assignment'];

export function AddDriverForm({ open, onClose, driver }: AddDriverFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [licenseImage, setLicenseImage] = useState<string | null>(null);

  const isEdit = !!driver;

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

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
      title={isEdit ? 'Edit Driver' : 'Add Driver'}
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
            <button type="submit" form="add-driver-form" disabled={submitting} className="flex-1 py-3.5 bg-green-600 rounded-2xl text-white text-base font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors">
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Driver'}
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

      <form id="add-driver-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {step === 0 && (
          <>
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-xl text-xs text-black/40">
              Driver ID: <span className="text-black/70 font-mono font-medium">{driver?.id || `DRV-${String(Date.now()).slice(-6)}`}</span>
            </div>
            <Field label="Full name" placeholder="e.g. Kwame Mensah" defaultValue={driver?.name} />
            <Field label="Phone number" placeholder="024 XXX XXXX" defaultValue={driver?.phone} />
            <Field label="Email (optional)" placeholder="email@example.com" type="email" />
            <Field label="Emergency contact" placeholder="024 XXX XXXX" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of birth" placeholder="" type="date" />
              <DropdownField label="Status" options={['Active', 'On Break']} defaultValue={driver ? (driver.status === 'on_break' ? 'On Break' : driver.status === 'active' ? 'Active' : 'Active') : undefined} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-black text-xs text-left">License image</label>
              {licenseImage ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-neutral-50 outline-1 outline-black/5">
                  <img src={licenseImage} alt="License" className="w-full h-full object-cover" />
                  <button onClick={() => setLicenseImage(null)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70">×</button>
                </div>
              ) : (
                <label className="w-full h-40 rounded-xl bg-neutral-50 outline-1 outline-dashed outline-black/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-100 transition-colors">
                  <Image size={28} className="text-black/30" />
                  <span className="text-black/40 text-xs">Upload license photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setLicenseImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              )}
            </div>
            <Field label="License number" placeholder="e.g. DL-2024-0123" defaultValue={driver?.license} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="License class" placeholder="e.g. D" />
              <Field label="Issue date" placeholder="" type="date" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry date" placeholder="" type="date" />
              <Field label="Experience" placeholder="e.g. 5 years" />
            </div>
            <Field label="Notes" placeholder="Additional notes..." />
          </>
        )}

        {step === 2 && (
          <>
            <DropdownField label="Vehicle" options={VEHICLES} defaultValue={driver?.assignedVehicle || undefined} />
            <DropdownField label="Route" options={ROUTES} defaultValue={driver?.route || undefined} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start date" placeholder="" type="date" />
              <Field label="Shift" placeholder="e.g. Morning" />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}

function Field({ label, placeholder, type = 'text', defaultValue }: { label: string; placeholder: string; type?: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-black text-xs text-left">{label}</label>
      <input type={type} placeholder={placeholder} defaultValue={defaultValue} className="w-full px-3 py-2.5 bg-neutral-50 rounded-xl text-sm text-black placeholder:text-black/30 outline-1 outline-black/5 [color-scheme:light]" />
    </div>
  );
}

function DropdownField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-black text-xs text-left">{label}</label>
      <select className="w-full px-3 py-2.5 bg-neutral-50 rounded-xl text-sm text-black outline-1 outline-black/5" defaultValue={defaultValue || ''}>
        <option value="" disabled>Select</option>
        {options.map((opt) => <option key={opt} selected={opt === defaultValue}>{opt}</option>)}
      </select>
    </div>
  );
}
