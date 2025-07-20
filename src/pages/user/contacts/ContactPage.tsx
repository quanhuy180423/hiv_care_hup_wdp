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
  Shield,
  ArrowRight,
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
      color: "bg-blue-100 text-blue-600",
      details: [
        { label: "Hotline 24/7", value: "1900 xxxx" },
        { label: "Tư vấn", value: "(024) 3xxx xxxx" },
      ],
    },
    {
      icon: Mail,
      title: "Email",
      color: "bg-purple-100 text-purple-600",
      details: [
        { label: "Hỗ trợ chung", value: "support@hivcarehub.vn" },
        { label: "Khẩn cấp", value: "emergency@hivcarehub.vn" },
      ],
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      color: "bg-green-100 text-green-600",
      details: [
        { label: "Trụ sở chính", value: "123 Đường ABC, Quận 1, TP.HCM" },
        { label: "Chi nhánh HN", value: "456 Đường XYZ, Đống Đa, Hà Nội" },
      ],
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      color: "bg-orange-100 text-orange-600",
      details: [
        { label: "Thứ 2 - Thứ 6", value: "8:00 - 18:00" },
        { label: "Cuối tuần", value: "9:00 - 17:00" },
      ],
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              <MessageCircle className="h-4 w-4" />
              Liên hệ với chúng tôi
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Chúng tôi luôn sẵn sàng
              <span className="text-purple-600 block">hỗ trợ bạn</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7.
              Hãy liên hệ với chúng tôi qua bất kỳ kênh nào thuận tiện nhất
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className={`mx-auto w-16 h-16 ${info.color} rounded-full flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {info.details.map((detail, detailIndex) => (
                      <div key={detailIndex}>
                        <div className="text-sm text-gray-500 mb-1">
                          {detail.label}
                        </div>
                        <div className="font-semibold text-gray-900">{detail.value}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 text-gray-900 py-8">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Send className="h-6 w-6 text-purple-600" />
                    </div>
                    Gửi tin nhắn cho chúng tôi
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base mt-2">
                    Điền thông tin và chúng tôi sẽ phản hồi trong vòng 24 giờ
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-gray-800 font-semibold text-sm uppercase tracking-wide">Họ và tên *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Nhập họ và tên"
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 h-12 text-base"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-gray-800 font-semibold text-sm uppercase tracking-wide">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Nhập email"
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 h-12 text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-gray-800 font-semibold text-sm uppercase tracking-wide">Số điện thoại</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Nhập số điện thoại"
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="subject" className="text-gray-800 font-semibold text-sm uppercase tracking-wide">Chủ đề *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Chủ đề cần tư vấn"
                          className="border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 h-12 text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-gray-800 font-semibold text-sm uppercase tracking-wide">Nội dung tin nhắn *</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                        className="w-full min-h-[140px] px-4 py-4 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-y"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-purple-800 font-medium">Thông tin của bạn sẽ được bảo mật tuyệt đối</span>
                    </div>

                    <Button type="submit" size="lg" className="w-full sm:w-auto bg-white border-2 border-purple-200 hover:border-purple-300 text-purple-600 font-semibold h-12 px-8">
                      <Send className="mr-2 h-5 w-5" />
                      Gửi tin nhắn
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                   0353366459
                  </CardTitle>
                </CardHeader>
               
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900">Hành động nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-300">
                    <Calendar className="mr-2 h-4 w-4" />
                    Đặt lịch hẹn
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-300">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat trực tuyến
                  </Button>
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-300">
                    <User className="mr-2 h-4 w-4" />
                    Tạo tài khoản
                  </Button>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Cam kết của chúng tôi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Bảo mật thông tin 100%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Tư vấn chuyên môn cao</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

     

      {/* FAQs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những câu hỏi phổ biến về dịch vụ của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tìm đường đến văn phòng</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Sử dụng Google Maps để tìm đường đến văn phòng gần bạn nhất
            </p>
            <div className="bg-white rounded-xl p-8 border-2 border-dashed border-purple-200 shadow-lg">
              <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-6" />
              <p className="text-gray-600 mb-6">
                Bản đồ tương tác sẽ được hiển thị ở đây
              </p>
              <Button variant="outline" className="hover:bg-purple-50 hover:border-purple-300">
                Xem trên Google Maps
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}
