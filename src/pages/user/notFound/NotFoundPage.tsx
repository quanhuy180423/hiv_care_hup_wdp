import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">404 - Không tìm thấy trang</CardTitle>
          <CardDescription>
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button onClick={() => navigate("/")} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            Quay lại trang trước
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
