import { UserCircle2 } from "lucide-react";
import React from "react";

interface PatientInfoCardProps {
  name?: string;
  phoneNumber?: string;
  email?: string;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  name,
  phoneNumber,
  email,
}) => (
  <div className="bg-white rounded-2xl shadow p-7 min-h-[350px] flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <UserCircle2 className="w-14 h-14 text-gray-300" />
        </div>
        <div>
          <div className="font-semibold text-lg">{name || ""}</div>
        </div>
      </div>
      <div className="text-sm mb-3 space-y-1">
        <div className="font-semibold mb-1">Thông tin cá nhân</div>
        <div>
          <span className="font-medium">SĐT:</span>{" "}
          <span className="text-gray-700">{phoneNumber || "-"}</span>
        </div>
        <div>
          <span className="font-medium">Email:</span>{" "}
          <span className="text-gray-700">{email || "-"}</span>
        </div>
      </div>
      <div className="text-sm mt-5 space-y-1">
        <div className="font-semibold mb-1">Thông tin y tế</div>
        <div>
          <span className="font-medium">Phác đồ hiện tại:</span>
          <span className="text-gray-700">-</span>
        </div>
      </div>
    </div>
  </div>
);

export default PatientInfoCard;
