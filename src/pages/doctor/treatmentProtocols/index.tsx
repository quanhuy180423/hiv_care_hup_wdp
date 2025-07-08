import { ProtocolFormModal } from "@/components/treatmentProtocols/ProtocolFormModal";
import { ProtocolsTable } from "@/components/treatmentProtocols/ProtocolsTable";
import { Button } from "@/components/ui/button";
import { useTreatmentProtocols } from "@/hooks/useTreatmentProtocols";
import { treatmentProtocolsService } from "@/services/treatmentProtocolService";
import type { TreatmentProtocolType } from "@/types/treatmentProtocol";
import { useState } from "react";

export default function TreatmentProtocols() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const [page] = useState(1);
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
    limit: 20,
    search: "",
    targetDisease: "HIV",
    token,
    enabled: !!token,
  });
  const protocols = Array.isArray(protocolsRaw) ? protocolsRaw : [];

  // TODO: Thay bằng danh sách thuốc thực tế từ API
  const allMedicines = [
    { id: 1, name: "Lamivudine" },
    { id: 2, name: "Tenofovir" },
    { id: 3, name: "Efavirenz" },
  ];
  const findMedicineIdByName = (name: string) =>
    allMedicines.find((m) => m.name === name)?.id || 0;
  const findMedicineNameById = (id: number) =>
    allMedicines.find((m) => m.id === id)?.name || "";

  // Create or update
  const handleSubmit = async (values: {
    name: string;
    description: string;
    targetDisease: string;
    medicines: Array<{
      name: string;
      dosage: string;
      schedule: string;
      notes: string;
    }>;
  }) => {
    setIsPending(true);
    try {
      const mappedMedicines = values.medicines.map((m) => ({
        medicineId: findMedicineIdByName(m.name),
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

  // Delete
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
                    name: findMedicineNameById(m.medicineId),
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
