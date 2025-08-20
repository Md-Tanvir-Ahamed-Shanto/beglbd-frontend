
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface University {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  colorCode: string;
}

interface UniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  university?: University | null;
  onSave: (university: University) => void;
}

const UniversityModal: React.FC<UniversityModalProps> = ({ isOpen, onClose, university, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    countryCode: '',
    colorCode: '#FF6B35'
  });

  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name,
        country: university.country,
        countryCode: university.countryCode,
        colorCode: university.colorCode
      });
    } else {
      setFormData({
        name: '',
        country: '',
        countryCode: '',
        colorCode: '#FF6B35'
      });
    }
  }, [university, isOpen]);

  const handleSave = () => {
    const universityData: University = {
      id: university?.id || Date.now(),
      ...formData
    };
    onSave(universityData);
    onClose();
  };

  const colorOptions = ['#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF7675', '#74B9FF'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{university ? 'Edit University' : 'Add New University'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">University Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter university name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter country name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Country Code</label>
            <input
              type="text"
              value={formData.countryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value.toUpperCase() })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., US, UK, CA"
              maxLength={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, colorCode: color })}
                  className={`w-8 h-8 rounded border-2 ${formData.colorCode === color ? 'border-gray-800' : 'border-gray-300'}`}
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
            Save University
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UniversityModal;
