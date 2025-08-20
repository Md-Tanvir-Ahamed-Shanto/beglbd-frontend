
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, User, ExternalLink } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  phone: string;
  email: string;
  documents: string[];
  uploadDate: string;
  status: string;
}

interface DocumentViewModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({ document, isOpen, onClose }) => {
  if (!document) return null;

  const handleViewDocument = (docName: string) => {
    // Simulate opening document in new tab
    const simulatedUrl = `https://example.com/documents/${document.id}/${docName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    window.open(simulatedUrl, '_blank');
    console.log('Opening document:', docName, 'for student:', document.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Documents Overview</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{document.name}</h3>
              <p className="text-sm text-gray-500">ID: #{document.id}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Phone: {document.phone}</p>
            <p className="text-sm text-gray-600">Email: {document.email}</p>
            <p className="text-sm text-gray-600">Upload Date: {document.uploadDate}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
            <div className="grid grid-cols-1 gap-2">
              {document.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{doc}</span>
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
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              document.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {document.status}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;
