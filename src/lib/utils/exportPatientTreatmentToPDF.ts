/* eslint-disable @typescript-eslint/no-explicit-any */
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
  // Header
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("HỒ SƠ BỆNH ÁN", 14, 18);
  doc.setFontSize(12);
  doc.text("PATIENT TREATMENT RECORD", 14, 26);

  // Reset color
  doc.setTextColor(44, 62, 80);

  // Section: Thông tin chung
  let y = 38;
  doc.setFontSize(13);
  doc.text("Thông tin chung", 14, y);
  y += 7;
  doc.setFontSize(11);
  doc.text(`Mã hồ sơ: ${treatment.id ?? "-"}`, 14, y);
  doc.text(`Bệnh nhân ID: ${treatment.patientId ?? "-"}`, 80, y);
  y += 7;
  doc.text(`Bác sĩ ID: ${treatment.doctorId ?? "-"}`, 14, y);
  doc.text(`Phác đồ ID: ${treatment.protocolId ?? "-"}`, 80, y);
  y += 7;
  doc.text(
    `Ngày bắt đầu: ${
      treatment.startDate ? formatDate(treatment.startDate) : "-"
    }`,
    14,
    y
  );
  doc.text(
    `Ngày kết thúc: ${treatment.endDate ? formatDate(treatment.endDate) : "-"}`,
    80,
    y
  );
  y += 7;
  doc.text(
    `Tổng chi phí: ${treatment.total?.toLocaleString() ?? "-"} VNĐ`,
    14,
    y
  );
  y += 10;

  // Section: Ghi chú
  if (treatment.notes) {
    doc.setFontSize(12);
    doc.setTextColor(39, 174, 96);
    doc.text("Ghi chú:", 14, y);
    doc.setTextColor(44, 62, 80);
    y += 7;
    doc.setFontSize(11);
    doc.text(treatment.notes, 14, y);
    y += 10;
  }

  // Section: Thuốc bổ sung (custom)
  if (treatment.customMedications && treatment.customMedications.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text("Thuốc bổ sung", 14, y);
    doc.setTextColor(44, 62, 80);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [["Tên thuốc", "Liều dùng", "Đơn vị", "Tần suất", "Ghi chú"]],
      body: treatment.customMedications.map((m) => [
        m.medicineName,
        m.dosage ?? "",
        m.unit ?? "",
        m.frequency ?? "",
        m.notes ?? "",
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 10 },
    });
    y = (doc as any).autoTable.previous.finalY + 8;
  }

  // Section: Thuốc phác đồ
  if (
    treatment.medicines &&
    Array.isArray(treatment.medicines) &&
    treatment.medicines.length > 0
  ) {
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text("Thuốc trong phác đồ", 14, y);
    doc.setTextColor(44, 62, 80);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [["Tên thuốc", "Liều dùng"]],
      body: treatment.medicines.map((m) => [m.name, m.dosage]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 10 },
    });
    y = (doc as any).autoTable.previous.finalY + 8;
  }

  // Section: Xét nghiệm
  if (
    treatment.tests &&
    Array.isArray(treatment.tests) &&
    treatment.tests.length > 0
  ) {
    doc.setFontSize(12);
    doc.setTextColor(39, 174, 96);
    doc.text("Danh sách xét nghiệm", 14, y);
    doc.setTextColor(44, 62, 80);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [["Tên xét nghiệm"]],
      body: treatment.tests.map((t) => [t.name]),
      theme: "grid",
      headStyles: { fillColor: [39, 174, 96], textColor: 255 },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 10 },
    });
  }

  doc.save(`patient-treatment-${treatment.id}.pdf`);
}

// Helper: format date yyyy-mm-dd -> dd/mm/yyyy
function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}
