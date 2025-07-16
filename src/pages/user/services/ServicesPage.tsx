import { useActiveServices } from "@/hooks/useServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Heart, 
  Shield, 
  Users, 
  Calendar, 
  Phone, 
  ArrowRight, 
  Star,
  Clock,
  MapPin,
  CheckCircle,
  Zap,
  Award,
  TrendingUp,
  Target,
  Activity,
  Microscope,
  Pill,
  Brain,
  Eye,
  TestTube,
  FileText,
  Globe,
  Lock
} from "lucide-react";

export default function ServicesPage() {
  const { data, isLoading, error } = useActiveServices({ page: 1, limit: 12 });

  const researchData = {
    methodology: {
      title: "Phương Pháp Nghiên Cứu & Điều Trị",
      description: "Áp dụng các phương pháp khoa học tiên tiến trong chẩn đoán và điều trị",
      stats: [
        { number: "95%", label: "Tỷ lệ thành công", icon: TrendingUp },
        { number: "50+", label: "Nghiên cứu lâm sàng", icon: Microscope },
        { number: "1000+", label: "Bệnh nhân hài lòng", icon: Users },
        { number: "24/7", label: "Hỗ trợ liên tục", icon: Clock }
      ]
    },
    qualityStandards: [
      {
        title: "Tiêu Chuẩn Quốc Tế",
        description: "Tuân thủ các tiêu chuẩn WHO và Bộ Y tế Việt Nam",
        icon: Award,
        color: "bg-blue-100 text-blue-600",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop"
      },
      {
        title: "Công Nghệ Hiện Đại",
        description: "Sử dụng thiết bị y tế tiên tiến và AI trong chẩn đoán",
        icon: Zap,
        color: "bg-purple-100 text-purple-600",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
      },
      {
        title: "Đội Ngũ Chuyên Gia",
        description: "Bác sĩ có trình độ cao và kinh nghiệm chuyên sâu",
        icon: Brain,
        color: "bg-green-100 text-green-600",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop"
      }
    ],
    treatmentProtocols: [
      {
        phase: "Giai Đoạn 1",
        title: "Đánh Giá & Chẩn Đoán",
        description: "Khám tổng quát và xét nghiệm chuyên sâu để đánh giá tình trạng bệnh",
        duration: "60-90 phút",
        tests: ["Xét nghiệm máu", "Xét nghiệm nước tiểu", "Chẩn đoán hình ảnh"],
        icon: Eye,
        color: "bg-blue-100 text-blue-600"
      },
      {
        phase: "Giai Đoạn 2",
        title: "Lập Phác Đồ Điều Trị",
        description: "Xây dựng kế hoạch điều trị cá nhân hóa dựa trên kết quả chẩn đoán",
        duration: "30-45 phút",
        tests: ["Tư vấn chuyên môn", "Lập phác đồ", "Giải thích quy trình"],
        icon: Target,
        color: "bg-purple-100 text-purple-600"
      },
      {
        phase: "Giai Đoạn 3",
        title: "Điều Trị & Theo Dõi",
        description: "Thực hiện điều trị và giám sát tiến trình phục hồi",
        duration: "Liên tục",
        tests: ["Điều trị theo phác đồ", "Theo dõi định kỳ", "Điều chỉnh khi cần"],
        icon: Activity,
        color: "bg-green-100 text-green-600"
      }
    ],
    researchAreas: [
      {
        title: "Nghiên Cứu HIV/AIDS",
        description: "Các nghiên cứu về cơ chế lây nhiễm, phương pháp điều trị và dự phòng",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        publications: 15,
        impact: "High"
      },
      {
        title: "Bệnh Lây Truyền",
        description: "Nghiên cứu về các bệnh lây truyền qua đường tình dục và phương pháp điều trị",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
        publications: 12,
        impact: "Medium"
      },
      {
        title: "Tâm Lý & Hỗ Trợ",
        description: "Nghiên cứu về tác động tâm lý và các phương pháp hỗ trợ bệnh nhân",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
        publications: 8,
        impact: "High"
      }
    ]
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không thể tải danh sách dịch vụ</h3>
        <p className="text-gray-600 mb-4">Vui lòng thử lại sau hoặc liên hệ với chúng tôi</p>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Liên hệ hỗ trợ
        </Button>
      </div>
    </div>
  );

  if (!data || data.data.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có dịch vụ nào</h3>
          <p className="text-gray-600 mb-4">Hiện tại chưa có dịch vụ nào được kích hoạt</p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with HIV Medical Background Image */}
      <section className="relative overflow-hidden py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/80 via-purple-900/70 to-blue-600/80"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center space-y-8 text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <Stethoscope className="h-4 w-4" />
              Chuyên khoa HIV/AIDS
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Điều trị HIV/AIDS
              <span className="text-yellow-300 block">chuyên sâu & hiện đại</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Áp dụng các phương pháp điều trị tiên tiến nhất, kết hợp với công nghệ y tế hiện đại 
              để mang lại hiệu quả điều trị tối ưu cho bệnh nhân HIV/AIDS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <FileText className="mr-2 h-5 w-5" />
                Xem phác đồ điều trị
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Calendar className="mr-2 h-5 w-5" />
                Đặt lịch tư vấn
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Research Methodology Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{researchData.methodology.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {researchData.methodology.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchData.methodology.stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Standards Section */}
     

            {/* Treatment Protocols Section - Step by Step Process */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Quy Trình Điều Trị HIV/AIDS</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình điều trị khoa học được xây dựng dựa trên nghiên cứu lâm sàng và tiêu chuẩn quốc tế
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-purple-200 hidden lg:block"></div>

            <div className="space-y-20">
              {researchData.treatmentProtocols.map((protocol, index) => {
                const IconComponent = protocol.icon;
                return (
                  <div key={index} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full border-4 border-white shadow-lg hidden lg:block" style={{ top: '50%', transform: 'translate(-0%, -50%)', zIndex: 10 }}></div>
                    
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                      {/* Left Card */}
                      <div className="lg:pr-8">
                        <div className="bg-white rounded-xl p-8 shadow-lg border-l-4 border-purple-500">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 ${protocol.color} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-purple-600">{protocol.phase}</div>
                              <h3 className="text-xl font-bold text-gray-900">{protocol.title}</h3>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed mb-4">{protocol.description}</p>
                          <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                            <Clock className="h-4 w-4" />
                            <span>{protocol.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Card */}
                      <div className="lg:pl-8">
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Các bước thực hiện:
                          </h4>
                          <div className="space-y-3">
                            {protocol.tests.map((test, testIndex) => (
                              <div key={testIndex} className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold">{testIndex + 1}</span>
                                </div>
                                <span className="text-purple-100">{test}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final Step */}
            <div className="text-center mt-20 relative z-10">
              <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Hoàn thành quy trình điều trị</span>
              </div>
            </div>
          </div>
        </div>
      </section>    

      {/* Research Areas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Lĩnh Vực Nghiên Cứu</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các lĩnh vực nghiên cứu chuyên sâu của chúng tôi
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {researchData.researchAreas.map((area, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{area.title}</h3>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <span>{area.publications} publications</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        area.impact === 'High' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {area.impact} Impact
                      </span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 leading-relaxed">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Dịch Vụ Hiện Có</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá các dịch vụ y tế chất lượng cao của chúng tôi
        </p>
      </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.data.map((service) => (
              <Link to={`/services/${service.slug}`} key={service.id} className="no-underline group">
                <Card className="h-full overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white">
                  {/* Service Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80`}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Service Type Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                        {service.type}
                      </div>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700">
                        {service.price} VNĐ
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-gray-800">4.8</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Content */}
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Service Icon & Title */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                            {service.name}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {service.description}
                </CardDescription>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="space-y-3">
                        {/* Duration & Location */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>45-60 phút</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>Phòng 301</span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Bảo hiểm
                          </div>
                          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-200">
                            <Shield className="h-3 w-3 inline mr-1" />
                            An toàn
                          </div>
                          <div className="bg-gray-50 text-gray-700 px-2 py-1 rounded-full text-xs font-medium border border-gray-200">
                            <Zap className="h-3 w-3 inline mr-1" />
                            Nhanh chóng
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button 
                          variant="outline"
                          className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                        >
                          <span>Xem chi tiết</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 px-8 py-3 rounded-xl font-semibold"
            >
              Xem tất cả dịch vụ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

     
    </div>
  );
}
