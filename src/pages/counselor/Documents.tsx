import React, { useEffect, useState } from "react";
import {
  Eye,
  Search,
  Filter,
  Calendar,
  FileText,
  User,
  CheckCircle,
  Clock,
} from "lucide-react";
import CounselorDocumentViewModal from "@/components/counselor/CounselorDocumentViewModal";
import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";
import Loading from "@/components/Loading";

interface Document {
  id: number;
  name: string;
  phone: string;
  email: string;
  documents: {
    id: string;
    name: string;
    size: number;
    type: string;
  }[];
  dateSubmitted: string;
  status: string;
  totalDocuments: number;
  completedDocuments: number;
}

const CounselorDocuments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // data
  const [mainData, setMainData] = useState<Document[]>([]);
  const { data, isLoading } = useGetAllLeadsData();
  useEffect(() => {
    if (data) {
      const filterData = data
        .filter((item: any) => item?.documents && item.documents.length > 0)
        .map((item: any) => ({
          ...item,
          totalDocuments: 4,
          completedDocuments: item.documents.length,
        }));
      setMainData(filterData);
      console.log(data);
    }
  }, [data]);

  const filteredDocuments = mainData.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;

    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      const docDate = new Date(doc.dateSubmitted);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      matchesDate = docDate >= fromDate && docDate <= toDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const handleSearch = () => {
    // Search functionality is already handled by the filter
    console.log("Searching documents...");
  };
  // check loading--->
  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Documents
        </h1>
        <p className="text-gray-600">
          Manage student documents and submissions
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2 w-full lg:w-auto">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent w-full lg:w-auto"
              >
                <option value="all">All Status</option>
                <option value="Complete">Complete</option>
                <option value="File Open">File Open</option>
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments?.map((doc) => (
                <tr
                  key={doc?.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {doc?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: #{doc?.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {doc?.documents?.length} documents
                    </div>
                    <div className="text-xs text-gray-500">
                      {doc?.documents
                        ?.slice(0, 2)
                        .map((d) => d.type)
                        .join(", ")}
                      {doc?.documents?.length > 2 && "..."}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {doc?.completedDocuments}/{doc?.totalDocuments}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${
                            (doc?.completedDocuments / doc?.totalDocuments) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doc?.dateSubmitted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        doc?.status === "Complete"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
                      title="View Documents"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500">ID: #{doc.id}</p>
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  doc.status === "Complete"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {doc.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-3 h-3 mr-2" />
                {doc.documents.length} documents uploaded
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-3 h-3 mr-2" />
                {doc.dateSubmitted}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Progress: {doc.completedDocuments}/{doc.totalDocuments}
                </span>
                <div className="flex items-center">
                  {doc.status === "Complete" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${
                      (doc.completedDocuments / doc.totalDocuments) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => handleViewDocument(doc)}
                className="text-primary hover:text-primary/80 p-2 rounded transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <CounselorDocumentViewModal
        document={selectedDocument}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
};

export default CounselorDocuments;
