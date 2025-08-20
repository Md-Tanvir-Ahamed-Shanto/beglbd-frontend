import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  Eye,
  Edit,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plane,
} from "lucide-react";
import CounselorLeadViewModal from "@/components/counselor/CounselorLeadViewModal";
import CounselorLeadEditModal from "@/components/counselor/CounselorLeadEditModal";
import useCounselorData from "@/hooks/useCounselorData";
import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";
import Loading from "@/components/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Lead {
  name: string;
  phone: string;
  counselor: string;
  counselorName: string;
  counselorId: string;
  notes: string;
  lastContact: string;
  dateSubmitted: string;
  status: string;
  country: string;
  email: string;

  // Add more fields based on your API response
}
const Dashboard = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // load all counselors-->
  const [myLeads, setMyLeads] = useState([]);
  const [myData, setMyData] = useState({});

  const { data: Counselors, isLoading, refetch } = useCounselorData();
  const {
    data: Leads,
    isLoading: laodingLeads,
    refetch: loadAgain,
  } = useGetAllLeadsData();
  // local storage theke counselor
  const counselorUsernameFormLocalstorage = localStorage.getItem("Counselor");
  // set myData
  useEffect(() => {
    if (!Counselors) return;
    const data1 = Counselors.find(
      (item) => item.username === counselorUsernameFormLocalstorage
    );
    setMyData(data1);
  }, [Counselors, counselorUsernameFormLocalstorage]);

  // set myLeads
  useEffect(() => {
    if (!Leads || !myData?.name) return;
    const data2 = Leads?.filter((item) => item.counselorName === myData?.name);
    setMyLeads(data2);
  }, [Leads, myData]);
  // const recentLeads: Lead[] = [
  //   {
  //     id: 1,
  //     name: 'Ahmed Rahman',
  //     phone: '+880 1712-345678',
  //     email: 'ahmed.rahman@email.com',
  //     country: 'Australia',
  //     status: 'Contacted',
  //     dateSubmitted: '2024-01-15',
  //     lastContact: '2024-01-20',
  //     notes: 'Interested in Computer Science program. Follow up needed.'
  //   },
  //   {
  //     id: 2,
  //     name: 'Fatima Khan',
  //     phone: '+880 1812-456789',
  //     email: 'fatima.khan@email.com',
  //     country: 'Malaysia',
  //     status: 'File Open',
  //     dateSubmitted: '2024-01-14',
  //     lastContact: '2024-01-22',
  //     notes: 'Documents submitted. Awaiting university response.'
  //   },
  //   {
  //     id: 3,
  //     name: 'Mohammad Ali',
  //     phone: '+880 1912-567890',
  //     email: 'mohammad.ali@email.com',
  //     country: 'UK',
  //     status: 'Pending',
  //     dateSubmitted: '2024-01-14',
  //     lastContact: '2024-01-16',
  //     notes: 'Initial inquiry about MBA programs.'
  //   },
  //   {
  //     id: 4,
  //     name: 'Rashida Begum',
  //     phone: '+880 1612-234567',
  //     email: 'rashida.begum@email.com',
  //     country: 'New Zealand',
  //     status: 'Successfully Departed',
  //     dateSubmitted: '2024-01-13',
  //     lastContact: '2024-02-15',
  //     notes: 'Successfully departed for Auckland University. Nursing program started in February 2024.'
  //   }
  // ];

  // active leads calculate-->
  const [activeLeads, setActiveLeads] = useState(0);
  const [docPending, setDocPending] = useState(0);
  const [followUps, setFollowUps] = useState(0);
  useEffect(() => {
    const diding = Leads?.filter(
      (item) => item?.status === "File Open" || item?.status === "Contacted"
    );
    if (diding) {
      setActiveLeads(diding.length);
    }
    const tiding = Leads?.filter((item) => !item?.documents);
    // console.log(tiding, "tiding");
    if (tiding) {
      setDocPending(tiding.length);
    }
    const dingding = Leads?.filter((item) => item?.status === "Pending");
    if (dingding) {
      setFollowUps(dingding.length);
    }
  }, [Leads]);
  const stats = [
    {
      label: "Total Leads",
      value: Leads?.length || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Active Leads",
      value: activeLeads || 0,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: "Documents Pending",
      value: docPending || 0,
      icon: FileText,
      color: "bg-yellow-500",
    },
    {
      label: "Follow-ups Due",
      value: followUps || 0,
      icon: Clock,
      color: "bg-red-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "File Open":
        return "bg-green-100 text-green-800";
      case "Contacted":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Not Interested":
        return "bg-red-100 text-red-800";
      case "Successfully Departed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "Successfully Departed") {
      return <Plane className="w-3 h-3 mr-1" />;
    }
    return null;
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleUpdateLead = (leadId: number, updatedData: Partial<Lead>) => {
    console.log("Updating lead:", leadId, updatedData);

    axios
      .patch(
        `${import.meta.env.VITE_BASE_URL}/update_leads_by_counselor/${leadId}`,
        {
          updatedData,
        }
      )
      .then((res) => {
        console.log("Lead updated:", res.data);
        // Optional: refetch or update state after update
        loadAgain(); // if you want to refresh the leads list
      })
      .catch((err) => console.log("Error updating lead:", err));
  };
  const navigate = useNavigate();
  if (!localStorage.getItem("Counselor")) {
    navigate("/");
  }
  // loading
  if (isLoading && laodingLeads) {
    return <Loading></Loading>;
  }
  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back! Here's your overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} rounded-lg p-2 sm:p-3 flex-shrink-0 ml-2`}
              >
                <stat.icon className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
            Recent Leads
          </h2>
          <a
            href="/counselor/leads"
            className="text-primary hover:text-primary/80 text-xs sm:text-sm font-medium"
          >
            View All
          </a>
        </div>

        {/* Desktop Table */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-3 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {lead.name}
                        </div>
                        <div className="text-xs text-gray-500">#{lead.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 break-all">
                      {lead.phone}
                    </div>
                    <div className="text-xs text-gray-500 break-all">
                      {lead.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{lead.country}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {getStatusIcon(lead.status)}
                      <span className="truncate">{lead.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.dateSubmitted}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewLead(lead)}
                        className="text-primary hover:text-primary/80 p-1 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet Table */}
        <div className="hidden lg:block xl:hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <div className="ml-2 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {lead.name}
                        </div>
                        <div className="text-xs text-gray-500">#{lead.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {getStatusIcon(lead.status)}
                      <span className="truncate">{lead.status}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-900">
                    {lead.dateSubmitted}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewLead(lead)}
                        className="text-primary hover:text-primary/80 p-1 rounded"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3 sm:space-y-4">
          {Leads?.map((lead) => (
            <div
              key={lead.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {lead.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      #{lead.id}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {getStatusIcon(lead.status)}
                  <span className="hidden sm:inline">{lead.status}</span>
                </span>
              </div>

              <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="break-all">{lead.phone}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="break-all">{lead.email}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span>{lead.country}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span>{lead.dateSubmitted}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewLead(lead)}
                  className="flex-1 bg-primary text-white py-2 px-3 rounded-lg text-xs sm:text-sm hover:bg-primary/90"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditLead(lead)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs sm:text-sm hover:bg-gray-200"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <CounselorLeadViewModal
        lead={selectedLead}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <CounselorLeadEditModal
        lead={selectedLead}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateLead}
      />
    </div>
  );
};

export default Dashboard;
