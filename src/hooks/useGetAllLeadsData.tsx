import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the shape of the certificate data
interface Lead {
  id:number;
  name: string;
  phone: string;
  counselor: string;
  counselorName: string;
  counselorId: string;
  notes: string;
  lastContact: string;
  dateSubmitted:string;
  status:string;
  country:string;
  email:string;

  
  // Add more fields based on your API response
}

const fetchLeadData = async (): Promise<Lead[]> => {
  const response = await axios.get<Lead[]>(`${import.meta.env.VITE_BASE_URL}/get_all_lead_data`);
  return response.data;
};

// Custom hook
const useGetAllLeadsData = () => {
  return useQuery({
    queryKey: ["LeadData"],
    queryFn: fetchLeadData,
  });
};

export default useGetAllLeadsData;
