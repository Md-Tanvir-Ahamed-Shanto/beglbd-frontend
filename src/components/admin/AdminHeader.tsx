import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";
import Loading from "../Loading";
import axios from "axios";

const AdminHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data, isLoading, refetch } = useGetAllLeadsData();
  const [Pending, setPending] = useState(0);
  useEffect(() => {
    const filterData = data?.filter((items) => items?.status === "Pending");
    if (filterData?.length > 0) {
      setPending(filterData?.length);
    }
  }, [data]);

  // load admin data--->
  const [adminData, setAdminData] = useState({
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
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/admin_data`).then((res) => {
      // console.log("admin data--->", res.data);
      setAdminData(res?.data[0]);
    });
  }, []);

  const handleProfileClick = () => {
    console.log("Profile clicked");
    setIsProfileOpen(false);
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    setIsProfileOpen(false);
  };

  const handleLogoutClick = () => {
    console.log("Logout clicked");
    localStorage.removeItem("adminAuth");
    window.location.href = "/admin/login";
  };

  const handleWebsiteVisit = () => {
    window.open("/", "_blank");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title - This will be dynamic based on current route */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {adminData?.fullName}
          </p>
        </div>

        {/* Right Side - Search, Website Visit, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Website Visit Button */}
          <button
            onClick={handleWebsiteVisit}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Visit Website"
          >
            <ExternalLink className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-2 right-1 text-red-500 rounded-full">
              {isLoading ? "0" : Pending}
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <img
                  className="rounded-full "
                  src={adminData?.profilePhoto}
                  alt=""
                />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">{adminData?.adminEmail}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <Link
                  to="/admin/settings"
                  onClick={handleSettingsClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Link>
                <hr className="my-2" />
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
