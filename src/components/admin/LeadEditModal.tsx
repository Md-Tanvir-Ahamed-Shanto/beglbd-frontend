import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";

interface Lead {
  id: number;
  name: string;
  phone: string;
  counselor: string;
  counselorName: string;
  counselorId: string;
  notes: string;
  lastContact: string;
  dateSubmitted: string;
  status: string;
  country: string;
  email: string;
}

interface LeadEditModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (leadId: number, newStatus: string) => void;
}

const LeadEditModal: React.FC<LeadEditModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [status, setStatus] = useState(lead?.status || "");
  const [loading, setLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState(null);
  const { refetch } = useGetAllLeadsData();
  // load admin -->
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth) {
      const parsedAuth = JSON.parse(adminAuth);
      if (parsedAuth.admin) {
        setAdminEmail(parsedAuth.email);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    try {
      setLoading(true);

      // API call to update status

      await axios
        .patch(`${import.meta.env.VITE_BASE_URL}/api/leads/${lead.id}`, {
          status,
          adminEmail,
        })
        .then((res) => {
          refetch();
        });

      // Notify parent component
      onUpdate(lead.id, status);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Failed to update lead status:", error);
      alert("Error updating status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Edit Lead Status</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{lead.name}</h3>
            <p className="text-sm text-gray-500">ID: #{lead.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Contacted">Contacted</option>
              <option value="File Open">File Open</option>
              <option value="Successfully Departed">
                Successfully Departed
              </option>
              <option value="Not Interested">Not Interested</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadEditModal;
