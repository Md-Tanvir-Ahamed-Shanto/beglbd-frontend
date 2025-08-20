import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import Loading from '@/components/Loading';

type ContactDoc = {
  _id?: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address: string;
  officeHours: string;
  whatsapp: string;
};

const Contact = () => {
  const [contactData, setContactData] = useState<ContactDoc>({
    phone1: '',
    phone2: '',
    email1: '',
    email2: '',
    address: '',
    officeHours: '',
    whatsapp: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contact information from backend
  useEffect(() => {
    const fetchContactInfo = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/contact_informations`);
        const data: ContactDoc = res.data; // Single object expected
        setContactData(data);
      } catch (e) {
        console.log("GET /contact_informations error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Handle loading state
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen font-bangla bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Hero Section */}
      <section className="py-12 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              যোগাযোগ করুন
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
              আপনার যেকোনো প্রশ্ন বা পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা সর্বদা আপনার সেবায় নিয়োজিত।
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-brand-blue" size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">ফোন নাম্বার</h3>
                      <p className="text-gray-600 text-base lg:text-lg break-all">{contactData.phone1 || '+৮৮০ ১৭xxxxxxxx'}</p>
                      <p className="text-gray-600 text-base lg:text-lg break-all">{contactData.phone2 || '+৮৮০ ১৮xxxxxxxx'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-brand-green" size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">ইমেইল</h3>
                      <p className="text-gray-600 text-base lg:text-lg break-all">{contactData.email1 || 'info@mheducation.com'}</p>
                      <p className="text-gray-600 text-base lg:text-lg break-all">{contactData.email2 || 'support@mheducation.com'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-brand-orange" size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">ঠিকানা</h3>
                      <p className="text-gray-600 text-base lg:text-lg">{contactData.address || '১২৩ গুলশান এভিনিউ, ঢাকা - ১২১২, বাংলাদেশ'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-brand-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="text-brand-blue" size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">অফিস টাইম</h3>
                      <p className="text-gray-600 text-base lg:text-lg">{contactData.officeHours || 'রবি - বৃহস্পতি: ৯:০০ - ৬:০০, শুক্রবার: ৯:০০ - ৫:০০'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* WhatsApp CTA */}
            <div className="flex justify-center px-4">
              <Card className="border-0 shadow-2xl bg-gradient-to-r from-brand-green to-brand-blue text-white max-w-md w-full">
                <CardContent className="p-6 lg:p-8 text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">হোয়াটসঅ্যাপে যোগাযোগ</h3>
                  <p className="opacity-90 mb-6 text-base lg:text-lg leading-relaxed">তাৎক্ষণিক সাহায্যের জন্য আমাদের সাথে চ্যাট করুন</p>
                  <Button 
                    variant="outline" 
                    className="bg-white text-brand-blue border-white hover:bg-gray-100 text-base lg:text-lg px-6 py-2 lg:px-8 lg:py-3"
                    onClick={() => window.open(`https://wa.me/${contactData.whatsapp || '+8801712345678'}`, '_blank')}
                  >
                    এখনই চ্যাট করুন
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">আমাদের অবস্থান</h2>
            <p className="text-gray-600 text-base lg:text-lg">আমাদের অফিসে সরাসরি ভিজিট করতে পারেন</p>
          </div>
          <div className="h-64 lg:h-96 rounded-lg shadow-lg mx-auto max-w-4xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.1173550223464!2d90.41114597538945!3d23.77931567864695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70d984e1a01%3A0x4d4970d34974346b!2sGulshan%20Avenue%2C%20Dhaka%201212%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1697621234567!5m2!1sen!2sbd&key=YOUR_GOOGLE_MAPS_API_KEY"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;