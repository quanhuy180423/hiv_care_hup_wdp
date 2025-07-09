import React, { useState } from "react";
import { User, Shield, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { Link } from "react-router";

interface SidebarUserProfileProps {
  children?: React.ReactNode;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "appointments"
  >("profile");

  const tabs = [
    {
      id: "profile",
      label: "Hồ sơ",
      icon: <User className="w-5 h-5 mr-2" />,
      link: "/user/profile",
    },
    {
      id: "security",
      label: "Bảo mật",
      icon: <Shield className="w-5 h-5 mr-2" />,
      link: "/user/security",
    },
    {
      id: "appointments",
      label: "Lịch hẹn",
      icon: <Calendar className="w-5 h-5 mr-2" />,
      link: "/user/appointments",
    },
  ];

  return (
    <div className="flex min-h-screen min-w-7xl mx-auto">
      {/* Main Content */}
      <div className="w-2/3 p-4 space-y-6">
        {activeTab === "profile" && <div>{children}</div>}
        {activeTab === "security" && <div className="">{children}</div>}
        {activeTab === "appointments" && <div className="">{children}</div>}
      </div>
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-50 p-4 space-y-6 sticky top-0 h-screen">
        <Card className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Tài khoản
          </h2>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <Link key={tab.id} to={tab.link}>
                <button
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center w-full rounded-lg p-2 text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </Link>
            ))}
          </nav>
        </Card>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
