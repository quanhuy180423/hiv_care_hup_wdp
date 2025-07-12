import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Key, Pencil } from "lucide-react";
import type { Permission } from "@/types/permission";
import { formatDate } from "@/lib/utils/dates/formatDate";

interface PermissionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  permission: Permission | null;
  onEdit: () => void;
}

export function PermissionDetailsDrawer({
  isOpen,
  onClose,
  permission,
  onEdit,
}: PermissionDetailsDrawerProps) {
  if (!permission) return null;

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
    <Drawer open={isOpen} onClose={onClose} direction="right">
      <DrawerContent className="bg-white h-screen max-w-md flex flex-col border-l shadow-lg">
        <DrawerHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DrawerTitle className="text-lg font-semibold text-gray-900">
                {permission.name}
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground">
                Chi tiết quyền truy cập
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
          <div className="space-y-2 bg-gray-50 border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">Đường dẫn API:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                {permission.path}
              </code>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">
                Phương thức HTTP:
              </span>
              <Badge
                variant="outline"
                className={getMethodColor(permission.method)}
              >
                {permission.method}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-gray-500 font-medium">Mã quyền</h3>
              <p>{permission.id}</p>
            </div>
            <div>
              <h3 className="text-gray-500 font-medium">Ngày tạo</h3>
              <p>
                {permission.createdAt
                  ? formatDate(permission.createdAt, "dd/mm/yyyy")
                  : "Không có"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-gray-500 font-medium mb-1">Mô tả</h3>
            <p>{permission.description || "Không có mô tả"}</p>
          </div>

          {permission.updatedAt && (
            <div>
              <h3 className="text-gray-500 font-medium mb-1">
                Cập nhật lần cuối
              </h3>
              <p>{formatDate(permission.updatedAt, "dd/mm/yyyy")}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button
            onClick={onEdit}
            className="gap-2 cursor-pointer"
            variant="outline"
          >
            <Pencil className="h-4 w-4" />
            Chỉnh sửa quyền
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
