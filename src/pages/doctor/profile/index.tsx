import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, Edit, Plus, Trash2, X } from "lucide-react";
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
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Bạn chưa đăng nhập.</p>
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
      toast.success("Cập nhật hồ sơ thành công");
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
      toast.success("Cập nhật avatar thành công!");
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
    <div className="w-full mx-auto space-y-6">
      <div className="w-full">
        <Card className="w-full">
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {formData.avatar ? (
                  <img
                    src={getAvatarUrl(formData.avatar)}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {userProfile.email}
                </p>
                {userProfile.doctor && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {userProfile.doctor.specialization}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Info */}
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Thông tin cá nhân</h4>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 cursor-pointer"
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                )}
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                    Hủy bỏ
                  </Button>
                )}
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
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
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Chuyên môn</Label>
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
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chứng chỉ hành nghề</Label>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Thêm chứng chỉ mới"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addCertification}
                        disabled={!newCertification.trim()}
                        className="cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="bg-muted rounded-md p-3 text-sm space-y-2 border">
                    {formData.certifications.length > 0 ? (
                      formData.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-start gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              {cert}
                            </span>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertification(index)}
                              className="text-red-500 hover:text-red-600 p-1 h-6 w-6 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        {isEditing
                          ? "Thêm chứng chỉ của bạn"
                          : "Chưa có chứng chỉ nào được cập nhật"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2 cursor-pointer"
                    disabled={isLoading}
                    variant="outline"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}