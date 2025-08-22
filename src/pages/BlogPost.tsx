import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import axios from "axios";
import { Helmet } from "react-helmet";

const BlogPost = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState<any>(null);

  useEffect(() => {
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

  if (!blogPost) return <div>Loading...</div>;

  return (
    <div className="min-h-screen font-bangla bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Header */}
      {/* SEO Metadata */}
      <Helmet>
        <title>
          {blogPost?.metaTitle || blogPost?.title || "BEGL BD - Blog Post"}
        </title>
        <meta
          name="description"
          content={
            blogPost?.metaDescription ||
            blogPost?.excerpt ||
            "বিদেশে পড়াশোনার জন্য ১০০% ফ্রি পরামর্শ। অস্ট্রেলিয়া, কানাডা, যুক্তরাজ্য ও অন্যান্য দেশে উচ্চশিক্ষার সুযোগ।"
          }
        />
        <meta
          name="keywords"
          content={
            blogPost?.metaKeywords ||
            blogPost.tags.join(", ") ||
            "study abroad, education, visa"
          }
        />
        <meta name="author" content={blogPost?.author || "BEGL BD"} />
        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content={
            blogPost?.metaTitle || blogPost?.title || "BEGL BD - Blog Post"
          }
        />
        <meta
          property="og:description"
          content={
            blogPost?.metaDescription ||
            blogPost?.excerpt ||
            "বিদেশে পড়াশোনার জন্য ১০০% ফ্রি পরামর্শ। অস্ট্রেলিয়া, কানাডা, যুক্তরাজ্য ও অন্যান্য দেশে উচ্চশিক্ষার সুযোগ।"
          }
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${window.location.origin}/blog/${blogPost._id}`}
        />
        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@BEGLBD" />{" "}
        {/* Replace with your actual Twitter handle */}
        <meta
          name="twitter:title"
          content={
            blogPost?.metaTitle || blogPost?.title || "BEGL BD - Blog Post"
          }
        />
        <meta
          name="twitter:description"
          content={
            blogPost?.metaDescription ||
            blogPost?.excerpt ||
            "বিদেশে পড়াশোনার জন্য ১০০% ফ্রি পরামর্শ। অস্ট্রেলিয়া, কানাডা, যুক্তরাজ্য ও অন্যান্য দেশে উচ্চশিক্ষার সুযোগ।"
          }
        />
      </Helmet>
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

      {/* Article */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="overflow-hidden shadow-2xl border-0">
            {/* Featured Image */}
            <div className="aspect-video overflow-hidden">
              <img
                src={blogPost.featuredImage || "/placeholder.svg"}
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <CardContent className="p-6 lg:p-8">
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                  {blogPost.category}
                </span>
                {blogPost.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {blogPost.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <User size={16} />
                  <span>{blogPost.author || "Admin"}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{blogPost.date || blogPost.publishDate}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{blogPost.readTime || "৫ মিনিট"}</span>
                </div>
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />

              {/* Share Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">
                    শেয়ার করুন
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
