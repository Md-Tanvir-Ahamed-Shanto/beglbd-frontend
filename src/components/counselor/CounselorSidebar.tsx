
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, ChevronRight, Link, Menu, X } from 'lucide-react';
const CounselorSidebar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuItems = [{
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/counselor/dashboard'
  }, {
    name: 'My Leads',
    icon: Users,
    path: '/counselor/leads'
  }, {
    name: 'Documents',
    icon: FileText,
    path: '/counselor/documents'
  }, {
    name: 'Upload Links',
    icon: Link,
    path: '/counselor/upload-links'
  }, {
    name: 'Account',
    icon: Settings,
    path: '/counselor/account'
  }];
  const handleLogout = () => {
    localStorage.removeItem("Counselor")
    navigate('/counselor/login');
    setIsMobileMenuOpen(false);
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button onClick={toggleMobileMenu} className="bg-white shadow-lg p-2 rounded-lg border border-gray-200">
          {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <div className={`
        bg-white shadow-lg min-h-screen flex flex-col transition-transform duration-300 ease-in-out z-40
        lg:translate-x-0 lg:static lg:w-64
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed w-64 lg:relative
      `}>
        {/* Header Section with Close Button */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">B</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">BEGL BD</h1>
                <p className="text-xs sm:text-sm text-gray-500">Counselor Panel</p>
              </div>
            </div>
            
            {/* Close Button - Only visible on mobile */}
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors">
              
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 sm:py-6">
          <ul className="space-y-1 sm:space-y-2 px-3 sm:px-4">
            {menuItems.map(item => <li key={item.name}>
                <NavLink to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={({
              isActive
            }) => `flex items-center px-3 sm:px-4 py-2 sm:py-3 text-gray-700 rounded-lg transition-colors duration-200 group text-sm sm:text-base ${isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 hover:text-primary'}`}>
                  <item.icon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
                  <span className="font-medium">{item.name}</span>
                  <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              </li>)}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm sm:text-base">
            <LogOut className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>;
};
export default CounselorSidebar;
