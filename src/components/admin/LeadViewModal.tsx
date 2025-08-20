
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Phone, Mail, MapPin, Calendar, UserCheck, FileText, MessageCircle } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  country: string;
  status: string;
  dateSubmitted: string;
  counselor: string;
  counselorId?: string;
  counselorName?: string;
  notes?: string;
  lastContact?: string;
}

interface LeadViewModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const LeadViewModal: React.FC<LeadViewModalProps> = ({ lead, isOpen, onClose }) => {
  if (!lead) return null;

  // Mock counselor data - in real app this would come from the lead data
  const counselorInfo = {
    name: lead.counselor,
    id: lead.counselorId,
    lastContact: lead.lastContact  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Lead Details</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{lead.name}</h3>
              <p className="text-sm text-gray-500">ID: #{lead.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{lead.phone}</span>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{lead.email}</span>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{lead.country}</span>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Submitted: {lead.dateSubmitted}</span>
            </div>
          </div>

          <div className="pt-2">
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              lead.status === 'File Open' ? 'bg-green-100 text-green-800' :
              lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
              lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {lead.status}
            </span>
          </div>

          {/* Counselor Information Section */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Counselor Information</h4>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">{counselorInfo.name}</p>
                  <p className="text-xs text-blue-700">@{counselorInfo.id}</p>
                  <p className="text-xs text-blue-600 mt-1">Last contact: {counselorInfo.lastContact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {lead.notes && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Counselor Notes</h4>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MessageCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-green-800 whitespace-pre-wrap">{lead.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadViewModal;
