import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { useState } from "react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Điện thoại",
      details: [
        { label: "Hotline 24/7", value: "1900 xxxx" },
        { label: "Tư vấn", value: "(024) 3xxx xxxx" },
      ],
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        { label: "Hỗ trợ chung", value: "support@hivcarehub.vn" },
        { label: "Khẩn cấp", value: "emergency@hivcarehub.vn" },
      ],
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: [
        { label: "Trụ sở chính", value: "123 Đường ABC, Quận 1, TP.HCM" },
        { label: "Chi nhánh HN", value: "456 Đường XYZ, Đống Đa, Hà Nội" },
      ],
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      details: [
        { label: "Thứ 2 - Thứ 6", value: "8:00 - 18:00" },
        { label: "Cuối tuần", value: "9:00 - 17:00" },
      ],
    },
  ];

  const offices = [
    {
      city: "TP. Hồ Chí Minh",
      address: "123 Đường Nguyễn Văn Cừ, Quận 1",
      phone: "(028) 3xxx xxxx",
      email: "hcm@hivcarehub.vn",
      hours: "8:00 - 18:00 (T2-T6)",
    },
    {
      city: "Hà Nội",
      address: "456 Đường Láng, Đống Đa",
      phone: "(024) 3xxx xxxx",
      email: "hanoi@hivcarehub.vn",
      hours: "8:00 - 18:00 (T2-T6)",
    },
    {
      city: "Đà Nẵng",
      address: "789 Đường Trần Phú, Hải Châu",
      phone: "(0236) 3xxx xxxx",
      email: "danang@hivcarehub.vn",
      hours: "8:00 - 17:00 (T2-T6)",
    },
  ];

  const faqs = [
    {
      question: "Làm thế nào để đặt lịch hẹn?",
      answer:
        "Bạn có thể đặt lịch qua hotline, website, hoặc ứng dụng di động của chúng tôi.",
    },
    {
      question: "Dịch vụ có hỗ trợ tư vấn trực tuyến không?",
      answer:
        "Có, chúng tôi cung cấp dịch vụ tư vấn trực tuyến 24/7 qua video call và chat.",
    },
    {
      question: "Chi phí dịch vụ như thế nào?",
      answer:
        "Chi phí tùy thuộc vào gói dịch vụ. Vui lòng tham khảo trang Bảng giá hoặc liên hệ để được tư vấn.",
    },
    {
      question: "Thông tin cá nhân có được bảo mật không?",
      answer:
        "Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân và y tế của bệnh nhân.",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý gửi form
    console.log("Form submitted:", formData);
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong 24h.");
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          <MessageCircle className="h-4 w-4" />
          Liên hệ với chúng tôi
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7.
          Hãy liên hệ với chúng tôi qua bất kỳ kênh nào thuận tiện nhất
        </p>
      </div>

      {/* Quick Contact Info */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, index) => {
          const IconComponent = info.icon;
          return (
            <Card key={index} className="text-center">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{info.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {info.details.map((detail, detailIndex) => (
                  <div key={detailIndex}>
                    <div className="text-sm text-muted-foreground">
                      {detail.label}
                    </div>
                    <div className="font-medium">{detail.value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Gửi tin nhắn cho chúng tôi
              </CardTitle>
              <CardDescription>
                Điền thông tin và chúng tôi sẽ phản hồi trong vòng 24 giờ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Chủ đề *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Chủ đề cần tư vấn"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nội dung tin nhắn *</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                    className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Thông tin của bạn sẽ được bảo mật tuyệt đối
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Gửi tin nhắn
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Liên hệ khẩn cấp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">1900 xxxx</div>
                <div className="text-sm text-muted-foreground">
                  Hotline 24/7
                </div>
              </div>
              <Button variant="destructive" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Gọi ngay
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Đặt lịch hẹn
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat trực tuyến
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Tạo tài khoản
              </Button>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Câu hỏi thường gặp</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-sm">{faq.question}</h4>
                  <p className="text-xs text-muted-foreground">{faq.answer}</p>
                  {index < faqs.length - 1 && <hr className="my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Office Locations */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Văn phòng của chúng tôi</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hệ thống văn phòng trên toàn quốc để phục vụ bạn tốt nhất
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {offices.map((office, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {office.city}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{office.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{office.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{office.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{office.hours}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Tìm đường đến văn phòng</h2>
        <p className="text-muted-foreground mb-6">
          Sử dụng Google Maps để tìm đường đến văn phòng gần bạn nhất
        </p>
        <div className="bg-white rounded-lg p-8 border-2 border-dashed border-border">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Bản đồ tương tác sẽ được hiển thị ở đây
          </p>
          <Button variant="outline" className="mt-4">
            Xem trên Google Maps
          </Button>
        </div>
      </div>
    </div>
  );
}
