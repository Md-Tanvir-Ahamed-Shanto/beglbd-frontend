import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Users,
  FileText,
  GraduationCap,
  Globe,
  Shield,
  Plane,
  Clock,
  Award,
  Target,
  MapPin,
  Heart,
  CreditCard,
  Stethoscope,
  BookOpen,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StudyAbroadProcess = () => {
  const preDepartureServices = [
    {
      icon: <GraduationCap className="text-purple-600" size={32} />,
      title: "বিশ্ববিদ্যালয় ও কোর্স নির্বাচনে সহায়তা",
      description:
        "আপনার পছন্দ ও যোগ্যতা অনুযায়ী সঠিক বিশ্ববিদ্যালয় ও কোর্স নির্বাচন করতে পূর্ণ সহায়তা প্রদান।",
    },
    {
      icon: <FileText className="text-blue-600" size={32} />,
      title: "বিশ্ববিদ্যালয়ে আবেদন জমা দেওয়া",
      description:
        "আপনার পক্ষে বিশ্ববিদ্যালয়ে সম্পূর্ণ আবেদনপত্র প্রস্তুত করে জমা দেওয়ার ব্যবস্থা।",
    },
    {
      icon: <Award className="text-green-600" size={32} />,
      title: "অফার লেটার সংগ্রহ",
      description:
        "বিশ্ববিদ্যালয় থেকে অফার লেটার সংগ্রহ করে আপনার কাছে পৌঁছে দেওয়া।",
    },
    {
      icon: <Globe className="text-indigo-600" size={32} />,
      title: "ভিসা আবেদন প্রক্রিয়া পরিচালনা (Subclass 500)",
      description:
        "সম্পূর্ণ ভিসা আবেদন প্রক্রিয়া শুরু থেকে শেষ পর্যন্ত পরিচালনা করা।",
    },
    {
      icon: <FileText className="text-cyan-600" size={32} />,
      title: "GTE স্টেটমেন্ট প্রস্তুতি",
      description:
        "আপনার প্রদানকৃত তথ্যের ভিত্তিতে পেশাদার GTE স্টেটমেন্ট প্রস্তুত করা।",
    },
    {
      icon: <Shield className="text-red-600" size={32} />,
      title: "OSHC স্বাস্থ্য বীমার ব্যবস্থা",
      description: "ওভারসিজ স্টুডেন্ট হেলথ কভার বীমার সম্পূর্ণ ব্যবস্থাপনা।",
    },
    {
      icon: <Target className="text-orange-600" size={32} />,
      title: "CoE সংগ্রহ",
      description:
        "বিশ্ববিদ্যালয় থেকে কনফার্মেশন অফ এনরোলমেন্ট দ্রুত সংগ্রহ করা।",
    },
    {
      icon: <CheckCircle className="text-teal-600" size={32} />,
      title: "ডকুমেন্ট চেকলিস্ট ও প্রস্তুতির গাইডলাইন",
      description:
        "প্রয়োজনীয় সকল কাগজপত্রের বিস্তারিত তালিকা ও প্রস্তুতির স্পষ্ট নির্দেশনা।",
    },
    {
      icon: <Users className="text-pink-600" size={32} />,
      title: "মেডিকেল ও PCC নির্দেশনা",
      description:
        "স্বাস্থ্য পরীক্ষা ও পুলিশ ক্লিয়ারেন্স সার্টিফিকেটের বিস্তারিত নির্দেশনা।",
    },
    {
      icon: <Globe className="text-violet-600" size={32} />,
      title: "ভিসা ইন্টারভিউ প্রস্তুতিতে সহায়তা",
      description:
        "প্রয়োজনে ভিসা ইন্টারভিউয়ের জন্য সম্পূর্ণ প্রস্তুতি ও মক ইন্টারভিউ।",
    },
    {
      icon: <Plane className="text-emerald-600" size={32} />,
      title: "প্রাক-যাত্রা ব্রিফিং বা মূলিক প্রশিক্ষণ",
      description:
        "বিদেশ যাওয়ার আগে প্রয়োজনীয় সকল তথ্য ও বিশেষ প্রশিক্ষণ প্রদান।",
    },
  ];

  const postArrivalServices = [
    {
      icon: <Plane className="text-blue-600" size={32} />,
      title: "বিমানবন্দর ও আগমন সহায়তা",
      description:
        "বিমানবন্দর থেকে থাকার জায়গায় নিরাপদে পৌঁছানো, স্থানীয় সিম কার্ড সংগ্রহ, পরিবহন ব্যবস্থা ও মুদ্রা বিনিময়ে সম্পূর্ণ সহায়তা।",
    },
    {
      icon: <Home className="text-green-600" size={32} />,
      title: "থাকার ব্যবস্থা সেটআপ",
      description:
        "আপনার থাকার জায়গায় পৌঁছে আসবাবপত্র সাজানো এবং মৌলিক সুবিধাদি প্রস্তুত করতে হাতে-কলমে সহায়তা।",
    },
    {
      icon: <MapPin className="text-purple-600" size={32} />,
      title: "অভিমুখীকরণ ও স্থানীয় গাইডেন্স",
      description:
        "ক্যাম্পাস ও শহর পরিচিতি, লাইব্রেরি, ল্যাব, ক্লাসরুম, পরিবহন রুট সহ স্থানীয় আইন ও জরুরি সেবার সম্পূর্ণ তথ্য প্রদান।",
    },
    {
      icon: <BookOpen className="text-indigo-600" size={32} />,
      title: "একাডেমিক সহায়তা",
      description:
        "কোর্স রেজিস্ট্রেশন, সময়সূচী তৈরি, লাইব্রেরি অ্যাক্সেস সেটআপ এবং অধ্যাপকদের সাথে পরিচয় করিয়ে দেওয়া।",
    },
    {
      icon: <Stethoscope className="text-red-600" size={32} />,
      title: "স্বাস্থ্যসেবা ও বীমা",
      description:
        "স্থানীয় ডাক্তার ও ক্লিনিকে রেজিস্ট্রেশন, স্বাস্থ্য বীমার ক্লেইম প্রক্রিয়া এবং জরুরি চিকিৎসা সেবায় সহায়তা।",
    },
    {
      icon: <CreditCard className="text-cyan-600" size={32} />,
      title: "ব্যাংকিং ও আর্থিক সহায়তা",
      description:
        "স্থানীয় ব্যাংক অ্যাকাউন্ট খোলা, ডেবিট ও ক্রেডিট কার্ড সেটআপ এবং দেশ থেকে অর্থ স্থানান্তরে সহায়তা।",
    },
    {
      icon: <Heart className="text-pink-600" size={32} />,
      title: "সামাজিক ও সাংস্কৃতিক অভিযোজন",
      description:
        "স্থানীয় সংস্কৃতি ও ভাষা বুঝতে সহায়তা এবং কমিউনিটি গ্রুপ, স্টুডেন্ট ক্লাবের সাথে যোগাযোগ স্থাপন।",
    },
    {
      icon: <Users className="text-orange-600" size={32} />,
      title: "নিয়মিত পর্যবেক্ষণ ও পরামর্শ",
      description:
        "একাডেমিক অগ্রগতি পর্যবেক্ষণ, মানসিক সহায়তা প্রদান, দেশের জন্য মনকেমন সামলানো এবং পার্ট-টাইম চাকরিতে গাইডেন্স।",
    },
  ];

  const studentSteps = [
    {
      icon: <FileText className="text-gray-700" size={28} />,
      title: "পাসপোর্টের জন্য আবেদন করুন",
      description: "সবার আগে একটি বৈধ পাসপোর্ট তৈরি করুন",
    },
    {
      icon: <Globe className="text-gray-700" size={28} />,
      title: "IELTS/TOEFL পরীক্ষা দিন",
      description: "ইংরেজি ভাষার দক্ষতা প্রমাণের জন্য পরীক্ষায় অংশগ্রহণ করুন",
    },
    {
      icon: <GraduationCap className="text-gray-700" size={28} />,
      title: "একাডেমিক ডকুমেন্ট প্রস্তুত করুন",
      description: "সার্টিফিকেট ও ট্রান্সক্রিপ্টের স্ক্যান/ফটোকপি তৈরি করুন",
    },
    {
      icon: <Shield className="text-gray-700" size={28} />,
      title: "ব্যাংক স্টেটমেন্ট সংগ্রহ করুন",
      description:
        "আর্থিক সক্ষমতার প্রমাণ হিসেবে ব্যাংক স্টেটমেন্ট প্রস্তুত করুন",
    },
    {
      icon: <Users className="text-gray-700" size={28} />,
      title: "মেডিকেল টেস্ট করান",
      description: "স্বাস্থ্য পরীক্ষা সম্পন্ন করুন",
    },
    {
      icon: <FileText className="text-gray-700" size={28} />,
      title: "পুলিশ ক্লিয়ারেন্স সার্টিফিকেট (PCC) সংগ্রহ করুন",
      description: "চরিত্র সনদপত্র সংগ্রহ করুন",
    },
    {
      icon: <Clock className="text-gray-700" size={28} />,
      title: "টিউশন ফি পরিশোধ করুন",
      description: "এজেন্সির নির্দেশিত সময়সীমার মধ্যে ফি পরিশোধ করুন",
    },
    {
      icon: <Globe className="text-gray-700" size={28} />,
      title: "প্রয়োজনীয় তথ্য প্রদান করুন (GTE এর জন্য)",
      description: "জেনুইন টেম্পোরারি এন্ট্রান্টের জন্য তথ্য প্রদান করুন",
    },
    {
      icon: <FileText className="text-gray-700" size={28} />,
      title: "মূল ব্যক্তিগত ডকুমেন্ট জমা দিন",
      description: "প্রয়োজন অনুযায়ী মূল কাগজপত্র জমা দিন",
    },
  ];

  return (
    <div className="min-h-screen font-bangla bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 bg-clip-text text-transparent mb-4 lg:mb-6 leading-relaxed px-0 py-[15px]">
              বিদেশে পড়াশোনার প্রক্রিয়া
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed px-2">
              ধাপে ধাপে জেনে নিন কীভাবে বিদেশে পড়াশোনার স্বপ্ন বাস্তবায়ন করবেন
            </p>
          </div>
        </div>
      </section>

      {/* Services Section - Mobile Optimized */}
      <section className="py-12 lg:py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-8">
              আমাদের সেবাসমূহ
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl opacity-90 leading-relaxed max-w-4xl mx-auto px-2">
              বাংলাদেশে থাকাকালীন এবং বিদেশে পৌঁছানোর পর আমাদের সম্পূর্ণ সহায়তা
            </p>
          </div>

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10">
            {/* Pre-Departure Services - Mobile First */}
            <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-2xl p-6 lg:p-8 shadow-2xl">
              <div className="text-center mb-6 lg:mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">
                  প্রাক-যাত্রা সেবা
                </h3>
                <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                  বাংলাদেশে থাকাকালীন আমাদের সহায়তা
                </p>
              </div>
              <div className="space-y-4 lg:space-y-6 max-h-none lg:max-h-[500px] lg:overflow-y-auto lg:pr-2">
                {preDepartureServices.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start space-x-3 lg:space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center bg-white/25 backdrop-blur-sm">
                          {service.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold mb-2 lg:mb-3 text-base lg:text-lg leading-relaxed text-white pr-2">
                          {service.title}
                        </h4>
                        <p className="text-white/90 leading-relaxed text-sm lg:text-base">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post-Arrival Services - Mobile First */}
            <div className="bg-white/15 backdrop-blur-lg border border-white/30 rounded-2xl p-6 lg:p-8 shadow-2xl">
              <div className="text-center mb-6 lg:mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">
                  সফলভাবে পৌঁছানোর পর
                </h3>
                <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                  বিদেশে পৌঁছানোর পর আমাদের সেবা
                </p>
              </div>
              <div className="space-y-4 lg:space-y-6 max-h-none lg:max-h-[500px] lg:overflow-y-auto lg:pr-2">
                {postArrivalServices.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start space-x-3 lg:space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center bg-white/25 backdrop-blur-sm">
                          {service.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold mb-2 lg:mb-3 text-base lg:text-lg leading-relaxed text-white pr-2">
                          {service.title}
                        </h4>
                        <p className="text-white/90 leading-relaxed text-sm lg:text-base">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Steps Section - Mobile Optimized */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 lg:mb-6">
              আপনার করণীয়
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 px-2">
              এজেন্সির নির্দেশনা অনুযায়ী আপনাকে যা করতে হবে
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3 lg:space-y-4">
            {studentSteps.map((step, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 lg:p-6 border-l-4 border-gray-400 hover:border-gray-600 hover:bg-gray-100 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base lg:text-lg font-bold text-gray-800 mb-1 lg:mb-2 leading-relaxed pr-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-green-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6 leading-relaxed">
            আজই শুরু করুন আপনার যাত্রা
          </h2>
          <p className="text-lg sm:text-xl mb-6 lg:mb-8 opacity-90 leading-relaxed px-2">
            বিদেশে পড়াশোনার স্বপ্ন বাস্তবায়নে আমরা আপনার পাশে আছি
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
            <Link to="/contact">
              <Button className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105">
                ফ্রি কনসাল্টেশন নিন
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-white hover:bg-white text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-purple-600"
              >
                আরও জানুন
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudyAbroadProcess;
