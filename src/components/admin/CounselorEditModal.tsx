import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, User, ToggleLeft } from 'lucide-react';
import axios from 'axios';

interface Counselor {
  id: number;
  name: string;
  email: string;
  username: string;
  assignedLeads: number;
  activeLeads: number;
  completedLeads: number;
  isActive?: boolean;
  password:string;
}

interface CounselorEditModalProps {
  counselor: Counselor | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (counselorId: number, updatedData: Partial<Counselor>) => void;
}

const CounselorEditModal: React.FC<CounselorEditModalProps> = ({
  counselor,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (counselor) {
      setFormData({
        name: counselor.name,
        email: counselor.email,
        username: counselor.username,
        password: '',
        isActive: counselor.isActive !== false,
      });
    }
  }, [counselor]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselor) return;

    // Only send changed fields
    const updatedData: Partial<Counselor> = {};
    if (formData.name !== counselor.name) updatedData.name = formData.name;
    if (formData.email !== counselor.email) updatedData.email = formData.email;
    if (formData.username !== counselor.username) updatedData.username = formData.username;
    if (formData.password) updatedData.password = formData.password;
    if (formData.isActive !== counselor.isActive) updatedData.isActive = formData.isActive;

    if (Object.keys(updatedData).length === 0) {
      onClose();
      return; // Nothing to update
    }

    setLoading(true);
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/counselors/${counselor.id}`, updatedData);
      onUpdate(counselor.id, updatedData);
      onClose();
    } catch (err) {
      console.error('Error updating counselor:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!counselor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Edit Counselor</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{counselor.name}</h3>
              <p className="text-sm text-gray-500">ID: #{counselor.id}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <ToggleLeft className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Account Status</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={loading}>
              {loading ? 'Updating...' : 'Update Counselor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CounselorEditModal;
