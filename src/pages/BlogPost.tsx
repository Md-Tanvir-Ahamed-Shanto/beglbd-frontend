import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import axios from "axios";
import { Helmet } from "react-helmet";

const BlogPost = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  // share update
  const location = useLocation();
  useEffect(() => {
    const id = location.pathname.split("/")[2];
    if (id) {
      axios
        .patch(`${import.meta.env.VITE_BASE_URL}/add_views/${id}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location]);

  useEffect(() => {
    console.log(location.pathname.split("/")[2]);
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/blog/${id}`
        );
        setBlogPost(res.data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };
    fetchPost();
  }, [id]);

  if (!blogPost) return <div></div>;

  const currentUrl = `${window.location.origin}/blog/${blogPost._id}`;
  const shareText = blogPost.title + "\n\n" + currentUrl;

  const handleShare = (platform) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}&quote=${encodeURIComponent(blogPost.excerpt || blogPost.title)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          currentUrl
        )}&summary=${encodeURIComponent(blogPost.title)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareText
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(currentUrl);
        alert("🔗 Link copied to clipboard!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen font-bangla bg-gradient-to-br py-8 from-blue-50 to-sky-100">
      <Helmet>
        <title>
          {blogPost?.metaTitle || blogPost?.title || "BEGL BD - Blog Post"}
        </title>
        <meta
          name="description"
          content={blogPost?.metaDescription || blogPost?.excerpt || ""}
        />
        <meta
          name="keywords"
          content={
            blogPost?.metaKeywords ||
            (blogPost.tags && blogPost.tags.length > 0
              ? blogPost.tags.join(", ")
              : "study abroad, visa, education")
          }
        />
        <meta name="author" content={blogPost?.author || "BEGL BD"} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={blogPost.title} />
        <meta
          property="og:description"
          content={
            blogPost.excerpt ||
            blogPost.metaDescription ||
            "Explore expert tips and guidance for studying abroad with BEGL BD."
          }
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta
          property="og:image"
          content={
            blogPost.featuredImage && blogPost.featuredImage.startsWith("http")
              ? blogPost.featuredImage
              : `${window.location.origin}${
                  blogPost.featuredImage || "/placeholder.svg"
                }`
          }
        />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@BEGLBD" />
        <meta name="twitter:title" content={blogPost.title} />
        <meta
          property="twitter:description"
          content={
            blogPost.excerpt ||
            blogPost.metaDescription ||
            "Explore expert tips and guidance for studying abroad with BEGL BD."
          }
        />
        <meta
          property="twitter:image"
          content={
            blogPost.featuredImage && blogPost.featuredImage.startsWith("http")
              ? blogPost.featuredImage
              : `${window.location.origin}${
                  blogPost.featuredImage || "/placeholder.svg"
                }`
          }
        />
      </Helmet>

      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="aspect-video overflow-hidden">
              <img
                src={
                  blogPost.featuredImage &&
                  blogPost.featuredImage.startsWith("http")
                    ? blogPost.featuredImage
                    : `${window.location.origin}${
                        blogPost.featuredImage || "/placeholder.svg"
                      }`
                }
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                  {blogPost.category}
                </span>
                {blogPost.tags && blogPost.tags.length > 0
                  ? blogPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))
                  : null}
              </div>

              <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {blogPost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <User size={16} />
                  <span>{blogPost.author || "Admin"}</span>
                </div>
                <div className="flex font-bold items-center space-x-1 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{blogPost.date || blogPost.publishDate}</span>
                </div>
              </div>

              <pre className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {blogPost.content || ""}
              </pre>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">
                    শেয়ার করুন
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare("twitter")}
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare("linkedin")}
                      className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare("whatsapp")}
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare("facebook")}
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare("copy")}
                      className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blog">
            <Button
              variant="outline"
              className="mb-6 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ব্লগে ফিরে যান
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
