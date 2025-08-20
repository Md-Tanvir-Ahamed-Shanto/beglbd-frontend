import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Save,
  Upload,
  Eye,
  EyeOff,
  Globe,
  Shield,
  User,
  Image,
} from "lucide-react";

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    _id: null,
    websiteTitle: "",
    tagline: "",
    metaDescription: "",
    contactEmail: "",
    contactPhone: "",
    officeAddress: "",
    logo: "",
    favicon: "",
    footerDescription: "",
    copyrightText: "",
    footerLogo: "",
    profilePhoto: "",
    fullName: "",
    adminEmail: "",
    adminPhone: "",
    newLeadNotifications: true,
    emailDigest: true,
    currentPassword: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const IMGBB_API_KEY = "67dc86d727e90b5175d7d74b3119fbcb";
  const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

  const tabs = [
    { id: "general", label: "General Settings", icon: Globe },
    { id: "branding", label: "Branding", icon: Image },
    { id: "security", label: "Security", icon: Shield },
    { id: "profile", label: "Profile", icon: User },
  ];

  // Fetch initial admin data
  useEffect(() => {
    console.log("aoi----------->", import.meta.env.VITE_BASE_URL);
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin_data`
        );
        if (response.data.length > 0) {
          console.log(response.data);
          setSettings({
            ...response?.data[0],
            _id: response?.data[0]?._id,
          });
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Handle file upload to ImgBB
  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 32 * 1024 * 1024) {
      setError("File size exceeds 32MB limit");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", IMGBB_API_KEY);

    try {
      const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = response?.data?.data?.url;
      setSettings((prev) => ({ ...prev, [field]: imageUrl }));
    } catch (err) {
      console.error("Error uploading image to ImgBB:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");

      return;
    }

    const dataToSave = { ...settings };
    if (newPassword) {
      dataToSave.currentPassword = currentPassword;
      dataToSave.newPassword = newPassword;
    }

    const id = dataToSave?._id;
    delete dataToSave?._id;

    setLoading(true);
    setError(null);

    try {
      let response;
      if (id) {
        console.log("ID being sent in PATCH:", id);
        console.log("Data being sent:", dataToSave);
        response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/admin_data/${id}`,
          dataToSave
        );
        if (response.data.modifiedCount === 0) {
          setError(
            "No changes were made. Document not found or no updates applied."
          );
          return;
        }
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin_data`,
          dataToSave
        );
        if (response.data.insertedId) {
          setSettings((prev) => ({ ...prev, _id: response?.data?.insertedId }));
        }
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Settings saved successfully");
    } catch (err) {
      console.error("Error saving settings:", err);
      setError(
        err.response?.data?.error ||
          "Failed to save settings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        General Website Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website Title
          </label>
          <input
            type="text"
            value={settings.websiteTitle}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, websiteTitle: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website Tagline
          </label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, tagline: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description
          </label>
          <textarea
            value={settings.metaDescription}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                metaDescription: e.target.value,
              }))
            }
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone
          </label>
          <input
            type="tel"
            value={settings.contactPhone}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, contactPhone: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Office Address
          </label>
          <textarea
            value={settings.officeAddress}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                officeAddress: e.target.value,
              }))
            }
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );

  const renderBrandingSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Branding & Visual Identity
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website Logo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt="Website Logo"
                className="max-h-16 mx-auto mb-3"
              />
            ) : (
              <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
            )}
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              id="logo-upload"
              hidden
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={(e) => handleFileChange(e, "logo")}
              disabled={loading}
            />
            <button
              onClick={() => document.getElementById("logo-upload").click()}
              className="text-primary hover:text-primary/80 text-sm disabled:text-gray-400"
              disabled={loading}
            >
              Upload Logo (PNG, JPG, SVG)
            </button>
            <p className="text-xs text-gray-500 mt-1">Recommended: 200x80px</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {settings.favicon ? (
              <img
                src={settings.favicon}
                alt="Favicon"
                className="max-h-8 mx-auto mb-3"
              />
            ) : (
              <div className="w-8 h-8 bg-primary rounded mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-xs">B</span>
              </div>
            )}
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              id="favicon-upload"
              hidden
              accept="image/x-icon,image/png"
              onChange={(e) => handleFileChange(e, "favicon")}
              disabled={loading}
            />
            <button
              onClick={() => document.getElementById("favicon-upload").click()}
              className="text-primary hover:text-primary/80 text-sm disabled:text-gray-400"
              disabled={loading}
            >
              Upload Favicon (ICO, PNG)
            </button>
            <p className="text-xs text-gray-500 mt-1">Recommended: 32x32px</p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Footer Content</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Footer Description
            </label>
            <textarea
              value={settings.footerDescription}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  footerDescription: e.target.value,
                }))
              }
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={settings.copyrightText}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    copyrightText: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Footer Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {settings.footerLogo ? (
                  <img
                    src={settings.footerLogo}
                    alt="Footer Logo"
                    className="max-h-8 mx-auto mb-1"
                  />
                ) : (
                  <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                )}
                <input
                  type="file"
                  id="footer-logo-upload"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "footerLogo")}
                  disabled={loading}
                />
                <button
                  onClick={() =>
                    document.getElementById("footer-logo-upload").click()
                  }
                  className="text-primary hover:text-primary/80 text-xs disabled:text-gray-400"
                  disabled={loading}
                >
                  Upload Footer Logo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-yellow-600 mr-2" />
          <p className="text-sm text-yellow-800">
            For security reasons, password changes require email verification.
          </p>
        </div>
      </div> */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={settings?.newPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter current password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter new password"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Confirm new password"
            disabled={loading}
          />
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Session Management</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Current Session
              </p>
              <p className="text-xs text-gray-500">
                Chrome on Windows • Bangladesh
              </p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Mobile Session
              </p>
              <p className="text-xs text-gray-500">
                Safari on iPhone • 2 hours ago
              </p>
            </div>
            <button
              className="text-red-600 hover:text-red-800 text-xs"
              disabled={loading}
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Admin Profile</h3>
      <div className="flex items-center space-x-6">
        {settings.profilePhoto ? (
          <img
            src={settings.profilePhoto}
            alt="Profile Photo"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        )}
        <div>
          <input
            type="file"
            id="profile-photo-upload"
            hidden
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileChange(e, "profilePhoto")}
            disabled={loading}
          />
          <button
            onClick={() =>
              document.getElementById("profile-photo-upload").click()
            }
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:bg-gray-400"
            disabled={loading}
          >
            Change Photo
          </button>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG max 2MB</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={settings.fullName}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, adminEmail: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.adminPhone}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, adminPhone: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <input
            type="text"
            value="Super Administrator"
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
          />
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-4">
          Notification Preferences
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                New Lead Notifications
              </p>
              <p className="text-xs text-gray-500">
                Get notified when new leads are submitted
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.newLeadNotifications}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    newLeadNotifications: e.target.checked,
                  }))
                }
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Digest</p>
              <p className="text-xs text-gray-500">
                Weekly summary of activities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.emailDigest}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailDigest: e.target.checked,
                  }))
                }
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "branding":
        return renderBrandingSettings();
      case "security":
        return renderSecuritySettings();
      case "profile":
        return renderProfileSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your application settings and preferences
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      {loading && (
        <div className="text-center">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="hidden sm:flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
            <div className="sm:hidden px-4 py-3">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-6">
            {renderContent()}
            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:bg-gray-400 flex items-center space-x-2"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
