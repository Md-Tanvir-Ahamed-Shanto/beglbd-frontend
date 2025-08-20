
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  onSave: (service: Service) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    icon: 'School',
    color: '#3B82F6',
    description: ''
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        subtitle: service.subtitle,
        icon: service.icon,
        color: service.color,
        description: service.description
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        icon: 'School',
        color: '#3B82F6',
        description: ''
      });
    }
  }, [service, isOpen]);

  const handleSave = () => {
    const serviceData: Service = {
      id: service?.id || Date.now(),
      ...formData
    };
    onSave(serviceData);
    onClose();
  };

  const iconOptions = ['School', 'Globe', 'Users', 'HelpCircle', 'BookOpen', 'Award'];
  const colorOptions = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Service Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter subtitle"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {iconOptions.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex space-x-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded border-2 ${formData.color === color ? 'border-gray-800' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Service
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
