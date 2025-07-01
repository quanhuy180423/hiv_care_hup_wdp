import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRoleDrawerStore, useRoleModalStore } from "@/store/roleStore";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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

type RoleDetailsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function RoleDetailsDrawer({
  open,
  onClose,
}: RoleDetailsDrawerProps) {
  const { selectedRole, closeDrawer } = useRoleDrawerStore();
  const { openModal } = useRoleModalStore();

  if (!selectedRole) return null;

  return (
    <Drawer open={open} onClose={onClose} direction="right">
      <DrawerContent className="bg-white h-screen max-w-md flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-between">
            <span>{selectedRole.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                closeDrawer();
                openModal(selectedRole);
              }}
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Mã vai trò
                </h3>
                <p>{selectedRole.id}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Trạng thái
                </h3>
                <Badge
                  variant={selectedRole.isActive ? "default" : "destructive"}
                  className={
                    selectedRole.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {selectedRole.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
                <p>
                  {selectedRole.createdAt
                    ? new Date(selectedRole.createdAt).toLocaleDateString()
                    : "Không xác định"}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Ngày cập nhật
                </h3>
                <p>
                  {selectedRole.updatedAt
                    ? new Date(selectedRole.updatedAt).toLocaleDateString()
                    : "Không xác định"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Mô tả</h3>
              <p className="text-gray-700">
                {selectedRole.description || "Không có mô tả"}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Quyền hạn</h3>
                <Badge variant="outline">
                  {selectedRole.permissions?.length || 0} quyền
                </Badge>
              </div>

              {selectedRole.permissions &&
              selectedRole.permissions.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {selectedRole.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getMethodColor(
                            permission.method
                          )}`}
                        >
                          {permission.method || "Không rõ"}
                        </span>
                        <span className="font-medium">{permission.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {permission.path}
                      </div>
                      {permission.description && (
                        <p className="mt-2 text-sm text-gray-500">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có quyền nào được gán cho vai trò này
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
