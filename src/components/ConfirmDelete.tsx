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
  import { Button } from "@/components/ui/button";
  import { TrashIcon } from "lucide-react";
  import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
  
  interface ConfirmDeleteProps {
    onConfirm: () => void;
    title?: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
    triggerClassName?: string;
    asChild?: boolean;
    trigger?: React.ReactNode;
  }
  
  export function ConfirmDelete({
    onConfirm,
    title = "Bạn có chắc chắn muốn xóa?",
    description = "Hành động này không thể được hoàn tác. Điều này sẽ xóa vĩnh viễn dữ liệu.",
    cancelText = "Hủy",
    confirmText = "Xóa",
    triggerClassName = "",
    asChild = false,
    trigger,
  }: ConfirmDeleteProps) {
    return (
      <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {trigger ? (
                <AlertDialogTrigger asChild={asChild}>
                  {trigger}
                </AlertDialogTrigger>
              ) : (
                <AlertDialogTrigger asChild={asChild}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`cursor-pointer ${triggerClassName}`}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
              )}
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }