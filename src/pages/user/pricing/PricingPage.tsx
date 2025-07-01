import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Star, Zap, Crown, Shield } from "lucide-react";

export function PricingPage() {
  const pricingPlans = [
    {
      name: "Cơ bản",
      icon: Shield,
      price: "299,000",
      period: "tháng",
      description: "Phù hợp cho cá nhân mới bắt đầu",
      features: [
        "Tư vấn trực tuyến cơ bản",
        "Kiểm tra định kỳ (1 tháng/lần)",
        "Hỗ trợ qua email",
        "Thông tin y tế cơ bản",
        "Nhắc nhở uống thuốc",
      ],
      popular: false,
      buttonText: "Chọn gói Cơ bản",
    },
    {
      name: "Tiêu chuẩn",
      icon: Star,
      price: "599,000",
      period: "tháng",
      description: "Lựa chọn phổ biến nhất",
      features: [
        "Tất cả tính năng gói Cơ bản",
        "Tư vấn trực tuyến chuyên sâu",
        "Kiểm tra định kỳ (2 tuần/lần)",
        "Hỗ trợ qua điện thoại",
        "Báo cáo sức khỏe chi tiết",
        "Chế độ dinh dưỡng cá nhân hóa",
        "Cộng đồng hỗ trợ",
      ],
      popular: true,
      buttonText: "Chọn gói Tiêu chuẩn",
    },
    {
      name: "Cao cấp",
      icon: Crown,
      price: "999,000",
      period: "tháng",
      description: "Chăm sóc toàn diện và ưu tiên",
      features: [
        "Tất cả tính năng gói Tiêu chuẩn",
        "Tư vấn 1-1 với chuyên gia",
        "Kiểm tra định kỳ (1 tuần/lần)",
        "Hỗ trợ 24/7",
        "Báo cáo chi tiết + phân tích AI",
        "Chế độ tập luyện cá nhân",
        "Ưu tiên đặt lịch hẹn",
        "Tư vấn tâm lý miễn phí",
      ],
      popular: false,
      buttonText: "Chọn gói Cao cấp",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          <Zap className="h-4 w-4" />
          Bảng giá dịch vụ
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Chọn gói dịch vụ phù hợp
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Chúng tôi cung cấp các gói dịch vụ chăm sóc sức khỏe linh hoạt, phù
          hợp với nhu cầu và ngân sách của bạn
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Phổ biến nhất
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-3xl font-bold">{plan.price}₫</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/50 rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          Câu hỏi thường gặp
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">
              Có thể thay đổi gói dịch vụ không?
            </h3>
            <p className="text-sm text-muted-foreground">
              Có, bạn có thể nâng cấp hoặc hạ cấp gói dịch vụ bất kỳ lúc nào.
              Thay đổi sẽ có hiệu lực từ chu kỳ thanh toán tiếp theo.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              Có cam kết thời gian tối thiểu không?
            </h3>
            <p className="text-sm text-muted-foreground">
              Không, tất cả các gói đều thanh toán hàng tháng và bạn có thể hủy
              bất kỳ lúc nào mà không bị ràng buộc.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Có hỗ trợ khách hàng không?</h3>
            <p className="text-sm text-muted-foreground">
              Có, tất cả các gói đều được hỗ trợ. Gói Cao cấp có hỗ trợ 24/7,
              các gói khác có hỗ trợ trong giờ hành chính.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              Có thể dùng thử miễn phí không?
            </h3>
            <p className="text-sm text-muted-foreground">
              Có, chúng tôi cung cấp dùng thử miễn phí 7 ngày cho gói Tiêu
              chuẩn. Liên hệ với chúng tôi để đăng ký.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold">Cần tư vấn thêm?</h2>
        <p className="text-muted-foreground">
          Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn gói dịch vụ
          phù hợp nhất
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Liên hệ tư vấn miễn phí</Button>
          <Button variant="outline" size="lg">
            So sánh chi tiết các gói
          </Button>
        </div>
      </div>
    </div>
  );
}
