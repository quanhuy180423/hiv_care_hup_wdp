import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Stethoscope,
  Heart,
  Shield,
  Users,
  Phone,
  Video,
  FileText,
  Brain,
  Pill,
  Activity,
  MessageCircle,
} from "lucide-react";

export function ServicesPage() {
  const mainServices = [
    {
      icon: Stethoscope,
      title: "Tư vấn y tế chuyên khoa",
      description:
        "Tư vấn trực tuyến với đội ngũ bác sĩ chuyên khoa HIV/AIDS có kinh nghiệm",
      features: [
        "Tư vấn 1-1 với bác sĩ chuyên khoa",
        "Đánh giá tình trạng sức khỏe",
        "Lập kế hoạch điều trị cá nhân",
        "Theo dõi tiến triển bệnh",
      ],
    },
    {
      icon: Heart,
      title: "Chăm sóc sức khỏe toàn diện",
      description:
        "Dịch vụ chăm sóc sức khỏe tổng thể, không chỉ tập trung vào HIV",
      features: [
        "Kiểm tra sức khỏe định kỳ",
        "Tầm soát các bệnh đi kèm",
        "Chăm sóc sức khỏe tâm thần",
        "Dinh dưỡng và lối sống lành mạnh",
      ],
    },
    {
      icon: Shield,
      title: "Hỗ trợ tâm lý và xã hội",
      description: "Hỗ trợ tâm lý chuyên nghiệp và kết nối cộng đồng",
      features: [
        "Tư vấn tâm lý cá nhân",
        "Nhóm hỗ trợ cộng đồng",
        "Giảm kỳ thị xã hội",
        "Hỗ trợ gia đình",
      ],
    },
  ];

  const additionalServices = [
    {
      icon: Video,
      title: "Tele-health",
      description: "Khám bệnh từ xa qua video call",
    },
    {
      icon: Phone,
      title: "Hotline 24/7",
      description: "Hỗ trợ khẩn cấp mọi lúc",
    },
    {
      icon: FileText,
      title: "Hồ sơ điện tử",
      description: "Quản lý hồ sơ bệnh án số hóa",
    },
    {
      icon: Brain,
      title: "AI Phân tích",
      description: "Phân tích dữ liệu bằng AI",
    },
    {
      icon: Pill,
      title: "Quản lý thuốc",
      description: "Nhắc nhở và theo dõi thuốc",
    },
    {
      icon: Activity,
      title: "Theo dõi sinh hiệu",
      description: "Giám sát các chỉ số sức khỏe",
    },
    {
      icon: MessageCircle,
      title: "Chat hỗ trợ",
      description: "Trò chuyện trực tiếp với chuyên gia",
    },
    {
      icon: Users,
      title: "Cộng đồng",
      description: "Kết nối với cộng đồng người cùng cảnh ngộ",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Đăng ký tài khoản",
      description: "Tạo tài khoản và hoàn thành thông tin cá nhân",
    },
    {
      step: "02",
      title: "Đánh giá ban đầu",
      description: "Bác sĩ đánh giá tình trạng và lập kế hoạch",
    },
    {
      step: "03",
      title: "Bắt đầu điều trị",
      description: "Triển khai kế hoạch chăm sóc cá nhân hóa",
    },
    {
      step: "04",
      title: "Theo dõi liên tục",
      description: "Giám sát và điều chỉnh kế hoạch điều trị",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          <Stethoscope className="h-4 w-4" />
          Dịch vụ chăm sóc
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Dịch vụ chăm sóc sức khỏe toàn diện
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe chuyên nghiệp, tập trung
          vào người nhiễm HIV với phương pháp tiếp cận hiện đại và nhân văn
        </p>
      </div>

      {/* Main Services */}
      <div className="grid lg:grid-cols-3 gap-8">
        {mainServices.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <Card key={index} className="h-full">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Services Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Dịch vụ bổ sung</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Các dịch vụ hỗ trợ khác giúp nâng cao chất lượng chăm sóc và trải
            nghiệm của bạn
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {additionalServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-md transition-shadow"
              >
                <div className="mx-auto w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-muted/50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Quy trình chăm sóc</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quy trình 4 bước đơn giản để bắt đầu hành trình chăm sóc sức khỏe
            của bạn
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {process.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">
                  {step.step}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>

              {index < process.length - 1 && (
                <div className="hidden md:block mt-8">
                  <div className="w-full h-px bg-border"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
          <div className="text-sm text-muted-foreground">
            Bệnh nhân tin tưởng
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-2">50+</div>
          <div className="text-sm text-muted-foreground">
            Bác sĩ chuyên khoa
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-2">24/7</div>
          <div className="text-sm text-muted-foreground">
            Hỗ trợ không ngừng
          </div>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary mb-2">98%</div>
          <div className="text-sm text-muted-foreground">Hài lòng dịch vụ</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
        <h2 className="text-3xl font-bold">Sẵn sàng bắt đầu?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Đăng ký ngay hôm nay để được tư vấn miễn phí với đội ngũ chuyên gia
          của chúng tôi
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">Đăng ký tư vấn miễn phí</Button>
          <Button variant="outline" size="lg">
            Tìm hiểu thêm
          </Button>
        </div>
      </div>
    </div>
  );
}
