import React from "react";
import {
  Users,
  Heart,
  Target,
  Award,
  ShieldCheck,
  Globe,
  Activity,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Về Chúng Tôi
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Chúng tôi là
                  <span className="text-purple-600 block">HIV Care Hub</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Nền tảng tiên phong trong chăm sóc sức khỏe và hỗ trợ cộng đồng 
                  sống chung với HIV/AIDS tại Việt Nam.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">5+</div>
                  <div className="text-sm text-gray-600">Năm Kinh Nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">10K+</div>
                  <div className="text-sm text-gray-600">Bệnh Nhân</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-sm text-gray-600">Bác Sĩ</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop')`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple/60 to-indigo/40"></div>
                </div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-10">
                  <div className="animate-fade-in-up">
                    <p className="text-lg mb-6 max-w-md">
                      "Chúng tôi cam kết mang lại dịch vụ y tế chất lượng cao 
                      và sự hỗ trợ toàn diện cho cộng đồng"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sứ Mệnh & Tầm Nhìn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang lại sự thay đổi tích cực trong cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Sứ Mệnh</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Mang lại sự hỗ trợ y tế, tinh thần và xã hội toàn diện cho cộng đồng 
                sống chung với HIV/AIDS thông qua công nghệ hiện đại, giáo dục sức khỏe 
                và dịch vụ y tế chuyên sâu.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Cung cấp thông tin y tế chính xác và cập nhật
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Kết nối bệnh nhân với đội ngũ bác sĩ chuyên môn
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Hỗ trợ tâm lý và tư vấn cho người bệnh và gia đình
                </li>
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Tầm Nhìn</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Trở thành nền tảng hàng đầu khu vực Đông Nam Á trong hỗ trợ toàn diện 
                cho người sống chung với HIV/AIDS, góp phần xây dựng một xã hội 
                không còn kỳ thị và phân biệt đối xử.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Mở rộng dịch vụ ra toàn quốc và khu vực
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Áp dụng công nghệ AI và telemedicine
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Hợp tác quốc tế và nghiên cứu khoa học
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Integrity */}
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chính Trực
              </h3>
              <p className="text-gray-600 text-sm">
                Minh bạch trong mọi hoạt động và cam kết với cộng đồng
              </p>
            </div>

            {/* Compassion */}
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tận Tâm
              </h3>
              <p className="text-gray-600 text-sm">
                Đặt lợi ích của bệnh nhân lên hàng đầu trong mọi quyết định
              </p>
            </div>

            {/* Excellence */}
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chất Lượng
              </h3>
              <p className="text-gray-600 text-sm">
                Không ngừng cải tiến và mang lại dịch vụ tốt nhất
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sáng Tạo
              </h3>
              <p className="text-gray-600 text-sm">
                Áp dụng công nghệ mới để cải thiện trải nghiệm người dùng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hành Trình Phát Triển
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những cột mốc quan trọng trong quá trình xây dựng và phát triển
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-purple-200 hidden lg:block"></div>

            {/* Timeline Items */}
            <div className="space-y-12 max-w-6xl mx-auto">
              {/* 2019 */}
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-center">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full hidden lg:block"></div>
                <div className="lg:w-5/12 lg:pr-8 lg:text-right mb-4 lg:mb-0">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-l-4 border-purple-500">
                    <h3 className="text-xl font-bold text-gray-900">2019</h3>
                    <h4 className="text-lg font-semibold text-purple-600 mb-2">Thành Lập</h4>
                    <p className="text-gray-600 mb-3">
                      HIV Care Hub được thành lập với mục tiêu hỗ trợ cộng đồng 
                      sống chung với HIV/AIDS tại Việt Nam.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Thành lập đội ngũ chuyên gia y tế</li>
                      <li>• Xây dựng cơ sở hạ tầng ban đầu</li>
                      <li>• Thiết lập quan hệ đối tác</li>
                    </ul>
                  </div>
                </div>
                <div className="lg:w-5/12 lg:pl-8">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-gray-900">2020</h3>
                    <h4 className="text-lg font-semibold text-blue-600 mb-2">Mở Rộng Dịch Vụ</h4>
                    <p className="text-gray-600 mb-3">
                      Ra mắt nền tảng trực tuyến với các dịch vụ tư vấn và 
                      kết nối bệnh nhân với bác sĩ chuyên khoa.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Phát triển website và ứng dụng mobile</li>
                      <li>• Triển khai dịch vụ tư vấn trực tuyến</li>
                      <li>• Kết nối với 20+ bác sĩ chuyên khoa</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2021 */}
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-center">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full hidden lg:block"></div>
                <div className="lg:w-5/12 lg:pr-8 lg:text-right mb-4 lg:mb-0">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
                    <h3 className="text-xl font-bold text-gray-900">2021</h3>
                    <h4 className="text-lg font-semibold text-green-600 mb-2">Phát Triển Công Nghệ</h4>
                    <p className="text-gray-600 mb-3">
                      Áp dụng AI và machine learning để cải thiện chẩn đoán 
                      và tư vấn điều trị.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Tích hợp AI vào hệ thống chẩn đoán</li>
                      <li>• Phát triển chatbot tư vấn tự động</li>
                      <li>• Cải thiện trải nghiệm người dùng</li>
                    </ul>
                  </div>
                </div>
                <div className="lg:w-5/12 lg:pl-8">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-l-4 border-orange-500">
                    <h3 className="text-xl font-bold text-gray-900">2022</h3>
                    <h4 className="text-lg font-semibold text-orange-600 mb-2">Hợp Tác Quốc Tế</h4>
                    <p className="text-gray-600 mb-3">
                      Thiết lập quan hệ đối tác với các tổ chức y tế quốc tế 
                      và mở rộng mạng lưới bác sĩ.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Hợp tác với WHO và UNAIDS</li>
                      <li>• Mở rộng mạng lưới bác sĩ quốc tế</li>
                      <li>• Tham gia các dự án nghiên cứu</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2023 */}
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-center">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full hidden lg:block"></div>
                <div className="lg:w-5/12 lg:pr-8 lg:text-right mb-4 lg:mb-0">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-l-4 border-red-500">
                    <h3 className="text-xl font-bold text-gray-900">2023</h3>
                    <h4 className="text-lg font-semibold text-red-600 mb-2">Mở Rộng Toàn Quốc</h4>
                    <p className="text-gray-600 mb-3">
                      Dịch vụ có mặt tại 63 tỉnh thành với hơn 10,000 bệnh nhân 
                      được hỗ trợ.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Phủ sóng toàn bộ 63 tỉnh thành</li>
                      <li>• Hỗ trợ hơn 10,000 bệnh nhân</li>
                      <li>• Đào tạo 500+ nhân viên y tế</li>
                    </ul>
                  </div>
                </div>
                <div className="lg:w-5/12 lg:pl-8">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-l-4 border-indigo-500">
                    <h3 className="text-xl font-bold text-gray-900">2024</h3>
                    <h4 className="text-lg font-semibold text-indigo-600 mb-2">Tương Lai</h4>
                    <p className="text-gray-600 mb-3">
                      Tiếp tục phát triển công nghệ và mở rộng dịch vụ ra 
                      khu vực Đông Nam Á.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Mở rộng ra các nước Đông Nam Á</li>
                      <li>• Phát triển công nghệ blockchain</li>
                      <li>• Xây dựng trung tâm nghiên cứu</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Liên Hệ Với Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hãy để lại thông tin nếu bạn cần tư vấn hoặc hỗ trợ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Thông Tin Liên Hệ
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Địa Chỉ</h4>
                      <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Điện Thoại</h4>
                      <p className="text-gray-600">+84 28 1234 5678</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">info@hivcarehub.vn</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Giờ Làm Việc</h4>
                      <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Gửi Tin Nhắn
              </h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Tư vấn điều trị</option>
                    <option>Hỗ trợ tâm lý</option>
                    <option>Đặt lịch khám</option>
                    <option>Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập nội dung tin nhắn..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <span>Gửi Tin Nhắn</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
     
    </div>
  );
};

export default AboutPage;
