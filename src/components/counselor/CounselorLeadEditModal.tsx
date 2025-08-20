import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, User } from 'lucide-react';
import useCounselorData from '@/hooks/useCounselorData';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  country: string;
  status: string;
  dateSubmitted: string;
  lastContact: string;
  notes: string;
  counselorId?: string;
  counselorName?: string;
}

interface Counselor {
  id: string;
  name: string;
  username: string;
}

interface CounselorLeadEditModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (leadId: number, updatedData: Partial<Lead>) => void;
}

const CounselorLeadEditModal: React.FC<CounselorLeadEditModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { data, isLoading } = useCounselorData();
  const counselor_username = localStorage.getItem('Counselor');
  const [counselor, setCounselor] = useState<Counselor | null>(null);

  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    lastContact: new Date().toISOString().split('T')[0],
    counselorId: '',
    counselorName: '',
  });

  // Update counselor state when data or counselor_username changes
  useEffect(() => {
    if (data && counselor_username) {
      const counselorData = data.find((item: Counselor) => item.username === counselor_username);
      setCounselor(counselorData || null);
    } else {
      setCounselor(null);
    }
  }, [data, counselor_username]);

  // Sync formData with lead and counselor data
  useEffect(() => {
    if (lead) {
      setFormData({
        status: lead.status || '',
        notes: lead.notes || '',
        lastContact: lead.lastContact || new Date().toISOString().split('T')[0],
        counselorId: counselor?.id || lead.counselorId || '',
        counselorName: counselor?.name || lead.counselorName || '',
      });
    }
  }, [lead, counselor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lead) {
      onUpdate(lead.id, formData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!lead) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <p>Loading counselor data...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!counselor && counselor_username) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p>No counselor found for username: {counselor_username}</p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Edit Lead</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{lead.name}</h3>
              <p className="text-sm text-gray-500">ID: #{lead.id}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="File Open">File Open</option>
              <option value="Successfully Departed">Successfully Departed</option>
              <option value="Not Interested">Not Interested</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Counselor Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="Add detailed notes about this lead, conversation history, next steps, etc..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Contact Date
            </label>
            <input
              type="date"
              value={formData.lastContact}
              onChange={(e) => handleInputChange('lastContact', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
              Update Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CounselorLeadEditModal;