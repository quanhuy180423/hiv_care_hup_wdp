import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Camera, Save, Edit } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAvatarUrl,
  uploadAvatarToSupabase,
} from "@/lib/utils/uploadImage/uploadImage";

export default function ProfilePage() {
  useDocumentTitle();

  const { userProfile, updateProfile, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    phoneNumber: userProfile?.phoneNumber || "",
    avatar: userProfile?.avatar || "",
  });

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
      await updateProfile(formData);
      toast.success("Cập nhật hồ sơ thành công");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userProfile.name,
      phoneNumber: userProfile.phoneNumber || "",
      avatar: userProfile.avatar || "",
    });
    setIsEditing(false);
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

  return (
    <div className="">
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
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
