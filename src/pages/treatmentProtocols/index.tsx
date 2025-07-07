import { ProtocolFormModal } from "@/components/treatmentProtocols/ProtocolFormModal";
import { ProtocolsTable } from "@/components/treatmentProtocols/ProtocolsTable";
import { Button } from "@/components/ui/button";
import { useTreatmentProtocols } from "@/hooks/useTreatmentProtocols";
import { treatmentProtocolsService } from "@/services/treatmentProtocolService";
import { useState } from "react";

export default function TreatmentProtocolsPage() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const [page] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProtocol, setEditProtocol] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const {
    data: protocols = [],
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

  // Create or update
  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    setIsPending(true);
    try {
      if (editProtocol) {
        await treatmentProtocolsService.update(editProtocol.id, values, token);
      } else {
        await treatmentProtocolsService.create(values, token);
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
    <div className="p-6 max-w-3xl mx-auto">
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
        initialData={editProtocol}
        isPending={isPending}
      />
    </div>
  );
}
