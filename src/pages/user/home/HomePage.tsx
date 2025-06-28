import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home as HomeIcon, ArrowRight } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HomeIcon className="h-6 w-6" />
            🏠 Trang chủ - Home Page
          </CardTitle>
          <CardDescription>
            Chào mừng bạn đến với Modern React App với React Router!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold text-blue-600">🔐 Login</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Form đăng nhập với validation
              </p>
              <Button
                onClick={() => navigate("/login")}
                size="sm"
                className="w-full"
              >
                Đi đến Login <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-purple-600">👥 Users</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Danh sách người dùng với React Query
              </p>
              <Button
                onClick={() => navigate("/users")}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Xem Users <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-green-600">🔢 Counter</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Demo Zustand state management
              </p>
              <Button
                onClick={() => navigate("/counter")}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Thử Counter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>

          <div className="text-center py-4">
            <p className="text-lg">
              ✨ Sử dụng React Router để điều hướng giữa các trang!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
