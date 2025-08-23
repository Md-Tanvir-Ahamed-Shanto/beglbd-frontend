import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useEffect, useState } from "react";
import Loading from "./components/Loading.tsx";

// Root কম্পোনেন্ট তৈরি
const Root = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // ব্যাকএন্ড থেকে অ্যাডমিন ডেটা ফেচ করা
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/admin_data`)
      .then((response) => response.json())
      .then((data) => {
        // মেটা ট্যাগ ডায়নামিকভাবে আপডেট
        const metaTitle = document.getElementById("metaTitle");
        const metaDescription = document.getElementById("metaDescription");
        if (metaTitle) {
          metaTitle.setAttribute("content", data[0]?.websiteTitle);
        }
        if (metaDescription) {
          metaDescription.setAttribute("content", data[0]?.metaDescription);
        }
        // ডকুমেন্ট টাইটেল আপডেট
        document.title = data[0]?.websiteTitle;
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <Loading></Loading>;
  }

  return <App />;
};

// রেন্ডার করা
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Root />);
}
