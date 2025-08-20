import React, { useEffect, useMemo, useState } from 'react';
import { Save, Edit, Plus, Trash2, Globe, Users, School, HelpCircle, Phone, TrendingUp, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceModal from '@/components/admin/ServiceModal';
import UniversityModal from '@/components/admin/UniversityModal';
import FAQModal from '@/components/admin/FAQModal';
import useHeroData from '@/hooks/useHeroData';
import axios from 'axios';
import Loading from '@/components/Loading';

type ServiceDoc = {
  _id?: string;       // MongoDB ObjectId as string (from backend)
  id?: number;        // local/client id (from modal)
  title: string;
  subtitle: string;
  icon: string;       // 'School' | 'Globe' | 'Users' | 'HelpCircle' | 'BookOpen' | 'Award'
  color: string;      // hex
  description: string;
};

type UniversityDoc = {
  _id?: string;       // MongoDB ObjectId as string (from backend)
  id?: number;        // local/client id (from modal)
  name: string;
  country: string;
  countryCode: string;
  colorCode: string;
};

type FAQDoc = {
  _id?: string;       // MongoDB ObjectId as string (from backend)
  id?: number;        // local/client id (from modal)
  question: string;
  answer: string;
};

type ContactDoc = {
  _id?: string;       // MongoDB ObjectId as string (from backend)
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address: string;
  officeHours: string;
  whatsapp: string;
};

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  School,
  Globe,
  Users,
  HelpCircle,
  BookOpen,
  Award
};

const WebsiteManagement = () => {
  const [activeSection, setActiveSection] = useState('hero');

  // ===== Hero Section =====
  const { data: herosectionData, refetch, isLoading } = useHeroData();
  const [heroUpdateLoading, setHeroUpdateLoading] = useState(false);
  const [heroData, setHeroData] = useState({
    title: "",
    subtitle: "",
    description: "",
    primaryButton: "",
    secondaryButton: ""
  });

  useEffect(() => {
    if (herosectionData && herosectionData[0]) {
      setHeroData(herosectionData[0]);
    }
  }, [herosectionData]);

  const handleHeroUpdate = () => {
    setHeroUpdateLoading(true);
    axios.post(`${import.meta.env.VITE_BASE_URL}/update_hero_section_data`, heroData)
      .then(() => {
        setHeroUpdateLoading(false);
        refetch?.();
        alert("Hero section updated!");
      })
      .catch(err => {
        console.log("hero data update error:", err);
        setHeroUpdateLoading(false);
        alert("Hero update failed!");
      });
  };

  // ===== Statistics =====
  const [statisticsData, setStatisticsData] = useState({
    interestedStudents: 2500,
    filesOpened: 1800,
    successfullyDeparted: 1200
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/stats_collection`)
      .then(res => {
        const arr = res?.data;
        if (Array.isArray(arr) && arr.length > 0) {
          const d = arr[0];
          setStatisticsData({
            interestedStudents: parseInt(d?.interestedStudents || 0),
            filesOpened: parseInt(d?.filesOpened || 0),
            successfullyDeparted: parseInt(d?.successfullyDeparted || 0),
          });
        }
      })
      .catch(err => console.log("stats fetch error:", err));
  }, []);

  const [loadingUpdating, setLoadingUpdating] = useState(false);
  const handleUpadeStats = () => {
    setLoadingUpdating(true);
    axios.post(`${import.meta.env.VITE_BASE_URL}/add_stats`, statisticsData)
      .then(() => {
        setLoadingUpdating(false);
        alert("Statistics saved!");
      })
      .catch(er => {
        console.log("update stats error:", er);
        setLoadingUpdating(false);
        alert("Statistics save failed!");
      });
  };

  // ===== Services (CRUD wired to backend) =====
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesData, setServicesData] = useState<ServiceDoc[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDoc | null>(null);

  // Fetch services on mount
  const fetchServices = useMemo(() => async () => {
    setServicesLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/our_services`);
      const list: ServiceDoc[] = Array.isArray(res.data) ? res.data : [];
      setServicesData(list);
    } catch (e) {
      console.log("GET /our_services error:", e);
      alert("Failed to load services");
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  const handleEditService = (service: ServiceDoc) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  // Save -> if editingService exists => PATCH, else POST
  const handleSaveService = async (serviceFromModal: ServiceDoc) => {
    try {
      if (editingService && (editingService._id || serviceFromModal._id)) {
        const id = (editingService._id || serviceFromModal._id) as string;
        await axios.patch(`${import.meta.env.VITE_BASE_URL}/update_service_data/${id}`, {
          title: serviceFromModal.title,
          subtitle: serviceFromModal.subtitle,
          icon: serviceFromModal.icon,
          color: serviceFromModal.color,
          description: serviceFromModal.description
        });
        await fetchServices();
        alert("Service updated!");
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/post_new_service`, {
          title: serviceFromModal.title,
          subtitle: serviceFromModal.subtitle,
          icon: serviceFromModal.icon,
          color: serviceFromModal.color,
          description: serviceFromModal.description
        });
        await fetchServices();
        alert("Service created!");
      }
    } catch (e) {
      console.log("save service error:", e);
      alert("Service save failed!");
    }
  };

  const handleDeleteService = async (docIdOrLocalId: string | number) => {
    const found = servicesData.find(s => (s._id ?? s.id) === docIdOrLocalId);
    const idToDelete = found?._id; // only allow deleting persisted items
    if (!idToDelete) {
      setServicesData(servicesData.filter(s => (s._id ?? s.id) !== docIdOrLocalId));
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/delete_service_data/${idToDelete}`);
      await fetchServices();
      alert("Service deleted!");
    } catch (e) {
      console.log("delete service error:", e);
      alert("Service delete failed!");
    }
  };

  // ===== Universities (CRUD wired to backend) =====
  const [universitiesLoading, setUniversitiesLoading] = useState(false);
  const [universitiesData, setUniversitiesData] = useState<UniversityDoc[]>([]);
  const [universityModalOpen, setUniversityModalOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<UniversityDoc | null>(null);

  // Fetch universities on mount
  const fetchUniversities = useMemo(() => async () => {
    setUniversitiesLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/all_university_partners`);
      const list: UniversityDoc[] = Array.isArray(res.data) ? res.data : [];
      setUniversitiesData(list);
    } catch (e) {
      console.log("GET /all_university_partners error:", e);
      alert("Failed to load partner universities");
    } finally {
      setUniversitiesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleAddUniversity = () => {
    setEditingUniversity(null);
    setUniversityModalOpen(true);
  };

  const handleEditUniversity = (university: UniversityDoc) => {
    setEditingUniversity(university);
    setUniversityModalOpen(true);
  };

  // Save -> if editingUniversity exists => PATCH /update_university/:id, else POST /add_new_university
  const handleSaveUniversity = async (fromModal: UniversityDoc) => {
    try {
      if (editingUniversity && (editingUniversity._id || fromModal._id)) {
        const id = (editingUniversity._id || fromModal._id) as string;
        await axios.patch(`${import.meta.env.VITE_BASE_URL}/update_university/${id}`, {
          name: fromModal.name,
          country: fromModal.country,
          countryCode: fromModal.countryCode,
          colorCode: fromModal.colorCode
        });
        await fetchUniversities();
        alert("University updated!");
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/add_new_university`, {
          name: fromModal.name,
          country: fromModal.country,
          countryCode: fromModal.countryCode,
          colorCode: fromModal.colorCode
        });
        await fetchUniversities();
        alert("University added!");
      }
    } catch (e) {
      console.log("save university error:", e);
      alert("University save failed!");
    }
  };

  const handleDeleteUniversity = async (docIdOrLocalId: string | number) => {
    const found = universitiesData.find(u => (u._id ?? u.id) === docIdOrLocalId);
    const idToDelete = found?._id;
    if (!idToDelete) {
      // local-only fallback remove
      setUniversitiesData(universitiesData.filter(u => (u._id ?? u.id) !== docIdOrLocalId));
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/delete_university_data/${idToDelete}`);
      await fetchUniversities();
      alert("University deleted!");
    } catch (e) {
      console.log("delete university error:", e);
      alert("University delete failed!");
    }
  };

  // ===== FAQ (CRUD wired to backend) =====
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQDoc | null>(null);
  const [faqData, setFaqData] = useState<FAQDoc[]>([]);

  // Fetch FAQs on mount
  const fetchFAQs = useMemo(() => async () => {
    setFaqLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/all_faqs`);
      const list: FAQDoc[] = Array.isArray(res.data) ? res.data : [];
      setFaqData(list);
    } catch (e) {
      console.log("GET /all_faqs error:", e);
      alert("Failed to load FAQs");
    } finally {
      setFaqLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  const handleAddFaq = () => {
    setEditingFaq(null);
    setFaqModalOpen(true);
  };

  const handleEditFaq = (faq: FAQDoc) => {
    setEditingFaq(faq);
    setFaqModalOpen(true);
  };

  // Save -> if editingFaq exists => PATCH /update_faq/:id, else POST /add_new_faq
  const handleSaveFaq = async (faqFromModal: FAQDoc) => {
    try {
      if (editingFaq && (editingFaq._id || faqFromModal._id)) {
        const id = (editingFaq._id || faqFromModal._id) as string;
        await axios.patch(`${import.meta.env.VITE_BASE_URL}/update_faq/${id}`, {
          question: faqFromModal.question,
          answer: faqFromModal.answer
        });
        await fetchFAQs();
        alert("FAQ updated!");
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/add_new_faq`, {
          question: faqFromModal.question,
          answer: faqFromModal.answer
        });
        await fetchFAQs();
        alert("FAQ created!");
      }
    } catch (e) {
      console.log("save FAQ error:", e);
      alert("FAQ save failed!");
    }
  };

  const handleDeleteFaq = async (docIdOrLocalId: string | number) => {
    const found = faqData.find(f => (f._id ?? f.id) === docIdOrLocalId);
    const idToDelete = found?._id;
    if (!idToDelete) {
      setFaqData(faqData.filter(f => (f._id ?? f.id) !== docIdOrLocalId));
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/delete_faq_data/${idToDelete}`);
      await fetchFAQs();
      alert("FAQ deleted!");
    } catch (e) {
      console.log("delete FAQ error:", e);
      alert("FAQ delete failed!");
    }
  };

  // ===== Contact (CRUD wired to backend) =====
  const [contactLoading, setContactLoading] = useState(false);
  const [contactData, setContactData] = useState<ContactDoc>({
    phone1: '+880 1712-345678',
    phone2: '+880 1812-456789',
    email1: 'info@beglbd.com',
    email2: 'support@beglbd.com',
    address: '123 Education Street, Dhanmondi, Dhaka 1205, Bangladesh',
    officeHours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
    whatsapp: '+8801712345678'
  });

  // Fetch contact information on mount
  const fetchContactInfo = useMemo(() => async () => {
    setContactLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/contact_informations`);
      const data: ContactDoc = res.data; // Single object expected
      setContactData(data);
    } catch (e) {
      console.log("GET /contact_informations error:", e);
      alert("Failed to load contact information");
    } finally {
      setContactLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

 const handleContactInfo = async () => {
  setContactLoading(true);
  try {
    // Always POST, no check for existing _id
    await axios.post(`${import.meta.env.VITE_BASE_URL}/add_contact_informations`, contactData);
    await fetchContactInfo();
    alert("Contact information saved!");
  } catch (e) {
    console.log("save contact info error:", e);
    alert("Contact information save failed!");
  } finally {
    setContactLoading(false);
  }
};


  // ===== Sections renderers =====
  if (isLoading) {
    return <Loading />;
  }

  const renderHeroSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Hero Section</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Main Title</label>
          <input
            type="text"
            value={heroData?.title}
            onChange={e => setHeroData({ ...heroData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <input
            type="text"
            value={heroData?.subtitle}
            onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={heroData?.description}
            onChange={e => setHeroData({ ...heroData, description: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Button Text</label>
            <input
              type="text"
              value={heroData?.primaryButton}
              onChange={e => setHeroData({ ...heroData, primaryButton: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text sm font-medium mb-2">Secondary Button Text</label>
            <input
              type="text"
              value={heroData?.secondaryButton}
              onChange={e => setHeroData({ ...heroData, secondaryButton: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleHeroUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          {heroUpdateLoading ? "Updating..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  const renderStatisticsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Statistics Counter</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Total Interested Students</label>
          <input
            type="number"
            value={statisticsData?.interestedStudents}
            onChange={(e) => setStatisticsData({ ...statisticsData, interestedStudents: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">Number of students who have shown interest</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Files Opened</label>
          <input
            type="number"
            value={statisticsData?.filesOpened}
            onChange={(e) => setStatisticsData({ ...statisticsData, filesOpened: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">Number of student files that have been opened</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Successfully Departed</label>
          <input
            type="number"
            value={statisticsData?.successfullyDeparted}
            onChange={(e) => setStatisticsData({ ...statisticsData, successfullyDeparted: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">Number of students who have successfully flown</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{statisticsData?.interestedStudents.toLocaleString()}+</div>
            <div className="text-sm text-gray-600">Interested Students</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{statisticsData?.filesOpened.toLocaleString()}+</div>
            <div className="text-sm text-gray-600">Files Opened</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{statisticsData?.successfullyDeparted.toLocaleString()}+</div>
            <div className="text-sm text-gray-600">Successfully Departed</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleUpadeStats} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          {loadingUpdating ? "Loading..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  const renderServicesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Our Services</h3>
        <Button variant="outline" size="sm" onClick={handleAddService}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {servicesLoading ? (
        <div className="text-sm text-gray-500">Loading services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servicesData.map(service => {
            const IconComp = ICON_MAP[service.icon] ?? School;
            const key = (service._id ?? service.id) as string | number;
            return (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: (service.color || '#3B82F6') + '20' }}
                    >
                      <IconComp className="w-5 h-5" style={{ color: service.color || '#3B82F6' }} />
                    </div>
                    <div>
                      <h4 className="font-medium">{service.title}</h4>
                      <p className="text-sm text-gray-500">{service.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDeleteService(key)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Color:</span>
                  <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: service.color }} />
                  <span className="text-xs font-mono">{service.color}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderUniversitiesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Partner Universities</h3>
        <Button variant="outline" size="sm" onClick={handleAddUniversity}>
          <Plus className="w-4 h-4 mr-2" />
          Add University
        </Button>
      </div>

      {universitiesLoading ? (
        <div className="text-sm text-gray-500">Loading universities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {universitiesData.map(university => {
            const key = (university._id ?? university.id) as string | number;
            return (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: university.colorCode }}
                    >
                      {university.countryCode}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{university.name}</h4>
                      <p className="text-xs text-gray-500">{university.country}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditUniversity(university)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDeleteUniversity(key)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Color:</span>
                  <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: university.colorCode }}></div>
                  <span className="text-xs font-mono">{university.colorCode}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderFAQSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">FAQ Section</h3>
        <Button variant="outline" size="sm" onClick={handleAddFaq}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {faqLoading ? (
        <div className="text-sm text-gray-500">Loading FAQs...</div>
      ) : (
        <div className="space-y-4">
          {faqData.map(faq => {
            const key = (faq._id ?? faq.id) as string | number;
            return (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEditFaq(faq)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteFaq(key)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contact Information</h3>
      </div>

      {contactLoading ? (
        <div className="text-sm text-gray-500">Loading contact information...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Phone</label>
              <input
                type="text"
                value={contactData.phone1}
                onChange={e => setContactData({ ...contactData, phone1: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Phone</label>
              <input
                type="text"
                value={contactData.phone2}
                onChange={e => setContactData({ ...contactData, phone2: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Email</label>
              <input
                type="email"
                value={contactData.email1}
                onChange={e => setContactData({ ...contactData, email1: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <input
                type="email"
                value={contactData.email2}
                onChange={e => setContactData({ ...contactData, email2: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Office Address</label>
              <textarea
                value={contactData.address}
                onChange={e => setContactData({ ...contactData, address: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Office Hours</label>
              <input
                type="text"
                value={contactData.officeHours}
                onChange={e => setContactData({ ...contactData, officeHours: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={contactData.whatsapp}
                  onChange={e => setContactData({ ...contactData, whatsapp: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Clicking will open WhatsApp chat</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleContactInfo}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={contactLoading}
        >
          <Save className="w-4 h-4 mr-2" />
          {contactLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: Globe },
    { id: 'statistics', name: 'Statistics Counter', icon: TrendingUp },
    { id: 'services', name: 'Our Services', icon: Users },
    { id: 'universities', name: 'Partner Universities', icon: School },
    { id: 'faq', name: 'FAQ Section', icon: HelpCircle },
    { id: 'contact', name: 'Contact Information', icon: Phone }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroSection();
      case 'statistics':
        return renderStatisticsSection();
      case 'services':
        return renderServicesSection();
      case 'universities':
        return renderUniversitiesSection();
      case 'faq':
        return renderFAQSection();
      case 'contact':
        return renderContactSection();
      default:
        return renderHeroSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Website Management</h1>
          <p className="text-gray-600">Manage your website content and sections</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold mb-4">Website Sections</h3>
              <nav className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        service={editingService ? {
          id: Date.now(), // dummy – not used for PATCH
          title: editingService.title,
          subtitle: editingService.subtitle,
          icon: editingService.icon,
          color: editingService.color,
          description: editingService.description
        } : null}
        onSave={handleSaveService}
      />

      <UniversityModal
        isOpen={universityModalOpen}
        onClose={() => setUniversityModalOpen(false)}
        university={editingUniversity ? {
          id: Date.now(), // dummy – not used for PATCH
          name: editingUniversity.name,
          country: editingUniversity.country,
          countryCode: editingUniversity.countryCode,
          colorCode: editingUniversity.colorCode
        } as any : null}
        onSave={handleSaveUniversity}
      />

      <FAQModal
        isOpen={faqModalOpen}
        onClose={() => setFaqModalOpen(false)}
        faq={editingFaq ? {
          id: Date.now(), // dummy – not used for PATCH
          question: editingFaq.question,
          answer: editingFaq.answer
        } : null}
        onSave={handleSaveFaq}
      />
    </div>
  );
};

export default WebsiteManagement;