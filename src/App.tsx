import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Index";
import About from "./pages/About";
import StudyAbroadProcess from "./pages/StudyAbroadProcess";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import CounselorLogin from "./pages/counselor/Login";
import CounselorDashboard from "./pages/counselor/Dashboard";
import CounselorLayout from "./components/counselor/CounselorLayout";
import AdminLayout from "./components/admin/AdminLayout";
import Leads from "./pages/admin/LeadManagement";
import Counselors from "./pages/admin/CounselorManagement";
import Documents from "./pages/admin/DocumentManagement";
import DocumentUpload from "./pages/admin/DocumentUpload";
import WebsiteManagement from "./pages/admin/WebsiteManagement";
import Settings from "./pages/admin/Settings";
import CounselorLeads from "./pages/counselor/Leads";
import CounselorDocuments from "./pages/counselor/Documents";
import CounselorAccount from "./pages/counselor/Account";
import CounselorUploadLinks from "./pages/counselor/UploadLinks";
import StudentDocumentUpload from "./pages/student/DocumentUpload";

// QueryClient টপ-লেভেলে তৈরি করুন
const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  console.log("AppContent rendered, location:", location.pathname);

  // More specific check for admin and counselor routes
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCounselorRoute = location.pathname.startsWith("/counselor");
  const isStudentUploadRoute = location.pathname.startsWith("/upload/");
  const hideHeaderFooter =
    isAdminRoute || isCounselorRoute || isStudentUploadRoute;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/study-abroad-process"
            element={<StudyAbroadProcess />}
          />
          <Route path="/contact" element={<Contact />} />

          {/* Student Upload Route */}
          <Route path="/upload/:linkId" element={<StudentDocumentUpload />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="counselors" element={<Counselors />} />
            <Route path="documents" element={<Documents />} />
            <Route path="document-upload" element={<DocumentUpload />} />
            <Route path="website" element={<WebsiteManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Counselor Routes */}
          <Route path="/counselor/login" element={<CounselorLogin />} />
          <Route path="/counselor" element={<CounselorLayout />}>
            <Route path="dashboard" element={<CounselorDashboard />} />
            <Route path="leads" element={<CounselorLeads />} />
            <Route path="documents" element={<CounselorDocuments />} />
            <Route path="upload-links" element={<CounselorUploadLinks />} />
            <Route path="account" element={<CounselorAccount />} />
          </Route>
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Router>
  );
}

export default App;
