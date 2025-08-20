import React, { useEffect, useState } from "react";
import { Save, User, Mail, Phone, Edit, Camera, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCounselorData from "@/hooks/useCounselorData";
import axios from "axios";
import Loading from "@/components/Loading";

interface Counselor {
  name: string;
  email: string;
  phone: string;
  username: string;
  profileImage?: string;
  password?: string; // Added password for default value
}

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [defaultPassword, setDefaultPassword] = useState(""); // store DB password
  const [counselorId, setCounselorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data, isLoading, refetch } = useCounselorData();
  const IMGBB_API_KEY = "67dc86d727e90b5175d7d74b3119fbcb";
  const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
  const API_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (data) {
      const counselorUserName = localStorage.getItem("Counselor");
      const myData = data.find(
        (item: Counselor) => item.username === counselorUserName
      );
      if (myData) {
        setFormData({
          name: myData.name || "",
          email: myData.email || "",
          phone: myData.phone || "",
          profileImage: myData.profileImage || "",
        });
        setCounselorId(myData._id);
        setDefaultPassword(myData.password || ""); // save DB password
        if (myData.profileImage) {
          setImagePreview(myData.profileImage);
        }
      } else {
        alert("Counselor data not found");
      }
    }
  }, [data]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    const imgFormData = new FormData();
    imgFormData.append("image", file);
    imgFormData.append("key", IMGBB_API_KEY);

    try {
      setLoading(true);
      const response = await axios.post(IMGBB_UPLOAD_URL, imgFormData);
      const imageUrl = response.data.data.url;
      setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
      alert("Image uploaded successfully");
    } catch (error) {
      alert("Failed to upload image");
      console.error("Image upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validatePasswords = () => {
    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("New password and confirm password do not match");
        return false;
      }
      if (passwordData.newPassword.length < 8) {
        alert("New password must be at least 8 characters long");
        return false;
      }
      if (!passwordData.currentPassword) {
        alert("Current password is required to change password");
        return false;
      }
      if (passwordData.currentPassword !== defaultPassword) {
        alert("Current password is incorrect");
        return false;
      }
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!counselorId) {
      alert("Counselor ID not found");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${API_URL}/update_counselor_data/${counselorId}`,
        formData
      );
      if (response.data.modifiedCount > 0) {
        alert("Profile updated successfully");
        setIsEditing(false);
        refetch();
      } else {
        alert("No changes were made");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;
    if (!counselorId) {
      alert("Counselor ID not found");
      return;
    }

    try {
      setLoading(true);
      const newPass =
        passwordData.newPassword.trim() !== ""
          ? passwordData.newPassword
          : defaultPassword;

      const response = await axios.patch(
        `${API_URL}/update_counselor_data/${counselorId}`,
        { password: newPass }
      );

      if (response.data.modifiedCount > 0) {
        alert("Password changed successfully");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setDefaultPassword(newPass); // update default password state
        refetch();
      } else {
        alert("No changes were made");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;
  if (!counselorId && !isLoading) {
    return (
      <div className="p-6 text-center text-red-600">
        No counselor data found
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          My Account
        </h1>
        <p className="text-gray-600">Manage your profile information</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Information
            </h2>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={loading}
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </Button>
          </div>

          {/* Profile Picture */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              {isEditing && (
                <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer">
                  <Camera className="w-3 h-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formData.name}
              </h3>
              <p className="text-gray-600">Education Counselor</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing || loading}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent ${
                  !isEditing || loading ? "bg-gray-50 text-gray-600" : ""
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing || loading}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent ${
                  !isEditing || loading ? "bg-gray-50 text-gray-600" : ""
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing || loading}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent ${
                  !isEditing || loading ? "bg-gray-50 text-gray-600" : ""
                }`}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-primary text-white hover:bg-primary/90 flex items-center space-x-2"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Change Password
              </h2>
              <p className="text-sm text-gray-600">
                Update your account password
              </p>
            </div>
            <Button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={loading}
            >
              <Key className="w-4 h-4" />
              <span>Change Password</span>
            </Button>
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData?.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange("currentPassword", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter current password"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter new password"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={() => setIsChangingPassword(false)}
                  variant="outline"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  className="bg-primary text-white hover:bg-primary/90 flex items-center space-x-2"
                  disabled={loading}
                >
                  <Key className="w-4 h-4" />
                  <span>{loading ? "Updating..." : "Update Password"}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
