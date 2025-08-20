import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, GraduationCap, ExternalLink } from "lucide-react";
import axios from "axios";

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  // get admin data-->
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/admin_data`).then((res) => {
      const data = res?.data[0];
      setEmail(data?.adminEmail);
      setPassword(data?.newPassword);
    });
  }, []);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin login attempt:", formData);

    // Simple demo authentication
    if (formData.email === email && formData.password === password) {
      // Store object in localStorage
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({ admin: true, email: formData.email })
      );

      navigate("/admin/dashboard");
    } else {
      alert("Invalid credentials.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWebsiteVisit = () => {
    window.open("/", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">BEGL BD</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleWebsiteVisit}
              className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Visit Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
