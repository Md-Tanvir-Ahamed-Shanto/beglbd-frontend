import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useEffect } from "react";

// Root কম্পোনেন্ট তৈরি
const Root = () => {
  useEffect(() => {
    // ব্যাকএন্ড থেকে অ্যাডমিন ডেটা ফেচ করা
    fetch(`${import.meta.env.VITE_BASE_URL}/admin_data`)
      .then((response) => response.json())
      .then((data) => {
        // মেটা ট্যাগ ডায়নামিকভাবে আপডেট
        const metaTitle = document.getElementById("metaTitle");
        const metaDescription = document.getElementById("metaDescription");
        if (metaTitle) {
          metaTitle.setAttribute(
            "content",
            data.websiteTitle || "Default Title"
          );
        }
        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            data.metaDescription || "Default Description"
          );
        }
        // ডকুমেন্ট টাইটেল আপডেট
        document.title = data.websiteTitle || "Default Title";
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
      });
  }, []);

  return <App />;
};

// রেন্ডার করা
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Root />);
}
