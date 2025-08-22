import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Index";
import About from "./pages/About";
import StudyAbroadProcess from "./pages/StudyAbroadProcess";
import Contact from "./pages/Contact";

// Admin
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import Leads from "./pages/admin/LeadManagement";
import Counselors from "./pages/admin/CounselorManagement";
import Documents from "./pages/admin/DocumentManagement";
import DocumentUpload from "./pages/admin/DocumentUpload";
import WebsiteManagement from "./pages/admin/WebsiteManagement";
import Settings from "./pages/admin/Settings";

// Counselor
import CounselorLogin from "./pages/counselor/Login";
import CounselorDashboard from "./pages/counselor/Dashboard";
import CounselorLayout from "./components/counselor/CounselorLayout";
import CounselorLeads from "./pages/counselor/Leads";
import CounselorDocuments from "./pages/counselor/Documents";
import CounselorAccount from "./pages/counselor/Account";
import CounselorUploadLinks from "./pages/counselor/UploadLinks";

// Student
import StudentDocumentUpload from "./pages/student/DocumentUpload";
import axios from "axios";
import StudyMaterials from "./pages/StudyMaterials";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import MaterialManagement from "./pages/admin/MaterialManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import Loading from "./components/Loading";
import ScrollToTop from "./hooks/ScrollToTop";

// QueryClient টপ-লেভেলে তৈরি করুন
const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  console.log("AppContent rendered, location:", location.pathname);
  // get admin data ===>
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    setIsAdmin(true);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/admin_data`)
      .then((res) => {
        setAdminData(res.data);
        // console.log(res.data);
        setIsAdmin(false);
      })
      .catch((err) => {
        console.error("Error fetching admin data:", err);
      });
  }, []);

  // Route checks
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isCounselorRoute = location.pathname.startsWith("/counselor");
  const isStudentUploadRoute = location.pathname.startsWith("/upload/");
  const hideHeaderFooter =
    isAdminRoute || isCounselorRoute || isStudentUploadRoute;

  // check loading admin--->
  if (isAdmin && !adminData && adminData[0]) {
    return <Loading></Loading>;
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Default Helmet for whole app */}
      <ScrollToTop />

      <Helmet>
        <title>
          {`${adminData[0]?.websiteTitle} | ${adminData[0]?.tagline}` ||
            "BEGL BD - Home"}
        </title>
        <meta
          name="description"
          content={
            adminData[0]?.metaDescription ||
            "বিদেশে পড়াশোনার জন্য ১০০% ফ্রি পরামর্শ। অস্ট্রেলিয়া, কানাডা, যুক্তরাজ্য ও অন্যান্য দেশে উচ্চশিক্ষার সুযোগ।"
          }
        />
        <meta name="author" content="BEGL BD" />

        <meta
          property="og:title"
          content="BEGL BD - বিদেশে পড়াশোনার স্বপ্ন পূরণ"
        />
        <meta
          property="og:description"
          content="বিদেশে পড়াশোনার জন্য ১০০% ফ্রি পরামর্শ। অস্ট্রেলিয়া, কানাডা, যুক্তরাজ্য ও অন্যান্য দেশে উচ্চশিক্ষার সুযোগ।"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="IMAGE_URL_HERE" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@YOUR_TWITTER_HANDLE" />
        <meta name="twitter:image" content="IMAGE_URL_HERE" />

        {/* PNG favicon হলে */}
        <link rel="icon" href={adminData[0]?.favicon} type="image/png" />
      </Helmet>

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
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />

          {/* Student Upload Route */}
          <Route path="/upload/:linkId" element={<StudentDocumentUpload />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="materials" element={<MaterialManagement />} />
            <Route path="blog" element={<BlogManagement />} />
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
