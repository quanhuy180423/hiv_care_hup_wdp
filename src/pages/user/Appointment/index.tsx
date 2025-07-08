import React from "react";
import RegisterAppointment from "./RegisterAppointment";

const AppointmentPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left: Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-white">
        <img
          src="https://i.pinimg.com/736x/06/e4/d0/06e4d022c1480e07b032b3dc2f3e03e2.jpg"
          alt="Khám bệnh"
          className="object-cover w-full h-full max-h-[700px] rounded-none md:rounded-l-2xl shadow-xl"
        />
      </div>
      {/* Right: Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-0 md:p-8">
        <RegisterAppointment />
      </div>
    </div>
  );
};

export default AppointmentPage;
