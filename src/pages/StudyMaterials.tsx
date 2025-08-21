import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, BookOpen, Image, FileIcon } from "lucide-react";

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState("");

  // Fetch materials on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/all_metarial_data`
        );
        // Filter only active materials
        const activeMaterials = response.data.filter(
          (material) => material.status === "Active"
        );
        setMaterials(activeMaterials);
      } catch (err) {
        setError("Failed to load materials");
      }
    };
    fetchMaterials();
  }, []);

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "image":
        return <Image className="w-8 h-8 text-blue-500" />;
      default:
        return <FileIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  const handleDownload = async (material) => {
    try {
      // ফাইল ডাটা আনো
      const response = await axios.get(material.fileUrl, {
        responseType: "arraybuffer", // PDF এর জন্য safest
      });

      // সঠিক mime type বের করো
      const mimeType =
        response.headers["content-type"] || "application/octet-stream";

      // blob তৈরি করো
      const fileBlob = new Blob([response.data], { type: mimeType });
      const fileURL = window.URL.createObjectURL(fileBlob);

      // ফাইল extension detect করো
      let extension = "";
      if (mimeType.includes("pdf")) extension = "pdf";
      else if (mimeType.includes("jpeg")) extension = "jpg";
      else if (mimeType.includes("png")) extension = "png";
      else if (mimeType.includes("msword")) extension = "doc";
      else if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
        extension = "xls";
      else extension = mimeType.split("/")[1] || "file";

      // লিঙ্ক তৈরি করে ডাউনলোড করাও
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `${material?.title}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // memory free
      window.URL.revokeObjectURL(fileURL);

      // update download status---->
      axios.patch(
        `${import.meta.env.VITE_BASE_URL}/increment_download/${material?._id}`
      );
    } catch (err) {
      console.error(err);
      setError("Failed to download material");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded container mx-auto mt-4">
          {error}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">সহায়ক সামগ্রী</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              বিদেশে পড়াশোনার জন্য প্রয়োজনীয় সকল গুরুত্বপূর্ণ ডকুমেন্ট এবং
              গাইডলাইন এক জায়গায়
            </p>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials?.map((material) => (
              <Card
                key={material?._id}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      {material.type === "image" && material.thumbnail ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={material.thumbnail}
                            alt={material.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getFileIcon(material.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {material.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {material.fileSize} • {material.uploadDate}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {material.description}
                  </p>

                  <div className="flex justify-center">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => handleDownload(material)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      ডাউনলোড
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              আরো দেখুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;
