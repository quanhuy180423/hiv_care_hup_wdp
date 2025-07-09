import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { PatientTreatmentType } from "@/types/patientTreatment";

// Extend PatientTreatmentType to include optional medicines/tests for export
export interface ExportablePatientTreatment extends PatientTreatmentType {
  medicines?: Array<{ name: string; dosage: string }>;
  tests?: Array<{ name: string }>;
}

export function exportPatientTreatmentToPDF(
  treatment: ExportablePatientTreatment
) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("HỒ SƠ BỆNH ÁN / PATIENT TREATMENT RECORD", 14, 18);

  doc.setFontSize(12);
  doc.text(`Mã hồ sơ: ${treatment.id}`, 14, 30);
  doc.text(`Bệnh nhân ID: ${treatment.patientId}`, 14, 38);
  doc.text(`Bác sĩ ID: ${treatment.doctorId}`, 14, 46);
  doc.text(`Phác đồ ID: ${treatment.protocolId}`, 14, 54);
  doc.text(`Ngày bắt đầu: ${treatment.startDate}`, 14, 62);
  doc.text(`Ngày kết thúc: ${treatment.endDate || "-"}`, 14, 70);
  doc.text(`Tổng chi phí: ${treatment.total} VNĐ`, 14, 78);

  let y = 86;
  if (treatment.notes) {
    doc.text("Ghi chú:", 14, y);
    y += 8;
    doc.text(treatment.notes, 14, y);
    y += 8;
  }

  if (treatment.customMedications) {
    doc.text("Thuốc custom:", 14, y);
    y += 8;
    doc.text(JSON.stringify(treatment.customMedications, null, 2), 14, y);
    y += 12;
  }

  // Medicines table (if available)
  if (
    treatment.medicines &&
    Array.isArray(treatment.medicines) &&
    treatment.medicines.length > 0
  ) {
    autoTable(doc, {
      startY: y,
      head: [["Tên thuốc", "Liều dùng"]],
      body: treatment.medicines.map((m) => [m.name, m.dosage]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).autoTable.previous.finalY + 8;
  }

  // Tests table (if available)
  if (
    treatment.tests &&
    Array.isArray(treatment.tests) &&
    treatment.tests.length > 0
  ) {
    autoTable(doc, {
      startY: y,
      head: [["Tên xét nghiệm"]],
      body: treatment.tests.map((t) => [t.name]),
      theme: "grid",
      headStyles: { fillColor: [39, 174, 96] },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save(`patient-treatment-${treatment.id}.pdf`);
}
