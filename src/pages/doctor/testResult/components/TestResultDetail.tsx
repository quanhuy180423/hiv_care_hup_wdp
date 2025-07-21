import { formatDate } from "@/lib/utils/dates/formatDate";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  TestTube, 
  User, 
  UserCheck, 
  Calendar,
  Phone,
  Mail,
  Hash,
  Activity,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import type { TestResult } from "@/services/testResultService";
import { translateInterpretation } from "@/types/testResult";

const TestResultDetail = ({ TestResult }: { TestResult: TestResult }) => {
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'hoàn thành':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
      case 'đang xử lý':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'abnormal':
      case 'bất thường':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'hoàn thành':
        return 'default';
      case 'pending':
      case 'đang xử lý':
        return 'secondary';
      case 'abnormal':
      case 'bất thường':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl h-[80vh] overflow-auto">
      {/* General Result Information */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Thông tin kết quả
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Giá trị kết quả kiểm tra</span>
              </div>
              <p className="font-medium">{TestResult.rawResultValue || "N/A"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Diễn giải</span>
              </div>
              <p className="font-medium">{translateInterpretation(TestResult.interpretation) || "N/A"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>Đơn vị</span>
              </div>
              <p className="font-medium">{TestResult.unit || "N/A"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Giá trị ngưỡng</span>
              </div>
              <p className="font-medium">{TestResult.cutOffValueUsed || "N/A"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getStatusIcon(TestResult.status)}
                <span>Trạng thái</span>
              </div>
              <Badge variant={getStatusVariant(TestResult.status)}>
                {TestResult.status == "Processing" ? "Đang xử lý" : "Hoàn thành"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ngày kết quả</span>
              </div>
              <p className="font-medium">{formatDate(TestResult.resultDate)}</p>
            </div>
          </div>
          
          {TestResult.notes && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Ghi chú</span>
                </div>
                <p className="text-sm bg-muted p-3 rounded-md">{TestResult.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Test Information */}
      {TestResult.test && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Thông tin xét nghiệm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Tên xét nghiệm</div>
                <p className="font-medium">{TestResult.test.name || "N/A"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Mô tả</div>
                <p className="font-medium">{TestResult.test.description || "N/A"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Phương pháp</div>
                <p className="font-medium">{TestResult.test.method || "N/A"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Danh mục</div>
                <Badge variant="outline">{TestResult.test.category || "N/A"}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Định lượng</div>
                <Badge variant={TestResult.test.isQuantitative ? "default" : "secondary"}>
                  {TestResult.test.isQuantitative ? "Có" : "Không"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Đơn vị xét nghiệm</div>
                <p className="font-medium">{TestResult.test.unit || "N/A"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Giá trị ngưỡng (Test)</div>
                <p className="font-medium">{TestResult.test.cutOffValue || "N/A"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Giá tiền</span>
                </div>
                <p className="font-medium text-green-600">
                  {formatCurrency(TestResult.test.price, "VND")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Information */}
      {TestResult.user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin bệnh nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Tên</span>
              </div>
              <p className="font-medium">{TestResult.user.name || "N/A"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="font-medium">{TestResult.user.email || "N/A"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>Số điện thoại</span>
              </div>
              <p className="font-medium">{TestResult.user.phoneNumber || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lab Tech Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Thông tin kỹ thuật viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          {TestResult.labTech ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Tên</span>
                </div>
                <p className="font-medium">{TestResult.labTech.name || "N/A"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium">{TestResult.labTech.email || "N/A"}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>Số điện thoại</span>
                </div>
                <p className="font-medium">{TestResult.labTech.phoneNumber || "N/A"}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Không có thông tin kỹ thuật viên.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Thời gian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Tạo lúc</span>
              </div>
              <p className="font-medium">{formatDate(TestResult.createdAt, "dd/MM/yyyy")}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Cập nhật lúc</span>
              </div>
              <p className="font-medium">{formatDate(TestResult.updatedAt, "dd/MM/yyyy")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResultDetail;