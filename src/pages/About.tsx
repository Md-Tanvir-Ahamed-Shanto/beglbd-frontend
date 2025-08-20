import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const About = () => {
  return <div className="min-h-screen font-bangla bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-relaxed">
              আমাদের সম্পর্কে
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              ১০ বছরের অভিজ্ঞতা নিয়ে আমরা হাজারো শিক্ষার্থীর স্বপ্ন পূরণে সাহায্য করেছি। 
              আপনার বিদেশে উচ্চশিক্ষার স্বপ্নও আমরা বাস্তবায়ন করব।
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-relaxed">আমাদের লক্ষ্য</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">BEGL BD এর মূল লক্ষ্য হলো বাংলাদেশী শিক্ষার্থীদের বিদেশে উচ্চশিক্ষার সুযোগ সৃষ্টি করা। আমরা বিশ্বাস করি প্রতিটি মেধাবী শিক্ষার্থীর বিশ্বমানের শিক্ষা গ্রহণের অধিকার রয়েছে।</p>
              <ul className="space-y-3">
                {["১০০% সৎ ও স্বচ্ছ সেবা প্রদান", "শিক্ষার্থীদের স্বপ্ন বাস্তবায়নে সহায়তা", "বিশ্বমানের শিক্ষা প্রতিষ্ঠানে ভর্তির সুযোগ", "সম্পূর্ণ প্রক্রিয়ায় নির্ভরযোগ্য গাইডেন্স"].map((item, index) => <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-brand-green" size={20} />
                    <span className="text-gray-700 leading-relaxed">{item}</span>
                  </li>)}
              </ul>
            </div>
            <div className="bg-gradient-to-r from-brand-blue to-brand-green p-8 rounded-2xl text-white">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">৫০০০+</div>
                  <div className="text-white/90 leading-relaxed">সফল শিক্ষার্থী</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">১৫+</div>
                  <div className="text-white/90 leading-relaxed">দেশে পাঠানো</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">১০+</div>
                  <div className="text-white/90 leading-relaxed">বছরের অভিজ্ঞতা</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">৯৮%</div>
                  <div className="text-white/90 leading-relaxed">ভিসা সাকসেস রেট</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 leading-relaxed">আমাদের মূল্যবোধ</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            title: "সততা",
            description: "আমরা সর্বদা সৎ ও স্বচ্ছ সেবা প্রদান করি",
            icon: <CheckCircle className="text-brand-green" size={48} />
          }, {
            title: "গুণগত সেবা",
            description: "প্রতিটি শিক্ষার্থীকে সর্বোচ্চ মানের সেবা দিই",
            icon: <Award className="text-brand-blue" size={48} />
          }, {
            title: "নির্ভরযোগ্যতা",
            description: "আমাদের উপর আস্থা রাখতে পারেন",
            icon: <Globe className="text-brand-orange" size={48} />
          }, {
            title: "আন্তর্জাতিক মান",
            description: "বিশ্বমানের শিক্ষা সেবা নিশ্চিত করি",
            icon: <Globe className="text-brand-green" size={48} />
          }].map((value, index) => <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 leading-relaxed">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-blue to-brand-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 leading-relaxed">আপনিও আমাদের সাথে যুক্ত হন</h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            আজই যোগাযোগ করুন এবং আপনার বিদেশে পড়াশোনার যাত্রা শুরু করুন
          </p>
          <Link to="/">
            <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100 text-lg px-8 py-4 rounded-full">
              ফ্রি কনসাল্টেশন নিন
            </Button>
          </Link>
        </div>
      </section>
    </div>;
};
export default About;