import { Button } from "@/components/ui/button";
import type { TreatmentProtocolType } from "@/types/treatmentProtocol";

interface ProtocolsTableProps {
  protocols: TreatmentProtocolType[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (protocol: TreatmentProtocolType) => void;
  onDelete: (id: number) => void;
  deleteId: number | null;
}

export function ProtocolsTable({
  protocols,
  isLoading,
  isError,
  onEdit,
  onDelete,
  deleteId,
}: ProtocolsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm bg-white rounded shadow min-w-[900px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Tên phác đồ</th>
            <th className="p-2 border">Mô tả</th>
            <th className="p-2 border">Bệnh</th>
            <th className="p-2 border">Số thuốc</th>
            <th className="p-2 border">Ngày tạo</th>
            <th className="p-2 border">Ngày cập nhật</th>
            <th className="p-2 border w-32">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {protocols.length === 0 && !isLoading ? (
            <tr>
              <td colSpan={7} className="text-center p-4">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            protocols.map((protocol) => (
              <tr key={protocol.id} className="border-b">
                <td className="p-2 border font-medium">{protocol.name}</td>
                <td
                  className="p-2 border text-gray-700 max-w-[300px] truncate"
                  title={protocol.description || undefined}
                >
                  {protocol.description}
                </td>
                <td className="p-2 border text-gray-700">
                  {protocol.targetDisease}
                </td>
                <td className="p-2 border text-center">
                  {protocol.medicines.length}
                </td>
                <td className="p-2 border text-gray-500">
                  {protocol.createdAt
                    ? new Date(protocol.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td className="p-2 border text-gray-500">
                  {protocol.updatedAt
                    ? new Date(protocol.updatedAt).toLocaleString()
                    : "-"}
                </td>
                <td className="p-2 border flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(protocol)}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(protocol.id)}
                    disabled={deleteId === protocol.id}
                  >
                    {deleteId === protocol.id ? "Đang xoá..." : "Xoá"}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isError && <div className="text-red-500 mt-2">Lỗi khi tải dữ liệu.</div>}
    </div>
  );
}
