
import React from 'react';
import { Outlet } from 'react-router-dom';
import CounselorSidebar from './CounselorSidebar';

const CounselorLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CounselorSidebar />
      <div className="flex-1 lg:ml-0 w-full min-w-0">
        <div className="pt-16 lg:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CounselorLayout;
