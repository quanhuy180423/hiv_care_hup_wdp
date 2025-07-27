import { useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

// Doctor Card Component
const DoctorCard = ({
  name,
  specialty,
  rating,
  reviews,
  isAvailable = true,
  avatar,
}: {
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  isAvailable?: boolean;
  avatar?: string;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
      {/* Top Section - Doctor Image and Availability */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-xl flex items-center justify-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm border-2 border-purple-400">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">👨‍⚕️</span>
            )}
          </div>
        </div>
        {/* Availability Tag */}
        <div className="absolute top-4 left-4 bg-gray-200/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              isAvailable ? "bg-emerald-500" : "bg-rose-500"
            }`}
          ></div>
          <span className="text-xs font-medium text-slate-700">
            {isAvailable ? "Có sẵn" : "Bận"}
          </span>
        </div>
      </div>

      {/* Middle Section - Doctor Details */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{name}</h3>
        <p className="text-slate-600 mb-4 text-sm">{specialty}</p>

        {/* Rating Section */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-amber-400 fill-current" : "text-slate-200"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-slate-500 ml-2">({reviews})</span>
        </div>

        {/* Bottom Section - Action Button */}
        <Link to="services/appointment/register">
          <Button className="w-full bg-slate-50 border border-purple-400 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 hover:border-purple-500 transition-all duration-200 text-sm">
            Đặt Lịch Khám
          </Button>
        </Link>
      </div>
    </div>
  );
};

const HomePage = () => {
  useEffect(() => {
    // Ensure Swiper is properly initialized
    const swiperContainer = document.querySelector(
      ".doctor-swiper"
    ) as HTMLElement;
    if (swiperContainer) {
      swiperContainer.style.overflow = "hidden";
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Chúng tôi quan tâm đến
                  <span className="text-purple-600 block">
                    sức khỏe của bạn
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Cung cấp dịch vụ y tế tốt nhất với cơ sở vật chất hiện đại và
                  đội ngũ bác sĩ chuyên môn cao. Sức khỏe của bạn là ưu tiên của
                  chúng tôi.
                </p>
              </div>

              <div className="space-y-6">
                {/* Book Appointment Button */}
                <Link to="services/appointment/register">
                  <button className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors transform hover:scale-105 flex items-center space-x-3">
                    <span>Đặt lịch khám</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </Link>

                {/* Watch Videos Section */}
                <div className="flex items-center space-x-4 mt-2">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-700">Xem video</span>
                </div>

                {/* Sign Up Text */}
                <p className="text-gray-600">
                  Trở thành thành viên của cộng đồng bệnh viện chúng tôi?
                  <Link
                    to="#"
                    className="text-purple-600 underline font-medium ml-1"
                  >
                    Đăng ký
                  </Link>
                </p>
              </div>
            </div>

            {/* Doctor Team Welcome with Background Image */}
            <div className="relative">
              {/* Background Image Container */}
              <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('https://www.praktischarzt.de/wp-content/uploads/2023/03/Becoming-a-medical-doctor-or-physician-in-Germany.jpg')`,
                  }}
                >
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-grey/60 to-black/40"></div>
                </div>

                {/* Welcome Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-10">
                  <div className="animate-fade-in-up">
                    <p className="text-lg mb-6 max-w-md">
                      Gặp gỡ đội ngũ chuyên gia y tế tận tâm cam kết với sức
                      khỏe của bạn
                    </p>

                    {/* Doctor Team Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-8">
                      <div className="text-center animate-slide-in-up">
                        <div className="text-2xl font-bold text-yellow-300">
                          50+
                        </div>
                        <div className="text-sm">Bác Sĩ Chuyên Môn</div>
                      </div>
                      <div
                        className="text-center animate-slide-in-up"
                        style={{ animationDelay: "0.2s" }}
                      >
                        <div className="text-2xl font-bold text-yellow-300">
                          1000+
                        </div>
                        <div className="text-sm">Bệnh Nhân Hài Lòng</div>
                      </div>
                      <div
                        className="text-center animate-slide-in-up"
                        style={{ animationDelay: "0.4s" }}
                      >
                        <div className="text-2xl font-bold text-yellow-300">
                          24/7
                        </div>
                        <div className="text-sm">Chăm Sóc Liên Tục</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Action Cards */}
              <div
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-80 space-y-4 animate-slide-in-up"
                style={{ animationDelay: "0.6s" }}
              >
                {/* Quick Action Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Đặt Lịch Khám
                        </h3>
                        <p className="text-sm text-gray-600">
                          Nhanh Chóng & Dễ Dàng
                        </p>
                      </div>
                    </div>
                    <Link to="services/appointment/register">
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        Đặt Ngay
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dịch Vụ Y Tế Của Chúng Tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết cung cấp dịch vụ y tế tốt nhất cho bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Well equipped lab */}
            <div className="group bg-white rounded-xl shadow-lg p-6 text-center hover:bg-purple-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors">
                Phòng xét nghiệm hiện đại
              </h3>
            </div>

            {/* Emergency Ambulance */}
            <div className="group bg-white rounded-xl shadow-lg p-6 text-center hover:bg-purple-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14l4-4 4 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors">
                Xe Cứu Thương Khẩn Cấp
              </h3>
            </div>

            {/* Online Appointment */}
            <div className="group bg-white rounded-xl shadow-lg p-6 text-center hover:bg-purple-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors">
                Đặt Lịch Trực Tuyến
              </h3>
            </div>

            {/* Call Center */}
            <div className="group bg-white rounded-xl shadow-lg p-6 text-center hover:bg-purple-600 transition-all duration-300 hover:shadow-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white transition-colors">
                Trung Tâm Tư Vấn
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Our Doctors Section with Swiper */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Đội Ngũ Bác Sĩ Chuyên Môn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gặp gỡ đội ngũ bác sĩ có trình độ cao và giàu kinh nghiệm
            </p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            className="doctor-swiper"
            style={{ paddingBottom: "50px" }}
          >
            <SwiperSlide>
              <DoctorCard
                name="Dr. Robert Henry"
                specialty="Cardiologist"
                rating={4.5}
                reviews={102}
                isAvailable={true}
                avatar="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
              />
            </SwiperSlide>

            <SwiperSlide>
              <DoctorCard
                name="Dr. Sarah Wilson"
                specialty="Neurologist"
                rating={4.8}
                reviews={89}
                isAvailable={true}
                avatar="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face"
              />
            </SwiperSlide>
            <SwiperSlide>
              <DoctorCard
                name="Dr. Sarah Wilson"
                specialty="Neurologist"
                rating={4.8}
                reviews={89}
                isAvailable={true}
                avatar="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face"
              />
            </SwiperSlide>

            <SwiperSlide>
              <DoctorCard
                name="Dr. Michael Chen"
                specialty="Dermatologist"
                rating={4.2}
                reviews={156}
                isAvailable={true}
                avatar="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
              />
            </SwiperSlide>

            <SwiperSlide>
              <DoctorCard
                name="Dr. Emily Rodriguez"
                specialty="Pediatrician"
                rating={4.9}
                reviews={203}
                isAvailable={true}
                avatar="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              BÀI VIẾT SỨC KHỎE
            </h2>
            <div className="w-20 h-1 bg-purple-600"></div>
          </div>

          {/* Blog Slider */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next-blog",
              prevEl: ".swiper-button-prev-blog",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-blog",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="blog-swiper"
          >
            {/* Slide 1: Lupus */}
            <SwiperSlide>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
                    alt="Breaking Barriers In Lupus"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-purple-600 mb-2 font-medium">
                    Chuyên đề về Lupus
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Phá Vỡ Rào Cản Trong Điều Trị Lupus
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tìm hiểu cách đấu tranh cho việc chăm sóc sức khỏe, tại sao
                    đa dạng nghiên cứu quan trọng và cách lupus ảnh hưởng khác
                    nhau đến người da màu.
                  </p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 2: MASLD and MASH */}
            <SwiperSlide>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"
                    alt="Understanding MASLD And MASH"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-purple-600 mb-2 font-medium">
                    Nội dung về MASLD và MASH
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Hiểu Về MASLD Và MASH
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tìm hiểu về các bệnh lý gan này, cách điều trị và cách làm
                    việc với đội ngũ chăm sóc để có sức khỏe tốt hơn.
                  </p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 3: Clinical Trials */}
            <SwiperSlide>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop"
                    alt="Stories Of Clinical Trials"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-purple-600 mb-2 font-medium">
                    Chuyên đề về Thử Nghiệm Lâm Sàng
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Câu Chuyện Về Thử Nghiệm Lâm Sàng
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tìm hiểu cách thử nghiệm lâm sàng dẫn đến các phương pháp
                    điều trị an toàn hơn, tốt hơn và những điều cần biết nếu bạn
                    đang cân nhắc tham gia.
                  </p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 4: Mental Health */}
            <SwiperSlide>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                    alt="Mental Health Awareness"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-purple-600 mb-2 font-medium">
                    Sức Khỏe Tâm Thần
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Nhận Thức Về Sức Khỏe Tâm Thần
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Hiểu về tầm quan trọng của sức khỏe tâm thần và các chiến
                    lược duy trì sức khỏe tinh thần trong thế giới ngày nay.
                  </p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 5: Nutrition */}
            <SwiperSlide>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop"
                    alt="Healthy Nutrition Guide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-purple-600 mb-2 font-medium">
                    Dinh Dưỡng
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Hướng Dẫn Dinh Dưỡng Lành Mạnh
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Khám phá các chất dinh dưỡng thiết yếu mà cơ thể bạn cần và
                    cách tạo ra các bữa ăn cân bằng cho sức khỏe và sức khỏe tối
                    ưu.
                  </p>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 6: Exercise */}
            <SwiperSlide>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                    alt="Exercise for Health"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-purple-600 mb-2 font-medium">
                    Thể Dục
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Tập Thể Dục Cho Sức Khỏe
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tìm hiểu về lợi ích của việc tập thể dục thường xuyên và
                    cách kết hợp hoạt động thể chất vào thói quen hàng ngày.
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button className="swiper-button-prev-blog bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-button-next-blog bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Custom Pagination */}
          <div className="swiper-pagination-blog flex justify-center mt-6"></div>
        </div>
      </section>

      {/* Treatment Services & HIV Care Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dịch Vụ Điều Trị & Chăm Sóc
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ điều trị toàn diện với quy trình
              chuẩn của Bộ Y tế, đặc biệt chuyên sâu về các bệnh xã hội và
              HIV/AIDS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - HIV Treatment Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Điều Trị HIV/AIDS
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Phác đồ điều trị ARV chuẩn
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Áp dụng phác đồ điều trị kháng retrovirus theo hướng dẫn
                        của Bộ Y tế
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Theo dõi CD4 và tải lượng virus
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Xét nghiệm định kỳ để đánh giá hiệu quả điều trị
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Tư vấn và hỗ trợ tâm lý
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Đội ngũ chuyên gia tâm lý hỗ trợ bệnh nhân và gia đình
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Quy Trình Điều Trị
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Khám và tư vấn ban đầu
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Đánh giá tình trạng sức khỏe và tư vấn về điều trị
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Xét nghiệm chẩn đoán
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Thực hiện các xét nghiệm cần thiết theo quy định
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Lập phác đồ điều trị
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Xây dựng kế hoạch điều trị phù hợp với từng bệnh nhân
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Theo dõi và đánh giá
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Giám sát tiến trình điều trị và điều chỉnh khi cần
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STD Treatment */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Điều Trị Bệnh Xã Hội
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Chẩn đoán và điều trị các bệnh lây truyền qua đường tình dục
                  với phác đồ chuẩn
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Chlamydia, Gonorrhea</li>
                  <li>• Syphilis, Herpes</li>
                  <li>• HPV và các bệnh khác</li>
                </ul>
              </div>

              {/* Prevention */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Dự Phòng & Giáo Dục
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Chương trình giáo dục sức khỏe và dự phòng lây nhiễm HIV
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Tư vấn dự phòng</li>
                  <li>• Giáo dục sức khỏe</li>
                  <li>• Xét nghiệm sàng lọc</li>
                </ul>
              </div>

              {/* Support Services */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Hỗ Trợ Tâm Lý
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Dịch vụ tư vấn tâm lý và hỗ trợ cho bệnh nhân và gia đình
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Tư vấn cá nhân</li>
                  <li>• Hỗ trợ nhóm</li>
                  <li>• Liên kết cộng đồng</li>
                </ul>
              </div>

              {/* Research */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Nghiên Cứu & Phát Triển
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Tham gia các nghiên cứu lâm sàng và cập nhật phương pháp điều
                  trị mới
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Nghiên cứu lâm sàng</li>
                  <li>• Cập nhật phác đồ</li>
                  <li>• Hợp tác quốc tế</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Bạn Cần Hỗ Trợ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
              Hãy liên hệ ngay để được tư vấn và điều trị kịp thời.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="services/appointment/register">
                <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer">
                  Đặt Lịch Khám
                </button>
              </Link>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors">
                Tư Vấn Miễn Phí
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
