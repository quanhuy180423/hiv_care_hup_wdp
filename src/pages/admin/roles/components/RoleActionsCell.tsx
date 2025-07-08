import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRoleDrawerStore, useRoleModalStore } from "@/store/roleStore";
import { useDeleteRole } from "@/hooks/useRoles";
import type { Role } from "@/types/role";
import { ConfirmDelete } from "@/components/ConfirmDelete";

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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => openModal(role)} 
              className="cursor-pointer"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>

      <ConfirmDelete
        onConfirm={() => deleteRole(role.id)}
        description={`Hành động này không thể được hoàn tác. Điều này sẽ xóa vĩnh viễn vai trò ${role.name}.`}
      />
    </div>
  );
}