import { useActiveServices } from "@/hooks/useServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  const { data, isLoading, error } = useActiveServices({ page: 1, limit: 12 });

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div className="text-center text-red-500">Không thể tải danh sách dịch vụ.</div>;

  if (!data || data.data.length === 0)
    return <div className="text-center text-gray-500">Hiện tại chưa có dịch vụ nào được kích hoạt.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Các Dịch Vụ Hiện Có</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Dưới đây là các dịch vụ y tế mà bạn có thể đăng ký hoặc tham khảo thêm thông tin chi tiết.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.data.map((service) => (
          <Link to={`/services/${service.slug}`} key={service.id} className="no-underline">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Giá: {service.price} VNĐ</p>
                <p className="text-sm">Loại: {service.type}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
