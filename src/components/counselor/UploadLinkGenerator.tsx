
import React, { useState } from 'react';
import { Link, Copy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UploadLinkGenerator = () => {
  const { toast } = useToast();
  const [generatedLinks, setGeneratedLinks] = useState<Array<{
    id: string;
    link: string;
    createdAt: string;
    studentName?: string;
  }>>([]);

  const [studentName, setStudentName] = useState('');

  const handleGenerateLink = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
    const newLink = `https://beglbd.com/upload/${randomId}`;
    
    const linkData = {
      id: randomId,
      link: newLink,
      createdAt: new Date().toLocaleString(),
      studentName: studentName.trim() || undefined
    };

    setGeneratedLinks(prev => [linkData, ...prev]);
    setStudentName('');
    console.log('Generated upload link:', linkData);
    
    toast({
      title: "Upload link generated",
      description: "The upload link has been created successfully.",
    });
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied",
        description: "The upload link has been copied to clipboard.",
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Link copied",
          description: "The upload link has been copied to clipboard.",
        });
      } catch (fallbackErr) {
        toast({
          title: "Copy failed",
          description: "Failed to copy link. Please copy manually.",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Document Upload Links</h3>
      
      {/* Generate New Link Section */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex flex-col gap-2 sm:gap-3">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Student name (optional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button 
            onClick={handleGenerateLink}
            className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Link</span>
          </button>
        </div>
      </div>

      {/* Generated Links List */}
      {generatedLinks.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Generated Links</h4>
          <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
            {generatedLinks.map((linkData) => (
              <div key={linkData.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {linkData.studentName && (
                        <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1 truncate">{linkData.studentName}</p>
                      )}
                      <p className="text-xs text-gray-500">Created: {linkData.createdAt}</p>
                    </div>
                    <button 
                      onClick={() => handleCopyLink(linkData.link)}
                      className="px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-300 flex items-center space-x-1 transition-colors flex-shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      <span className="hidden xs:inline">Copy</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link className="w-3 sm:w-4 h-3 sm:h-4 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0 bg-white border border-gray-300 rounded px-2 py-1">
                    <input
                      type="text"
                      value={linkData.link}
                      readOnly
                      className="w-full text-xs sm:text-sm bg-transparent border-none outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {generatedLinks.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <Link className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
          <p className="text-sm sm:text-base">No upload links generated yet</p>
          <p className="text-xs sm:text-sm">Generate your first link above</p>
        </div>
      )}
    </div>
  );
};

export default UploadLinkGenerator;
