import { format } from "date-fns";
import { toast } from "react-hot-toast";
import type { Appointment } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { useAppointmentsByUser } from "@/hooks/useAppointments";
import useAuth from "@/hooks/useAuth";

const AppointmentHistory = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useAppointmentsByUser(Number(user?.id));
  const isDoctor = user?.role === "DOCTOR";
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) {
    toast.error("Failed to load appointments");
    return <div className="p-4">Error loading appointments</div>;
  }

  const appointments: Appointment[] = data || [];

  const handleJoinMeeting = (url: string | null) => {
    if (url) {
      window.open(url, "_blank"); // Mở URL trong tab mới
    } else {
      toast.error("No meeting URL available");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Appointment History</h1>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold">
                {appointment.service.name}
              </h2>
              <p className="text-gray-600">{appointment.service.description}</p>
              <p>
                <strong>Time:</strong>{" "}
                {format(new Date(appointment.appointmentTime), "PPP 'at' p")}
              </p>
              <p>
                <strong>{isDoctor ? "Patient" : "Doctor"}:</strong>{" "}
                {isDoctor
                  ? appointment.user.name
                  : appointment.doctor.user.name}
              </p>
              <p>
                <strong>Type:</strong> {appointment.type}
              </p>
              <p>
                <strong>Status:</strong> {appointment.status}
              </p>
              {appointment.type === "ONLINE" && (
                <Button
                  onClick={() =>
                    handleJoinMeeting(
                      isDoctor
                        ? appointment.doctorMeetingUrl
                        : appointment.patientMeetingUrl
                    )
                  }
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Join Meeting
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
