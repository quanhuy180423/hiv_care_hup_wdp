import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ExistingTreatment {
  id: number;
  patientId: number;
  patientName?: string;
}

interface ExistingTreatmentDialogProps {
  show: boolean;
  existingTreatment: ExistingTreatment | null;
  onClose: () => void;
  onEdit: (id: number) => void;
}

const ExistingTreatmentDialog: React.FC<ExistingTreatmentDialogProps> = ({
  show,
  existingTreatment,
  onClose,
  onEdit,
}) => {
  if (!show || !existingTreatment) return null;
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white rounded-xl shadow-xl p-0 overflow-hidden flex flex-col items-center">
        <AlertDialogHeader className="w-full flex flex-col items-center pt-6">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="bg-yellow-100 rounded-full p-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
            </div>
            <DialogTitle className="text-lg font-bold text-yellow-700 text-center mb-1">
              Hồ sơ điều trị đã tồn tại
            </DialogTitle>
          </div>
        </AlertDialogHeader>
        <div className="px-6 pb-2 text-gray-700 text-center">
          <span className="font-medium text-gray-900">
            Bệnh nhân #{existingTreatment.patientId}
          </span>{" "}
          đã có hồ sơ điều trị đang hoạt động.
          <br />
          Bạn có muốn chuyển sang trang chỉnh sửa hồ sơ này không?
        </div>
        <div className="flex justify-center gap-3 w-full px-6 pb-6 mt-2">
          <Button variant="outline" className="w-1/2" onClick={onClose}>
            Để sau
          </Button>
          <Button
            className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
            onClick={() => onEdit(existingTreatment.id)}
          >
            Chỉnh sửa ngay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExistingTreatmentDialog;
