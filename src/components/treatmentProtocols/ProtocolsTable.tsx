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
    <div className="overflow-x-auto rounded-lg shadow border bg-white">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
            <th className="p-3 border-b w-10 text-center">No.</th>
            <th className="p-3 border-b">Tên phác đồ</th>
            <th className="p-3 border-b">Mô tả</th>
            <th className="p-3 border-b">Bệnh</th>
            <th className="p-3 border-b">Số thuốc</th>
            <th className="p-3 border-b">Ngày tạo</th>
            <th className="p-3 border-b">Ngày cập nhật</th>
            <th className="p-3 border-b w-32">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={8}
                className="text-center p-6 text-gray-500 animate-pulse"
              >
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : protocols.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-6 text-gray-400">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            protocols.map((protocol, idx) => (
              <tr
                key={protocol.id}
                className="border-b hover:bg-gray-50 transition-colors group"
              >
                <td className="p-3 text-center text-gray-500">{idx + 1}</td>
                <td
                  className="p-3 font-semibold text-primary group-hover:underline cursor-pointer"
                  title={protocol.name}
                  onClick={() => onEdit(protocol)}
                >
                  {protocol.name}
                </td>
                <td
                  className="p-3 text-gray-700 max-w-[300px] truncate"
                  title={protocol.description || undefined}
                >
                  {protocol.description}
                </td>
                <td className="p-3 text-gray-700">{protocol.targetDisease}</td>
                <td className="p-3 text-center">{protocol.medicines.length}</td>
                <td className="p-3 text-gray-500">
                  {protocol.createdAt
                    ? new Date(protocol.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td className="p-3 text-gray-500">
                  {protocol.updatedAt
                    ? new Date(protocol.updatedAt).toLocaleString()
                    : "-"}
                </td>
                <td className="p-3 flex gap-2 justify-center items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(protocol)}
                    className="transition-colors group-hover:border-primary group-hover:text-primary"
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(protocol.id)}
                    disabled={deleteId === protocol.id}
                    className="text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteId === protocol.id ? "Đang xoá..." : "Xoá"}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isError && (
        <div className="text-red-500 mt-4 text-center">
          Lỗi khi tải dữ liệu.
        </div>
      )}
    </div>
  );
}
