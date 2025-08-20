import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle,
  Globe,
  GraduationCap,
  Users,
  Star,
  Plane,
  FileText,
  MapPin,
  Award,
  Target,
  TrendingUp,
  School,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import axios from "axios";
import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";
import useHeroData from "@/hooks/useHeroData";
import Loading from "@/components/Loading";

type ServiceDoc = {
  _id?: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
};

type UniversityDoc = {
  _id?: string;
  name: string;
  country: string;
  countryCode: string;
  colorCode: string;
};

type FAQDoc = {
  _id?: string;
  question: string;
  answer: string;
};

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  School,
  Globe,
  Users,
  HelpCircle,
  BookOpen,
  Award,
};

const Index = () => {
  const { data, refetch } = useGetAllLeadsData();
  const { data: heroSectionData, isLoading } = useHeroData();
  console.log("Index component is rendering...");
  const date1 = new Date();
  const applyDate = date1.toLocaleDateString();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
  });
  const finaldata = {
    ...formData,
    status: "Pending",
    dateSubmitted: applyDate,
    counselor: "Not Assigned",
    counselorName: "",
    counselorId: "",
    notes: "",
    lastContact: "",
    id: data?.length,
  };
  const { toast } = useToast();

  // Counter animation state
  const [counters, setCounters] = useState({
    totalInterested: 0,
    filesOpened: 0,
    successfullyDeparted: 0,
  });

  const [finalCounts, setFinalCount] = useState({
    totalInterested: 0,
    filesOpened: 0,
    successfullyDeparted: 0,
  });
  // !stats management---->
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/stats_collection`)
      .then((res) => {
        const data11 = res.data;
        if (Array.isArray(data11) && data11.length > 0) {
          const myData111 = data11[0];
          setFinalCount({
            totalInterested: parseInt(myData111?.interestedStudents || 0),
            filesOpened: parseInt(myData111?.filesOpened || 0),
            successfullyDeparted: parseInt(
              myData111?.successfullyDeparted || 0
            ),
          });
        }
      })
      .catch((err) => console.log("Stats fetch error:", err));
  }, []);

  useEffect(() => {
    console.log("Index component mounted successfully");

    // Animate counters
    const animateCounters = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounters({
          totalInterested: Math.floor(finalCounts.totalInterested * progress),
          filesOpened: Math.floor(finalCounts.filesOpened * progress),
          successfullyDeparted: Math.floor(
            finalCounts.successfullyDeparted * progress
          ),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounters(finalCounts);
        }
      }, stepDuration);
    };

    // Start animation after a short delay
    const timeout = setTimeout(animateCounters, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [finalCounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Form submitted with data:', formData);
    // console.log("form data------>"  ,finaldata)
    if (!formData.name || !formData.phone || !formData.country) {
      toast({
        title: "সব ফিল্ড পূরণ করুন",
        description: "অনুগ্রহ করে সব তথ্য দিন",
        variant: "destructive",
      });
      return;
    }
    // my work --01 -- send lead data to database by servser
    const apiurl = `${import.meta.env.VITE_BASE_URL}/add_new_lead`;

    axios
      .post(apiurl, finaldata)
      .then((res) => {
        const data = res.data;
        refetch();
        // console.log(data)
        alert("ধন্যবাদ! , আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।");
      })
      .catch((error) => {
        console.error("Error from sending lead data to database:", error);
      });

    setFormData({
      name: "",
      phone: "",
      email: "",
      country: "",
    });
  };

  const [servicesData, setServicesData] = useState<ServiceDoc[]>([]);
  const [universitiesData, setUniversitiesData] = useState<UniversityDoc[]>([]);
  const [faqData, setFaqData] = useState<FAQDoc[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/our_services`)
      .then((res) => {
        setServicesData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.log("Services fetch error:", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/all_university_partners`)
      .then((res) => {
        setUniversitiesData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.log("Universities fetch error:", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/all_faqs`)
      .then((res) => {
        setFaqData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.log("FAQs fetch error:", err));
  }, []);

  // check loading
  if (isLoading) {
    return <Loading></Loading>;
  }
  // console.log('About to render Index JSX...');
  return (
    <div className="min-h-screen font-bangla bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-green-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-6 sm:mb-8 leading-tight"
                style={{
                  lineHeight: "1.1",
                }}
              >
                {heroSectionData[0].title || "বিদেশে পড়াশোনা"}
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 bg-clip-text text-transparent block mt-2">
                  {heroSectionData[0].subtitle || " এখন আরও সহজ!"}
                </span>
              </h1>
              <p
                className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6 leading-relaxed"
                style={{
                  lineHeight: "1.5",
                }}
              >
                {heroSectionData[0].description ||
                  " অস্ট্রেলিয়া, যুক্তরাজ্য, মালয়েশিয়া, নিউজিল্যান্ডে ভর্তি ও ভিসা সাপোর্ট"}
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                পান ১০০% ফ্রি পরামর্শ ও সম্পূর্ণ সাপোর্ট
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {heroSectionData[0].primaryButton || " ফ্রি পরামর্শ নিন"}
                </Button>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-6 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:border-transparent transition-all duration-300"
                  >
                    {heroSectionData[0].secondaryButton || "আরও জানুন"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-white shadow-2xl border-0 animate-fade-in overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 h-2"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    ফ্রি কনসাল্টেশনের জন্য যোগাযোগ করুন
                  </h3>
                  <p className="text-gray-600">
                    মাত্র ৩০ সেকেন্ডে ফর্ম পূরণ করুন
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      আপনার নাম
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="পূর্ণ নাম লিখুন"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="mt-2 text-lg py-3 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 font-medium"
                    >
                      মোবাইল নাম্বার
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+৮৮০ ১৭xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      className="mt-2 text-lg py-3 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium"
                    >
                      ইমেইল (ঐচ্ছিক)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="mt-2 text-lg py-3 border-2 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="country"
                      className="text-gray-700 font-medium"
                    >
                      যেতে চান কোন দেশে?
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          country: value,
                        })
                      }
                    >
                      <SelectTrigger className="mt-2 text-lg py-3 border-2 focus:border-purple-500">
                        <SelectValue placeholder="দেশ নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="australia">অস্ট্রেলিয়া</SelectItem>
                        <SelectItem value="uk">যুক্তরাজ্য</SelectItem>
                        <SelectItem value="malaysia">মালয়েশিয়া</SelectItem>
                        <SelectItem value="newzealand">নিউজিল্যান্ড</SelectItem>
                        <SelectItem value="other">অন্যান্য</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    আবেদন জমা দিন
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                  ✓ সম্পূর্ণ ফ্রি সেবা ✓ কোন লুকানো খরচ নেই
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 animate-float hidden lg:block">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Plane className="text-white" size={32} />
          </div>
        </div>
        <div
          className="absolute bottom-20 left-10 animate-bounce hidden lg:block"
          style={{
            animationDelay: "1s",
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Globe className="text-white" size={24} />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 py-3 via-blue-600 to-green-500 bg-clip-text text-transparent mb-6">
              আমাদের সেবাসমূহ
            </h2>
            <p className="text-xl text-gray-600">
              আপনার সফল ভবিষ্যতের জন্য সম্পূর্ণ সাপোর্ট
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesData.map((service, index) => {
              const IconComp = ICON_MAP[service?.icon] || GraduationCap;
              return (
                <Card
                  key={index}
                  className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
                >
                  <div
                    style={{
                      height: "0.25rem",
                      backgroundColor: service.color,
                    }}
                  ></div>
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div
                        style={{ backgroundColor: `${service.color}33` }}
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      >
                        <IconComp size={48} className="text-indigo-950" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Universities */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 py-4 to-green-500 bg-clip-text text-transparent mb-6">
              আমাদের অংশীদার বিশ্ববিদ্যালয়সমূহ
            </h2>
            <p className="text-xl text-gray-600">
              বিশ্বের শীর্ষ বিশ্ববিদ্যালয়গুলোর সাথে আমাদের দীর্ঘমেয়াদী সম্পর্ক
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {universitiesData.map((uni, index) => {
              const getFlag = (code: string) => {
                const flagMap: Record<string, string> = {
                  au: "🇦🇺",
                  gb: "🇬🇧",
                  my: "🇲🇾",
                  nz: "🇳🇿",
                };
                return flagMap[code?.toLowerCase()] || "🌍";
              };
              return (
                <Card
                  key={index}
                  className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
                >
                  <div
                    style={{
                      height: "0.5rem",
                      backgroundColor: uni?.colorCode,
                    }}
                  ></div>
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div
                        style={{ backgroundColor: uni?.colorCode }}
                        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      >
                        <GraduationCap className="text-white" size={40} />
                      </div>
                      <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                        {getFlag(uni?.countryCode)}
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">
                      {uni?.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{uni?.country}</p>
                    <span
                      style={{ backgroundColor: uni?.colorCode }}
                      className="text-xs text-white px-3 py-1 rounded-full shadow-md"
                    >
                      Official Partner
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Counter Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              আমাদের সাফল্যের পরিসংখ্যান
            </h2>
            <p className="text-xl opacity-90">
              যারা আমাদের সাথে তাদের স্বপ্ন পূরণ করেছেন
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group text-center">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="text-white" size={32} />
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  {counters.totalInterested.toLocaleString()}+
                </div>
                <h3 className="text-xl font-bold mb-2">আগ্রহী শিক্ষার্থী</h3>
                <p className="text-white/80 text-sm">
                  যারা আমাদের সাথে যোগাযোগ করেছেন
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group text-center">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="text-white" size={32} />
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-green-200 to-blue-200 bg-clip-text text-transparent">
                  {counters.filesOpened.toLocaleString()}+
                </div>
                <h3 className="text-xl font-bold mb-2">ফাইল ওপেন</h3>
                <p className="text-white/80 text-sm">
                  যাদের আবেদন প্রক্রিয়া শুরু হয়েছে
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group text-center">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plane className="text-white" size={32} />
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
                  {counters.successfullyDeparted.toLocaleString()}+
                </div>
                <h3 className="text-xl font-bold mb-2">সফল বিদায়</h3>
                <p className="text-white/80 text-sm">
                  যারা সফলভাবে বিদেশে পৌঁছেছেন
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <CheckCircle className="text-green-300" size={20} />
              <span className="text-white/90 font-medium">
                ৯৫% সাফল্যের হার ভিসা অনুমোদনে
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 py-4 via-blue-600 to-green-500 bg-clip-text text-transparent mb-6">
              প্রায়শই জিজ্ঞাসিত প্রশ্ন
            </h2>
            <p className="text-xl text-gray-600">আপনার সাধারণ প্রশ্নের উত্তর</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => {
                const faqColors = ["purple", "blue", "green", "orange", "pink"];
                const color = faqColors[index % faqColors.length];
                return (
                  <AccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className={`bg-white rounded-lg shadow-md border-l-4 border-${color}-500`}
                  >
                    <AccordionTrigger
                      className={`px-6 py-4 text-left hover:bg-${color}-50`}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
