import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Permission } from "@/types/permission";

interface PermissionSelectorProps {
  permissions: Permission[];
  value: number[];
  onChange: (value: number[]) => void;
}

export default function PermissionSelector({
  permissions,
  value,
  onChange,
}: PermissionSelectorProps) {
  const [search, setSearch] = useState("");

  const safePermissions = Array.isArray(permissions) ? permissions : [];
  const filteredPermissions = safePermissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(search.toLowerCase()) ||
      permission.path.toLowerCase().includes(search.toLowerCase()) ||
      permission.description?.toLowerCase().includes(search.toLowerCase())
  );

  const togglePermission = (permissionId: number) => {
    if (value.includes(permissionId)) {
      onChange(value.filter((id) => id !== permissionId));
    } else {
      onChange([...value, permissionId]);
    }
  };

  const getMethodColor = (method?: string) => {
    if (!method) return "bg-gray-100 text-gray-800";
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-100 text-blue-800";
      case "POST":
        return "bg-green-100 text-green-800";
      case "PUT":
        return "bg-orange-100 text-orange-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Tìm kiếm */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm quyền hạn..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tổng số đã chọn */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Đã chọn:</span>
        <Badge variant="outline">{value.length}</Badge>
      </div>

      {/* Danh sách quyền */}
      <ScrollArea className="h-64 rounded-md border p-2">
        <div className="space-y-2">
          {filteredPermissions.length > 0 ? (
            filteredPermissions.map((permission) => (
              <div
                key={permission.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  value.includes(permission.id)
                    ? "border-primary bg-gray-300 text-primary"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => togglePermission(permission.id)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getMethodColor(
                      permission.method
                    )}`}
                  >
                    {permission.method || "Không rõ"}
                  </span>
                  <span className="font-medium">{permission.name}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {permission.path}
                </div>
                {permission.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {permission.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy quyền nào phù hợp
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
