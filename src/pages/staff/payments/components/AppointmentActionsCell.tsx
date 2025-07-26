import React from "react";
interface AppointmentActionsCellProps {
  appointmentId: number;
}
const AppointmentActionsCell = ({
  appointmentId,
}: AppointmentActionsCellProps) => {
  return <div>AppointmentActionsCell: {appointmentId}</div>;
};

export default AppointmentActionsCell;
