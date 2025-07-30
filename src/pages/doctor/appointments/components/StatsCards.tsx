import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

export const StatsCards = ({
  stats,
}: {
  stats: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
}) => {
  const cards = [
    {
      title: "Tổng lịch hẹn",
      value: stats?.total || 0,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      icon: Calendar,
    },
    {
      title: "Đang chờ",
      value: stats?.pending || 0,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      icon: Clock,
    },
    {
      title: "Hoàn tất",
      value: stats?.completed || 0,
      color: "bg-green-500",
      textColor: "text-green-600",
      icon: CheckCircle,
    },
    {
      title: "Đã hủy",
      value: stats?.cancelled || 0,
      color: "bg-red-500",
      textColor: "text-red-600",
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className="p-3 rounded-lg">
                  <IconComponent className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};