import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Loading from "./components/Loading.tsx";

// ডেটা টাইপ সংজ্ঞায়িত করা (TypeScript-এর জন্য)
interface AdminData {
  websiteTitle: string;
  metaDescription: string;
}

// Root কম্পোনেন্ট তৈরি
const Root = () => {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    // ব্যাকএন্ড থেকে অ্যাডমিন ডেটা ফেচ করা
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/admin_data`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch admin data");
        }
        return response.json();
      })
      .then((data) => {
        setAdminData(data[0]);
        setLoading(false);
        console.log("Admin data fetched successfully:", data[0]);
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>{adminData?.websiteTitle}</title>
        <meta name="description" content={adminData?.metaDescription} />
      </Helmet>
      <App />
    </>
  );
};

// রেন্ডার করা
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Root />);
}
