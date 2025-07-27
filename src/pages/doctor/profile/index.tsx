import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Save,
  Edit,
  Plus,
  Trash2,
  X,
  Mail,
  Phone,
  Award,
  Stethoscope,
  User,
  Shield,
  Check,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAvatarUrl,
  uploadAvatarToSupabase,
} from "@/lib/utils/uploadImage/uploadImage";

export default function ProfileDoctorPage() {
  const { userProfile, updateProfile, isLoading, refetchProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    phoneNumber: userProfile?.phoneNumber || "",
    avatar: userProfile?.avatar || "",
    specialization: userProfile?.doctor?.specialization || "",
    certifications: userProfile?.doctor?.certifications || [],
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        phoneNumber: userProfile.phoneNumber || "",
        avatar: userProfile.avatar || "",
        specialization: userProfile.doctor?.specialization || "",
        certifications: userProfile.doctor?.certifications || [],
      });
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Chưa đăng nhập
            </h3>
            <p className="text-red-600">
              Vui lòng đăng nhập để xem thông tin hồ sơ.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setError("");
      await updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar,
        specialization: formData.specialization,
        certifications: formData.certifications,
      });
      await refetchProfile?.();
      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công! ✅");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Cập nhật thất bại";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile.name,
      phoneNumber: userProfile.phoneNumber || "",
      avatar: userProfile.avatar || "",
      specialization: userProfile.doctor?.specialization || "",
      certifications: userProfile.doctor?.certifications || [],
    });
    setIsEditing(false);
    setNewCertification("");
    setError("");
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 2MB");
      toast.error("Kích thước ảnh không được vượt quá 2MB");
      return;
    }

    try {
      setError("");
      const { filename } = await uploadAvatarToSupabase(
        file,
        userProfile.id.toString()
      );
      await updateProfile({ ...formData, avatar: filename });
      setFormData((prev) => ({
        ...prev,
        avatar: filename,
      }));
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      setError("Upload thất bại");
      toast.error("Upload thất bại");
    }
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !formData.certifications.includes(newCertification.trim())
    ) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCertification.trim()],
      });
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    const updatedCerts = [...formData.certifications];
    updatedCerts.splice(index, 1);
    setFormData({
      ...formData,
      certifications: updatedCerts,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 p-2">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 rounded-3xl" />
        <Card className="relative border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  {formData.avatar ? (
                    <img
                      src={getAvatarUrl(formData.avatar)}
                      alt="Doctor Avatar"
                      className="relative w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Upload Overlay */}
                  <div
                    className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-white text-center">
                      <Camera className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs font-medium">Đổi ảnh</span>
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {userProfile.name}
                    </h1>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      <Shield className="w-3 h-3 mr-1" />
                      Bác sĩ chuyên khoa
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{userProfile.email}</span>
                    </div>
                    {formData.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{formData.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specialization */}
                {userProfile.doctor?.specialization && (
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-purple-500" />
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 px-3 py-1 text-sm font-medium"
                    >
                      {userProfile.doctor.specialization}
                    </Badge>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/30">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">
                        Bệnh nhân
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">127</p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-700">
                        Chứng chỉ
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-900">
                      {formData.certifications.length}
                    </p>
                  </div>

                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-200/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="w-4 h-4 text-violet-500" />
                      <span className="text-sm font-medium text-violet-700">
                        Kinh nghiệm
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-violet-900">5+ năm</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <User className="w-6 h-6 text-blue-500" />
              Thông tin cá nhân
            </CardTitle>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors duration-200"
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors duration-200"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                  Hủy bỏ
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Có lỗi xảy ra
                </h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={
                    !isEditing
                      ? "bg-slate-50 border-slate-200"
                      : "border-blue-200 focus:border-blue-400"
                  }
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-green-500" />
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  className={
                    !isEditing
                      ? "bg-slate-50 border-slate-200"
                      : "border-blue-200 focus:border-blue-400"
                  }
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-blue-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                disabled
                className="bg-slate-50 border-slate-200"
              />
              <p className="text-xs text-slate-500">Email không thể thay đổi</p>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="specialization"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-purple-500" />
                Chuyên môn
              </Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization: e.target.value,
                  })
                }
                disabled={!isEditing}
                className={
                  !isEditing
                    ? "bg-slate-50 border-slate-200"
                    : "border-blue-200 focus:border-blue-400"
                }
                placeholder="Ví dụ: Bác sĩ chuyên khoa HIV/AIDS"
              />
            </div>
          </div>

          <Separator className="my-8" />

          {/* Certifications Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-800">
                Chứng chỉ hành nghề
              </h3>
            </div>

            {isEditing && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/50">
                <Label className="text-sm font-medium text-blue-800 mb-3 block">
                  Thêm chứng chỉ mới
                </Label>
                <div className="flex gap-3">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Ví dụ: Chứng chỉ hành nghề bác sĩ"
                    className="border-blue-200 focus:border-blue-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCertification();
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={addCertification}
                    disabled={!newCertification.trim()}
                    className="flex items-center gap-2 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {formData.certifications.length > 0 ? (
                <div className="grid gap-3">
                  {formData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200/50 group hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-emerald-900">{cert}</p>
                          <p className="text-sm text-emerald-600">
                            Chứng chỉ đã được xác thực
                          </p>
                        </div>
                      </div>

                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertification(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                  <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-600 mb-2">
                    {isEditing
                      ? "Thêm chứng chỉ đầu tiên"
                      : "Chưa có chứng chỉ"}
                  </h4>
                  <p className="text-slate-500">
                    {isEditing
                      ? "Hãy thêm các chứng chỉ hành nghề của bạn"
                      : "Chưa có chứng chỉ nào được cập nhật"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-6 border-t border-slate-200">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                <Save className="h-4 w-4" />
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
