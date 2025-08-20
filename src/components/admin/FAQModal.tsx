
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: FAQ | null;
  onSave: (faq: FAQ) => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose, faq, onSave }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer
      });
    } else {
      setFormData({
        question: '',
        answer: ''
      });
    }
  }, [faq, isOpen]);

  const handleSave = () => {
    const faqData: FAQ = {
      id: faq?.id || Date.now(),
      ...formData
    };
    onSave(faqData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{faq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Question</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the question"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the answer"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save FAQ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FAQModal;
