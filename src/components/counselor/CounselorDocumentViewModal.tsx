import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, User, ExternalLink } from "lucide-react";

interface Document {
  id: number;
  name: string;
  phone: string;
  email: string;
  documents: {
    id: string;
    name: string;
    size: number;
    type: string;
  }[];
  dateSubmitted: string;
  status: string;
  totalDocuments: number;
  completedDocuments: number;
}

interface CounselorDocumentViewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const CounselorDocumentViewModal: React.FC<CounselorDocumentViewModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  if (!document) return null;

  const getDocDisplayName = (type: string) => {
    switch (type) {
      case "transcript":
        return "Academic Transcripts";
      case "ielts":
        return "IELTS Certificate";
      case "passport":
        return "Passport Copy";
      case "cv":
        return "CV";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const handleViewDocument = async (doc: {
    id: string;
    name: string;
    size: number;
    type: string;
  }) => {
    try {
      // Fallback base URL if import.meta.env.BASE_URL is undefined
      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const url = `${baseUrl}/api/leads/${document.id}/documents/${doc.id}`;
      console.log("Fetching document from:", url); // Log the URL for debugging

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! Status: ${response.status}`
        );
      }

      // Create a blob URL for the file
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      console.log("Opening document:", doc.name, "for student:", document.name);

      // Clean up the blob URL after a short delay
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch (error: any) {
      console.error("Error opening document:", error.message);
      alert(`Failed to open document: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Student Documents</span>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{document.name}</h3>
              <p className="text-sm text-gray-500">
                Student ID: #{document.id}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Phone: {document.phone}</p>
            <p className="text-sm text-gray-600">Email: {document.email}</p>
            <p className="text-sm text-gray-600">
              Upload Date: {document.dateSubmitted}
            </p>
            <p className="text-sm text-gray-600">
              Progress: {document.completedDocuments}/{document.totalDocuments}{" "}
              documents
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{
                width: `${
                  (document.completedDocuments / document.totalDocuments) * 100
                }%`,
              }}
            ></div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Uploaded Documents
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {document?.documents?.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {getDocDisplayName(doc.type)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Uploaded
                    </span>
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
                      title="View Document"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                document.status === "Complete"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {document.status}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CounselorDocumentViewModal;
