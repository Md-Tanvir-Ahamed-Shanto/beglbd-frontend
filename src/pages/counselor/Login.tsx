import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, GraduationCap, ExternalLink } from "lucide-react";
import useCounselorData from "@/hooks/useCounselorData";
import Loading from "@/components/Loading";

const Login = () => {
  const { data, refetch, isLoading } = useCounselorData();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Counselor login attempt:", formData);

    // check user --->
    const isCounselor = data.find(
      (item) =>
        item?.username === formData.username &&
        item?.password === formData.password
    );
    // console.log(isCounselor)

    if (isCounselor) {
      localStorage.removeItem("Counselor");
      localStorage.setItem("Counselor", isCounselor.username);
      // UI only - redirect to counselor dashboard
      navigate("/counselor/dashboard");
    } else {
      return alert("Invalid Credentials!");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWebsiteVisit = () => {
    window.open("/", "_blank");
  };

  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">BEGL BD</h1>
            <p className="text-sm text-gray-500">Counselor Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Username"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleWebsiteVisit}
              className="w-full flex items-center justify-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
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

export default Login;
