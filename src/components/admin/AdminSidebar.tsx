import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Globe,
  Settings,
  LogOut,
  ChevronRight,
  FileText,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Lead Management", icon: Users, path: "/admin/leads" },
    { name: "Counselor", icon: UserCheck, path: "/admin/counselors" },
    { name: "Document", icon: FileText, path: "/admin/documents" },
    { name: "Website", icon: Globe, path: "/admin/website" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    // UI only - no actual logout logic
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">BEGL BD</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 group ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-gray-100 hover:text-primary"
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
