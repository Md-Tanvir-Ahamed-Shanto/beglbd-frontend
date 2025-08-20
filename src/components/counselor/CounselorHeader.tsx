
import React from 'react';
import { ExternalLink } from 'lucide-react';

const CounselorHeader = ({ title = "Dashboard", subtitle = "Welcome back" }: { title?: string; subtitle?: string }) => {
  const handleWebsiteVisit = () => {
    window.open('/', '_blank');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Website Visit Button */}
        <div className="flex items-center">
          <button 
            onClick={handleWebsiteVisit}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Visit Website"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CounselorHeader;
