import { Badge } from "@/components/ui/badge";

const typeConfig = {
  CONSULT: {
    label: "Tư vấn",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  TREATMENT: {
    label: "Điều trị",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  ONLINE: {
    label: "Trực tuyến",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  OFFLINE: {
    label: "Tại phòng khám",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
} as const;

export const TypeBadge = ({ type }: { type: keyof typeof typeConfig }) => {
  const config = typeConfig[type] || {
    label: type,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };

  return <Badge className={config.className}>{config.label}</Badge>;
};
