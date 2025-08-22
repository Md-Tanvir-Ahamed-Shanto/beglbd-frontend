import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle,
  X,
  Phone,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ThankYouPage from "../../components/student/ThankYouPage";
import axios from "axios";
import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";
import Loading from "@/components/Loading";

const StudentDocumentUpload = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [uploadErrors, setUploadErrors] = useState({});

  // Store uploaded file info with links
  const [documents, setDocuments] = useState({});

  const { data, isLoading } = useGetAllLeadsData();

  const documentTypes = [
    { id: "transcript", label: "Academic Transcript", required: true },
    { id: "ielts", label: "IELTS Score Report", required: true },
    { id: "passport", label: "Passport Copy", required: true },
    { id: "cv", label: "Curriculum Vitae (CV)", required: false },
    { id: "sop", label: "Statement of Purpose", required: false },
    { id: "recommendation", label: "Recommendation Letters", required: false },
    { id: "financial", label: "Financial Documents", required: false },
    { id: "other", label: "Other Documents", required: false },
  ];

  const handlePhoneVerification = () => {
    if (phoneNumber.length < 10) {
      setVerificationError("Please enter a valid phone number");
      return;
    }

    setIsChecking(true);
    setVerificationError("");

    setTimeout(() => {
      // Check in fetched data for phone property
      const isRegistered = data?.some(
        (lead) =>
          lead.phone?.replace(/\s/g, "") === phoneNumber.replace(/\s/g, "")
      );

      if (isRegistered) {
        setIsVerified(true);
        setVerificationError("");
      } else {
        setVerificationError("Please try with registered phone number");
      }
      setIsChecking(false);
    }, 500);
  };

  // Upload file to ImgBB or PDF.co based on file type
  const uploadFile = async (file) => {
    if (!file) {
      throw new Error("No file selected");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isImage = ["png", "jpg", "jpeg"].includes(fileExtension);
    const isPdf = fileExtension === "pdf";

    if (!isImage && !isPdf) {
      throw new Error(
        "Unsupported file type. Only PDF, PNG, JPG, JPEG allowed."
      );
    }

    const formData = new FormData();
    if (isImage) {
      formData.append("image", file);
      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=a710bf9dd69fd9fc2860512c2c901c31`,
          formData
        );
        return response.data.data.url;
      } catch (err) {
        throw new Error(
          err.response?.data?.error?.message ||
            "Failed to upload image to ImgBB"
        );
      }
    } else if (isPdf) {
      formData.append("file", file);
      try {
        const response = await axios.post(
          "https://api.pdf.co/v1/file/upload",
          formData,
          {
            headers: {
              "x-api-key":
                "akwebdev69@gmail.com_t9X8MSFZRD73MGhARssr0t2SijHRymWfUcIZbP5E2xPw9gh9ChiUTZkq2BggcIau",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.url;
      } catch (err) {
        throw new Error(
          err.response?.data?.error || "Failed to upload PDF to PDF.co"
        );
      }
    }
  };

  const handleFileUpload = async (documentType, files) => {
    if (!files) return;

    const uploadedLinks = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const url = await uploadFile(file);
        if (url) {
          uploadedLinks.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            url: url,
            thumbnail: url,
          });
        }
      } catch (err) {
        setUploadErrors((prev) => ({
          ...prev,
          [documentType]: err.message || "Failed to upload file",
        }));
      }
    }

    if (uploadedLinks.length > 0) {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: prev[documentType]
          ? [...prev[documentType], ...uploadedLinks]
          : uploadedLinks,
      }));
      setUploadErrors((prev) => ({
        ...prev,
        [documentType]: "",
      }));
    }
  };

  const removeFile = (documentType, fileId) => {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: prev[documentType].filter((file) => file.id !== fileId),
    }));
    setUploadErrors((prev) => ({
      ...prev,
      [documentType]: "",
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmitDocuments = () => {
    // Check if all required document types have at least one file
    const missingRequired = documentTypes
      .filter((doc) => doc.required)
      .some((doc) => !documents[doc.id] || documents[doc.id].length === 0);

    if (missingRequired) {
      alert("Please upload all required documents before submitting.");
      return;
    }

    console.log("Documents array:", documents);

    axios
      .patch(
        `${import.meta.env.VITE_BASE_URL}/add_new_document/${phoneNumber}`,
        documents
      )
      .then((res) => {
        console.log(res.data);
        setIsSubmitted(true);
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Try again later.");
      });
  };

  if (isLoading) return <Loading />;

  if (isSubmitted) {
    return <ThankYouPage />;
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 lg:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Document Upload Portal
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Verify your phone number to continue
            </p>
            {linkId && (
              <p className="text-xs text-gray-500 mt-2">Upload ID: {linkId}</p>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setVerificationError("");
                  }}
                  placeholder="01712345678"
                  className="pl-10 pr-4 py-2.5 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm lg:text-base"
                />
              </div>
              {verificationError && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {verificationError}
                </p>
              )}
            </div>

            <button
              onClick={handlePhoneVerification}
              disabled={phoneNumber.length < 10 || isChecking}
              className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm lg:text-base transition-colors"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block" />
                  Checking...
                </>
              ) : (
                "Check Phone Number"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Document Upload
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Upload your required documents for study abroad application
              </p>
              {linkId && (
                <p className="text-xs text-gray-500 mt-1">
                  Upload ID: {linkId}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-medium">
                Verified: {phoneNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Document Upload Sections */}
        <div className="space-y-4 sm:space-y-6">
          {documentTypes.map((docType) => (
            <div
              key={docType.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {docType.label}
                    </h3>
                    {docType.required && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full mt-1">
                        Required
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2 sm:mb-3" />
                <div className="mb-2 sm:mb-3">
                  <label className="cursor-pointer">
                    <span className="text-primary hover:text-primary/80 font-medium text-sm sm:text-base">
                      Click to upload
                    </span>
                    <span className="text-gray-600 text-sm sm:text-base">
                      {" "}
                      or drag and drop
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) =>
                        handleFileUpload(docType.id, e.target.files)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  PDF, PNG, JPG, JPEG up to 10MB
                </p>
              </div>

              {/* Upload Error */}
              {uploadErrors[docType.id] && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {uploadErrors[docType.id]}
                </p>
              )}

              {/* Uploaded Files Preview */}
              {documents[docType.id]?.length > 0 && (
                <div className="mt-3 sm:mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Uploaded Files:
                  </h4>
                  {documents[docType.id].map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-xs hover:underline"
                          >
                            Preview
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <button
                          onClick={() => removeFile(docType.id, file.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mt-4 sm:mt-6">
          <button
            onClick={handleSubmitDocuments}
            className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary/90 font-medium w-full lg:w-auto text-sm sm:text-base transition-colors"
          >
            Submit Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDocumentUpload;
