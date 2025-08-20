import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  FileText,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import LeadTrendsChart from "@/components/admin/LeadTrendsChart";
import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";

// Define the shape of the certificate data
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

const Dashboard: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [connectedLeads, setConnectedLeads] = useState<Lead[]>([]);
  const [notConnectedLeads, setNotConnectedLeads] = useState<Lead[]>([]);
  const [fileOpenStatus, setFileOpenStatus] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const navigate = useNavigate();

  const { data, isLoading } = useGetAllLeadsData();

  // Filter leads by status whenever data changes
  useEffect(() => {
    if (!data) return;

    setConnectedLeads(data.filter((item) => item.status === "Contacted"));
    setNotConnectedLeads(
      data.filter((item) => item.status === "Not Interested")
    );
    setFileOpenStatus(data.filter((item) => item.status === "File Open"));
    setFilteredLeads(data); // initially, all leads
  }, [data]);

  // Function to filter leads by selected date range
  const applyDateFilter = () => {
    if (!data) return;

    const filtered = data.filter((lead) => {
      const leadDate = new Date(lead.dateSubmitted);
      if (dateFrom && leadDate < dateFrom) return false;
      if (dateTo && leadDate > dateTo) return false;
      return true;
    });

    setFilteredLeads(filtered);

    // Update stats dynamically
    setConnectedLeads(filtered.filter((item) => item.status === "Contacted"));
    setNotConnectedLeads(
      filtered.filter((item) => item.status === "Not Interested")
    );
    setFileOpenStatus(filtered.filter((item) => item.status === "File Open"));
  };

  if (isLoading) return <Loading />;

  const stats = [
    {
      title: "Total Leads Submitted",
      value: filteredLeads?.length,
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Leads Contacted",
      value: connectedLeads?.length,
      change: "+8%",
      changeType: "increase",
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Leads Not Contacted",
      value: notConnectedLeads?.length,
      change: "-5%",
      changeType: "decrease",
      icon: UserX,
      color: "bg-yellow-500",
    },
    {
      title: "File Open Status",
      value: fileOpenStatus?.length,
      change: "+15%",
      changeType: "increase",
      icon: FileText,
      color: "bg-purple-500",
    },
  ];

  //  check admin fro security-->
  const admin = localStorage.getItem("adminAuth");
  if (!admin) {
    navigate("/");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of your lead management system
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Date Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Lead Overview Filter
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Custom Date Range:</span>
            </div>
            <div className="flex flex-col space-y-2 w-full sm:flex-row sm:space-y-0 sm:space-x-2 sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Button
                className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
                onClick={applyDateFilter}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp
                    className={`w-4 h-4 mr-1 ${
                      stat.changeType === "increase"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change} from last month
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Leads Trend
          </h3>
          <LeadTrendsChart />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Leads
          </h3>
          <div className="space-y-4">
            {filteredLeads.slice(0, 5).map((lead, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {lead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      lead.status === "File Open"
                        ? "bg-green-100 text-green-800"
                        : lead.status === "Connected"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {lead.dateSubmitted}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
