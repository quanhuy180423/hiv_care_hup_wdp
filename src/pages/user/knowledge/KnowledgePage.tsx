import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Video,
  FileText,
  Download,
  Search,
  Calendar,
  Users,
  Star,
  Clock,
  Tag,
  ArrowRight,
  Play,
} from "lucide-react";

export function KnowledgePage() {
  const categories = [
    {
      icon: BookOpen,
      title: "Kiến thức cơ bản",
      count: 45,
      description: "Thông tin cơ bản về HIV/AIDS",
    },
    {
      icon: Video,
      title: "Video giáo dục",
      count: 28,
      description: "Video hướng dẫn và webinar",
    },
    {
      icon: FileText,
      title: "Nghiên cứu mới",
      count: 32,
      description: "Các nghiên cứu và xu hướng mới",
    },
    {
      icon: Users,
      title: "Chia sẻ cộng đồng",
      count: 67,
      description: "Kinh nghiệm từ cộng đồng",
    },
  ];

  const featuredArticles = [
    {
      title: "Hiểu đúng về HIV: Sự thật và lầm tưởng",
      description:
        "Bài viết tổng quan về những hiểu biết đúng và sai lầm phổ biến về HIV/AIDS",
      category: "Kiến thức cơ bản",
      readTime: "8 phút",
      date: "15/12/2024",
      featured: true,
      image: "📚",
    },
    {
      title: "Cách phòng ngừa HIV hiệu quả",
      description:
        "Các phương pháp phòng ngừa HIV được khuyến nghị bởi tổ chức Y tế thế giới",
      category: "Phòng ngừa",
      readTime: "12 phút",
      date: "12/12/2024",
      featured: true,
      image: "🛡️",
    },
    {
      title: "Dinh dưỡng cho người nhiễm HIV",
      description:
        "Hướng dẫn chế độ ăn uống và dinh dưỡng phù hợp cho người nhiễm HIV",
      category: "Dinh dưỡng",
      readTime: "10 phút",
      date: "10/12/2024",
      featured: true,
      image: "🥗",
    },
  ];

  const recentArticles = [
    {
      title: "Tiến bộ mới trong điều trị HIV 2024",
      category: "Nghiên cứu",
      readTime: "6 phút",
      date: "08/12/2024",
    },
    {
      title: "Hỗ trợ tâm lý cho người nhiễm HIV",
      category: "Tâm lý",
      readTime: "9 phút",
      date: "05/12/2024",
    },
    {
      title: "Sống tích cực với HIV",
      category: "Lối sống",
      readTime: "7 phút",
      date: "03/12/2024",
    },
    {
      title: "Câu hỏi thường gặp về HIV",
      category: "FAQ",
      readTime: "15 phút",
      date: "01/12/2024",
    },
    {
      title: "Thuốc ARV và tác dụng phụ",
      category: "Thuốc",
      readTime: "11 phút",
      date: "28/11/2024",
    },
  ];

  const videos = [
    {
      title: "Webinar: Sống khỏe với HIV",
      duration: "45 phút",
      views: "2.1K",
      thumbnail: "🎥",
    },
    {
      title: "Hướng dẫn uống thuốc ARV",
      duration: "12 phút",
      views: "5.3K",
      thumbnail: "💊",
    },
    {
      title: "Kỹ năng giao tiếp với bác sĩ",
      duration: "8 phút",
      views: "1.8K",
      thumbnail: "👩‍⚕️",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          <BookOpen className="h-4 w-4" />
          Trung tâm kiến thức
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Kiến thức và thông tin hữu ích
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Nơi tập hợp những thông tin, kiến thức chính xác và cập nhật nhất về
          HIV/AIDS, từ cơ bản đến chuyên sâu
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết, video..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {category.count}
                </div>
                <div className="text-sm text-muted-foreground">bài viết</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Featured Articles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Bài viết nổi bật</h2>
          <Button variant="outline">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {featuredArticles.map((article, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{article.image}</div>
                  <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                    <Star className="h-3 w-3" />
                    Nổi bật
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {article.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Articles */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Bài viết mới nhất</h2>
          <div className="space-y-4">
            {recentArticles.map((article, index) => (
              <Card
                key={index}
                className="hover:shadow-sm transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {article.category}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.date}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Video Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="w-16 h-12 bg-black/10 rounded flex items-center justify-center text-2xl relative">
                    {video.thumbnail}
                    <Play className="absolute h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{video.duration}</span>
                      <span>•</span>
                      <span>{video.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Download Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Tài liệu tải về
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Sổ tay HIV cơ bản (PDF)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Hướng dẫn phòng ngừa (PDF)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Checklist khám định kỳ (PDF)
              </Button>
            </CardContent>
          </Card>

          {/* Newsletter */}
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký nhận tin</CardTitle>
              <CardDescription>
                Nhận thông tin mới nhất về HIV/AIDS qua email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-3 py-2 border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button className="w-full">Đăng ký</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
