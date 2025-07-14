import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import TestResultForm from "./TestResultForm";
import type { Appointment } from "@/types/appointment";
import { useState } from "react";
// import { Modal } from "@/components/ui/modal";

interface TestResultActionCellProps {
  appointment: Appointment;
}

const TestResultActionCell = ({ appointment }: TestResultActionCellProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={handleOpenModal} className="cursor-pointer">
          Cập nhật kết quả
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Xem chi tiết
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* {isModalOpen && (
        // <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        //   <TestResultForm appointment={appointment} />
        // </Modal>
      )} */}
    </DropdownMenu>
  );
};

export default TestResultActionCell;
