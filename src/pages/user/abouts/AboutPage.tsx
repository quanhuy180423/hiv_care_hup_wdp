import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Target, Award } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-5">
      {/* Page title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Giới thiệu về HIV Care Hub</h1>
        <p className="text-lg text-muted-foreground">
          Nền tảng chăm sóc sức khỏe hiện đại với công nghệ tiên tiến
        </p>
      </div>

      {/* About sections */}
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
              Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất
              thông qua việc ứng dụng công nghệ hiện đại và đội ngũ chuyên gia
              giàu kinh nghiệm.
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
              Trở thành nền tảng chăm sóc sức khỏe hàng đầu, mang lại sự an tâm
              và chất lượng cuộc sống tốt nhất cho mọi người.
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
              Đội ngũ bác sĩ chuyên khoa, điều dưỡng viên và chuyên gia công
              nghệ thông tin với nhiều năm kinh nghiệm trong lĩnh vực chăm sóc
              sức khỏe.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Chất lượng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Chúng tôi tuân thủ các tiêu chuẩn quốc tế về chăm sóc sức khỏe và
              liên tục cải tiến dịch vụ để đảm bảo chất lượng tốt nhất.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
