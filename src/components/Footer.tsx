import React from "react";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Footer = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["footerData"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin_data`
      );
      console.log("API Response:", res.data);
      return res.data;
    },
  });

  console.log("Footer component rendered");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !Array.isArray(data) || data.length === 0)
    return <div>No data available</div>;

  const footerData = data[0] || {};
  console.log("Footer Logo URL:", footerData.footerLogo);

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                {footerData.footerLogo ? (
                  <img
                    className="rounded-full"
                    src={footerData.footerLogo}
                    alt="Logo"
                    onError={() => console.error("Failed to load footer logo")}
                  />
                ) : (
                  <span>No Logo</span>
                )}
              </div>
              <h3 className="text-xl font-bold">BEGL BD</h3>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-4">
              {footerData.footerDescription ||
                "Footer description not available"}
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href={footerData.facebook || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href={footerData.instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href={footerData.youtube || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors"
              >
                <Youtube size={16} />
              </a>
              <a
                href={footerData.linkedin || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  হোম
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link
                  to="/study-abroad-process"
                  className="hover:text-white transition-colors"
                >
                  বিদেশে পড়াশোনার প্রক্রিয়া
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">সেবাসমূহ</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• ফ্রি কনসাল্টেশন</li>
              <li>• ভিসা প্রসেসিং</li>
              <li>• ইউনিভার্সিটি অ্যাপ্লিকেশন</li>
              <li>• স্কলারশিপ গাইডেন্স</li>
              <li>• অ্যাকমোডেশন সাপোর্ট</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">যোগাযোগ</h4>
            <div className="space-y-2 text-gray-300">
              <p>📞 {footerData.contactPhone || "01768037870"}</p>
              <p>✉️ {footerData.contactEmail || "info@begleducation.com"}</p>
              <p>📍 {footerData.officeAddress || " গুলশান, ঢাকা, বাংলাদেশ"}</p>
              <p>🕒 রবি - বৃহস্পতি: ৯:০০ - ৬:০০</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-300 text-lg font-medium">
            আপনার স্বপ্ন পূরণে আমরা আছি পাশে
          </p>
          <p className="text-gray-400 text-sm mt-2">
            ©{" "}
            {footerData.copyrightText ||
              "২০২৪ BEGL BD। সর্বস্বত্ব সংরক্ষিত। | Design & Developed by Ahasanul Haque Khairul "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
