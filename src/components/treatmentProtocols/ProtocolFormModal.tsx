import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ProtocolFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; description: string }) => void;
  initialData?: { name: string; description: string } | null;
  isPending?: boolean;
}

export function ProtocolFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: ProtocolFormModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
  }, [open, initialData]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Cập nhật phác đồ" : "Tạo phác đồ mới"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, description });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-medium mb-1">Tên phác đồ</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Mô tả</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isPending}>
              {initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
