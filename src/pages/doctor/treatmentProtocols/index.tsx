import { ProtocolFormModal } from "@/components/treatmentProtocols/ProtocolFormModal";
import { ProtocolsTable } from "@/components/treatmentProtocols/ProtocolsTable";
import { Button } from "@/components/ui/button";
import { useTreatmentProtocols } from "@/hooks/useTreatmentProtocols";

import { treatmentProtocolsService, type TreatmentProtocolCreateInput } from "@/services/treatmentProtocolService";
import type { TreatmentProtocolType } from "@/types/treatmentProtocol";
import { useState } from "react";

export default function TreatmentProtocols() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProtocol, setEditProtocol] =
    useState<TreatmentProtocolType | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: protocolsRaw,
    isLoading,
    isError,
    refetch,
  } = useTreatmentProtocols({
    page,
    limit: 5,
    search: "",
    targetDisease: "HIV",
  });

  const protocols = Array.isArray(protocolsRaw?.data?.data)
    ? protocolsRaw.data.data
    : [];
  const meta = protocolsRaw?.data?.meta || {
    page: 1,
    totalPages: 1,
    totalItems: 0,
  };
  console.log(`Meta data:`, meta);

  // Handle create or update protocol
  const handleSubmit = async (values: TreatmentProtocolCreateInput) => {
    // Validate medicines before submit
    if (
      values.medicines.length === 0 ||
      values.medicines.some(
        (m) => !m.dosage.trim() || isNaN(Number(m.id)) || Number(m.id) <= 0
      )
    ) {
      alert("Vui lòng chọn thuốc hợp lệ và nhập đủ liều dùng cho từng thuốc.");
      return;
    }
    setIsPending(true);
    try {
      const mappedMedicines = values.medicines.map((m) => ({
        medicineId: Number(m.id),
        dosage: m.dosage,
        duration: m.schedule,
        notes: m.notes,
      }));
      const submitData = {
        name: values.name,
        description: values.description,
        targetDisease: values.targetDisease,
        medicines: mappedMedicines,
      };
      if (editProtocol) {
        await treatmentProtocolsService.update(
          editProtocol.id,
          submitData,
          token
        );
      } else {
        await treatmentProtocolsService.create(submitData, token);
      }
      setModalOpen(false);
      setEditProtocol(null);
      refetch();
    } catch (e) {
      alert(
        `Có lỗi xảy ra khi ${editProtocol ? "cập nhật" : "tạo"} phác đồ: ${e}`
      );
    } finally {
      setIsPending(false);
    }
  };

  // Handle delete protocol
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá phác đồ này?")) return;
    setDeleteId(id);
    try {
      await treatmentProtocolsService.delete(Number(id), token);
      refetch();
    } catch (e) {
      alert(`Có lỗi xảy ra khi xoá phác đồ: ${e}`);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý phác đồ điều trị</h1>
        <Button
          onClick={() => {
            setEditProtocol(null);
            setModalOpen(true);
          }}
          variant="outline"
        >
          Tạo mới
        </Button>
      </div>
      {isLoading && <div>Đang tải dữ liệu...</div>}
      {isError && (
        <div className="text-red-500">Lỗi khi tải phác đồ điều trị.</div>
      )}
      <ProtocolsTable
        protocols={protocols}
        isLoading={isLoading}
        isError={isError}
        onEdit={(protocol) => {
          setEditProtocol(protocol);
          setModalOpen(true);
        }}
        onDelete={(id) => handleDelete(String(id))}
        deleteId={deleteId ? Number(deleteId) : null}
      />
      {/* Pagination UI */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trang trước
          </Button>
          <span className="flex items-center gap-2">
            Trang {meta.page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
          >
            Trang sau
          </Button>
        </div>
      )}
      <ProtocolFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProtocol(null);
        }}
        onSubmit={handleSubmit}
        initialData={
          editProtocol
            ? {
                name: editProtocol.name,
                description: editProtocol.description ?? "",
                targetDisease: editProtocol.targetDisease ?? "HIV",
                medicines:
                  editProtocol.medicines?.map((m) => ({
                    id: m.medicineId,
                    dosage: m.dosage,
                    schedule: m.duration,
                    notes: m.notes ?? "",
                  })) || [],
              }
            : null
        }
        isPending={isPending}
      />
    </div>
  );
}
