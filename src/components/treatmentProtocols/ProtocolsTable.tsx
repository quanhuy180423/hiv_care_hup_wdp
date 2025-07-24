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
                <span className="inline-flex items-center gap-2">
                  <span className="loader border-2 border-gray-300 border-t-primary rounded-full w-5 h-5 animate-spin"></span>
                  Đang tải dữ liệu...
                </span>
              </td>
            </tr>
          ) : protocols.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-6 text-gray-400">
                <span className="flex flex-col items-center gap-2">
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mx-auto text-gray-300"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01"
                    />
                  </svg>
                  Không có dữ liệu
                </span>
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
                <td className="p-3 text-center">{protocol.medicines?.length ?? 0}</td>
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
                    <span className="sr-only">Sửa phác đồ</span>
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(protocol.id)}
                    disabled={deleteId === protocol.id}
                    className="text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteId === protocol.id ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="loader border-2 border-red-300 border-t-red-600 rounded-full w-4 h-4 animate-spin"></span>
                        Đang xoá...
                      </span>
                    ) : (
                      <>
                        <span className="sr-only">Xoá phác đồ</span>
                        Xoá
                      </>
                    )}
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
