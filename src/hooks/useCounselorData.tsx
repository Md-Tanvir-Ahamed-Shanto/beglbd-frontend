import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Counselor interface
interface Counselor {
  id: number;
  phone:string;
  name: string;
  email: string;
  username: string;
  assignedLeads: number;
  activeLeads: number;
  completedLeads: number;
  isActive: boolean;
}

// Fetch counselor data from API
const fetchCounselorData = async (): Promise<Counselor[]> => {
  const response = await axios.get<Counselor[]>(
    `${import.meta.env.VITE_BASE_URL}/all_counselor_data`
  );
  return response.data;
};

// Custom hook to use in components
const useCounselorData = () => {
  return useQuery({
    queryKey: ["CounselorData"],
    queryFn: fetchCounselorData,
  });
};

export default useCounselorData;
