import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle,
  X,
  Phone,
  Shield,
  AlertCircle,
  User,
  Loader2,
} from "lucide-react";
import ThankYouPage from "../../components/student/ThankYouPage";
import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";
import axios from "axios";
import useCounselorData from "@/hooks/useCounselorData";

// NOTE: Required document IDs must match backend validation
// Backend requires: ["transcript", "ielts", "passport"]
const REQUIRED_DOC_IDS = ["transcript", "ielts", "passport"] as const;

// Allowed file types & max size must match multer settings on the server
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;

// Environment base URL
const BASE_URL = import.meta.env.VITE_BASE_URL as string;

// Types
interface UploadedPreview {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded?: boolean;
}

interface LeadFromLinkApi {
  _id: string;
  id?: string | number;
  name?: string;
  phone?: string;
}

const documentTypes = [
  { id: "transcript", label: "Academic Transcript", required: true },
  { id: "ielts", label: "IELTS Score Report", required: true },
  { id: "passport", label: "Passport Copy", required: true },
  { id: "cv", label: "Curriculum Vitae (CV)", required: false },
  { id: "sop", label: "Statement of Purpose", required: false },
  { id: "recommendation", label: "Recommendation Letters", required: false },
  { id: "financial", label: "Financial Documents", required: false },
  { id: "other", label: "Other Documents", required: false },
] as const;

export default function StudentDocumentUpload() {
  const [linkId, setLinkId] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedPreview[]>([]);
  const [filesByType, setFilesByType] = useState<Record<string, File[]>>({});

  const [counselorUsername, setCounselorUsername] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [lead, setLead] = useState<LeadFromLinkApi | null>(null);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState("");
  // const [counselorUserName , setCounselorUsername] = useState("")

  // Existing hook to read all leads for phone verification (kept as-is per request)
  const { data: allLeads = [] } = useGetAllLeadsData() as { data: any[] };
  const { data } = useCounselorData();
  useEffect(() => {
    const findLeads = allLeads.find((item) => item.phone === phoneNumber);
    console.log("find leads-->", findLeads);
    if (findLeads?.counselorName) {
      const findCounselor = data?.find(
        (item) => item.name === findLeads.counselorName
      );
      if (findCounselor?.username) {
        setCounselorUsername(findCounselor.username);
        console.log(
          "find username--> ",
          findLeads?.id,
          findCounselor?.username
        );
        setLinkId(findLeads?.id);
      }
      console.log(findCounselor);
    }
  }, [allLeads, data, phoneNumber]);

  // Fetch lead by linkId (to show context & ensure link validity)
  useEffect(() => {
    if (!linkId) return;
    const run = async () => {
      try {
        setLeadLoading(true);
        setLeadError("");
        const res = await axios.get(`${BASE_URL}/api/leads/link/${linkId}`);
        setLead(res.data as LeadFromLinkApi);
      } catch (err: any) {
        setLeadError(
          err?.response?.data?.error || "Failed to load upload link"
        );
      } finally {
        setLeadLoading(false);
      }
    };
    run();
  }, [linkId]);

  const handlePhoneVerification = () => {
    if (phoneNumber.replace(/\s/g, "").length < 10) {
      setVerificationError("Please enter a valid phone number");
      return;
    }
    setIsChecking(true);
    setVerificationError("");

    try {
      // Keep the original local verification logic (as you requested)
      const isRegistered = allLeads.find(
        (item: any) =>
          (item?.phone || "").replace(/\s/g, "") ===
          phoneNumber.replace(/\s/g, "")
      );
      if (isRegistered) {
        setIsVerified(true);
        setVerificationError("");
      } else {
        setVerificationError("Please try with registered phone number");
      }
    } finally {
      setIsChecking(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_MIME.includes(file.type)) {
      return "Only PDF, JPG, and PNG files are allowed";
    }
    if (file.size > MAX_FILE_BYTES) {
      return "File size must be under 10MB";
    }
    return null;
  };

  const handleFileUpload = (documentType: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nextByType: Record<string, File[]> = { ...filesByType };
    const previews: UploadedPreview[] = [];
    const errors: string[] = [];

    const existingForType = nextByType[documentType] || [];

    Array.from(files).forEach((file) => {
      const err = validateFile(file);
      if (err) {
        errors.push(`${file.name}: ${err}`);
        return;
      }
      existingForType.push(file);
      previews.push({
        id: Math.random().toString(36).slice(2, 11),
        name: file.name,
        size: file.size,
        type: documentType,
        uploaded: true,
      });
    });

    nextByType[documentType] = existingForType;
    setFilesByType(nextByType);
    setUploadedFiles((prev) => [...prev, ...previews]);

    if (errors.length) {
      setSubmitError(errors.join("\n"));
    }
  };

  const removeFile = (fileId: string) => {
    // Remove from preview list
    const toRemove = uploadedFiles.find((f) => f.id === fileId);
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== fileId));
    if (!toRemove) return;

    // Also remove from filesByType
    const list = filesByType[toRemove.type] || [];
    const idx = list.findIndex(
      (f) => f.name === toRemove.name && f.size === toRemove.size
    );
    if (idx > -1) {
      const next = [...list.slice(0, idx), ...list.slice(idx + 1)];
      setFilesByType({ ...filesByType, [toRemove.type]: next });
    }
  };

  const requiredUploadedCount = useMemo(() => {
    return REQUIRED_DOC_IDS.filter(
      (reqId) => (filesByType[reqId] || []).length > 0
    ).length;
  }, [filesByType]);

  // const canSubmit = useMemo(() => {
  //   const hasAllRequired = REQUIRED_DOC_IDS.every((id) => (filesByType[id] || []).length > 0);
  //   const hasAnyFiles = uploadedFiles.length > 0;
  //   console.log(isVerified && !!counselorUsername && hasAllRequired && hasAnyFiles && !!linkId)
  //   // return isVerified && !!counselorUsername && hasAllRequired && hasAnyFiles && !!linkId;
  // }, [isVerified, counselorUsername, uploadedFiles.length, filesByType, linkId]);

  const canSubmit = () => {
    () => {
      const hasAllRequired = REQUIRED_DOC_IDS.every(
        (id) => (filesByType[id] || []).length > 0
      );
      const hasAnyFiles = uploadedFiles.length > 0;
      console.log(
        isVerified &&
          !!counselorUsername &&
          hasAllRequired &&
          hasAnyFiles &&
          !!linkId
      );
      return (
        isVerified &&
        !!counselorUsername &&
        hasAllRequired &&
        hasAnyFiles &&
        !!linkId
      );
    };
  };

  const handleSubmitDocuments = async () => {
    setSubmitError("");
    // console.log(linkId);

    if (!linkId) {
      setSubmitError("Invalid upload link.");
      return;
    }
    if (!counselorUsername) {
      setSubmitError("Please enter counselor username");
      return;
    }

    // Ensure required documents are present
    const missing = REQUIRED_DOC_IDS.filter(
      (id) => !(filesByType[id] && filesByType[id].length > 0)
    );
    if (missing.length) {
      setSubmitError(`Missing required documents: ${missing.join(", ")}`);
      return;
    }

    try {
      setSubmitting(true);

      const form = new FormData();
      form.append("counselorUsername", counselorUsername);

      // Append each file; add a mapping field for its document type so backend can read it
      Object.entries(filesByType).forEach(([docType, files]) => {
        files.forEach((file) => {
          form.append("documents", file, file.name);
          // Important: the backend reads req.body[`documentType_${file.originalname}`]
          form.append(`documentType_${file.name}`, docType);
        });
      });

      const res = await axios.post(
        `${BASE_URL}/api/leads/${linkId}/documents`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res?.data) {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to upload documents";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }

    console.log(submitError);
  };

  // Thank You page after successful submission
  if (isSubmitted) {
    return <ThankYouPage />;
  }

  // If not verified yet, show verification card
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          {/* Header */}
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
            {leadLoading ? (
              <p className="text-xs text-gray-500 mt-2">Loading link...</p>
            ) : leadError ? (
              <p className="text-xs text-red-600 mt-2">{leadError}</p>
            ) : linkId ? (
              <p className="text-xs text-gray-500 mt-2">Upload ID: {linkId}</p>
            ) : null}
          </div>

          {/* Verification Form */}
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
              disabled={
                phoneNumber.replace(/\s/g, "").length < 10 || isChecking
              }
              className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm lg:text-base transition-colors"
            >
              {isChecking ? "Checking..." : "Check Phone Number"}
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Secure Upload
                </p>
                <p className="text-xs sm:text-sm text-blue-700 mt-1">
                  Your documents are encrypted and stored securely. Only
                  authorized personnel can access them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verified view
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
              {lead?.name && (
                <p className="text-xs text-gray-500">Student: {lead.name}</p>
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

        {/* Counselor username */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Counselor Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={counselorUsername}
                onChange={(e) => setCounselorUsername(e.target.value.trim())}
                placeholder={counselorUsername}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                This must match the counselor's username in the system.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Upload Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p>Upload clear, high-quality scans of your documents</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p>Accepted formats: PDF, JPG, PNG (Max 10MB per file)</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p>Ensure all text is readable and not cropped</p>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p>
                Documents should be in English or with certified translations
              </p>
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
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileUpload(docType.id, e.target.files)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  PDF, JPG, PNG up to 10MB
                </p>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.filter((file) => file.type === docType.id).length >
                0 && (
                <div className="mt-3 sm:mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Uploaded Files:
                  </h4>
                  {uploadedFiles
                    .filter((file) => file.type === docType.id)
                    .map((file) => (
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
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <button
                            onClick={() => removeFile(file.id)}
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

        {/* Submit Button + Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mt-4 sm:mt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                Total Files Uploaded:{" "}
                <span className="font-medium">{uploadedFiles.length}</span>
              </p>
              <p>
                Required Documents:{" "}
                <span className="font-medium">
                  {requiredUploadedCount} / {REQUIRED_DOC_IDS.length}
                </span>
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 w-full lg:w-auto">
              {submitError && (
                <div className="text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {submitError}
                </div>
              )}
              <button
                onClick={handleSubmitDocuments}
                disabled={!canSubmit || submitting}
                className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-primary/90 font-medium text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Uploading...
                  </>
                ) : (
                  "Submit Documents"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-4 sm:mt-6 p-4 text-xs sm:text-sm text-gray-500">
          <p>
            Need help? Contact us at{" "}
            <a
              href="mailto:support@beglbd.com"
              className="text-primary hover:underline"
            >
              support@beglbd.com
            </a>{" "}
            or call +880 1712-345678
          </p>
        </div>
      </div>
    </div>
  );
}
