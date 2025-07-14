import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Target, Award, ShieldCheck, Globe, Activity } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Title Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Về chúng tôi - HIV Care Hub
        </h1>
        <p className="text-muted-foreground text-lg">
          Nền tảng tiên phong trong chăm sóc sức khỏe và hỗ trợ cộng đồng sống chung với HIV.
        </p>
      </div>

      {/* Intro Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Chúng tôi là ai?</h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          <strong>HIV Care Hub</strong> là một nền tảng số chuyên biệt, được thiết kế nhằm hỗ trợ cộng đồng
          sống chung với HIV/AIDS. Chúng tôi cung cấp thông tin y tế chính xác, các dịch vụ chăm sóc cá nhân hóa,
          và kết nối người bệnh với chuyên gia y tế đáng tin cậy.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed">
          Với sự kết hợp giữa công nghệ hiện đại và kiến thức chuyên sâu, HIV Care Hub mong muốn tạo nên một hệ sinh thái
          chăm sóc toàn diện, góp phần nâng cao chất lượng cuộc sống cho người sống chung với HIV.
        </p>
      </div>

      {/* Cards: Mission, Vision, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Sứ mệnh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Mang lại sự hỗ trợ y tế, tinh thần và xã hội cho cộng đồng sống với HIV thông qua công nghệ, giáo dục và dịch vụ y tế chuyên sâu.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Tầm nhìn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Trở thành nền tảng hàng đầu khu vực Châu Á trong hỗ trợ toàn diện cho người sống chung với HIV.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Đội ngũ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gồm bác sĩ chuyên khoa, chuyên gia tâm lý, kỹ sư công nghệ và các tình nguyện viên đầy tâm huyết, luôn đồng hành cùng người bệnh.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Giá trị cốt lõi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Chính trực & minh bạch</li>
              <li>Lấy người bệnh làm trung tâm</li>
              <li>Chất lượng dịch vụ vượt trội</li>
              <li>Tôn trọng và bảo mật thông tin</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Additional Commitment Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-600" />
              Bảo mật & riêng tư
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Chúng tôi cam kết giữ gìn quyền riêng tư và bảo mật tuyệt đối mọi thông tin của người dùng.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600" />
              Kết nối cộng đồng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Xây dựng môi trường an toàn để người sống chung với HIV có thể chia sẻ, học hỏi và hỗ trợ lẫn nhau.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-rose-600" />
              Phát triển bền vững
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Không ngừng cập nhật, mở rộng dịch vụ và cải tiến công nghệ nhằm mang lại giá trị lâu dài cho cộng đồng.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
