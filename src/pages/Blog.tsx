import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("সব");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/all_blogs_data`
        );
        setBlogPosts(res.data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchPosts();
  }, []);
  const handleView = (links) => {
    const id = links;
    axios
      .patch(`${import.meta.env.VITE_BASE_URL}/add_views/${id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const categories = ["সব", ...new Set(blogPosts.map((post) => post.category))];
  const filteredPosts =
    selectedCategory === "সব"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen font-bangla bg-gradient-to-br from-blue-50 to-sky-100">
      {/* helmet using for seo---> */}

      {/* Hero Section */}
      <section className="py-12 lg:py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6">
              আমাদের ব্লগ
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto px-2">
              বিদেশে উচ্চশিক্ষা সম্পর্কে সর্বশেষ তথ্য, টিপস এবং গাইডলাইন পান
              আমাদের ব্লগ থেকে।
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter - Adjusted spacing */}
      <section className="mb-8 py-[60px]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category
                    ? "bg-brand-blue text-white"
                    : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post._id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-brand-green/10 text-brand-green px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{post.readTime || "৫ মিনিট"}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight hover:text-brand-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User size={12} />
                        <span>{post.author || "Admin"}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{post.date || post.publishDate}</span>
                      </div>
                    </div>
                    <Link to={`/blog/${post._id}`}>
                      <Button
                        onClick={() => handleView(post?._id)}
                        size="sm"
                        variant="outline"
                        className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                      >
                        পড়ুন
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
