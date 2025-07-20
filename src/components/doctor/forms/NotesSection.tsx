import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PatientTreatmentFormValues } from "@/schemas/patientTreatment";

interface NotesSectionProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  register: UseFormRegister<PatientTreatmentFormValues>;
  errors: FieldErrors<PatientTreatmentFormValues>;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  open,
  setOpen,
  register,
  errors,
}) => (
  <div className="bg-white p-0 rounded-lg border shadow-sm mb-2">
    <button
      type="button"
      className="w-full flex items-center justify-between px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50 rounded-t-lg transition"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
    >
      <span>Ghi chú</span>
      {open ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
    {open && (
      <div className="px-4 pb-4 pt-2">
        <Textarea id="notes" {...register("notes")} className="min-h-[60px]" />
        {errors.notes && (
          <p className="text-red-500 text-sm">{errors.notes.message}</p>
        )}
      </div>
    )}
  </div>
);

export default NotesSection;
