import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRoleDrawerStore, useRoleModalStore } from "@/store/roleStore";
import { useDeleteRole } from "@/hooks/useRoles";
import type { Role } from "@/types/role";

export default function RoleActionsCell({ role }: { role: Role }) {
  const { openModal } = useRoleModalStore();
  const { openDrawer } = useRoleDrawerStore();
  const { mutate: deleteRole } = useDeleteRole();

  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDrawer(role)}
              className="cursor-pointer"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => openModal(role)} className="cursor-pointer">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
            Hành động này không thể được hoàn tác. Điều này sẽ xóa vĩnh viễn vai trò.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteRole(role.id)}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
