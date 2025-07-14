import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ProtocolMedicinesReview from "./ProtocolMedicinesReview";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";

interface ProtocolMedicinesSectionProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  protocolDetail: TreatmentProtocol | null;
}

const ProtocolMedicinesSection: React.FC<ProtocolMedicinesSectionProps> = ({
  open,
  setOpen,
  protocolDetail,
}) => (
  <div className="bg-white p-0 rounded-lg border shadow-sm mb-2">
    <button
      type="button"
      className="w-full flex items-center justify-between px-4 py-2 font-semibold text-blue-800 hover:bg-blue-50 rounded-t-lg transition"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
    >
      <span>Thuốc theo phác đồ</span>
      {open ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
    {open && (
      <div className="px-2 pb-2 pt-0">
        <ProtocolMedicinesReview protocolDetail={protocolDetail} />
      </div>
    )}
  </div>
);

export default ProtocolMedicinesSection;
