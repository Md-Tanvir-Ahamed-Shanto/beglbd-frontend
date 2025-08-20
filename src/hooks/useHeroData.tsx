import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
}

const fetchHeroData = async (): Promise<HeroData> => {
  const response = await axios.get<HeroData>(`${import.meta.env.VITE_BASE_URL}/hero_section_data`);
  return response.data;
};

const useHeroData = () => {
  return useQuery({
    queryKey: ["HeroData"],
    queryFn: fetchHeroData,
   
  });
};

export default useHeroData;
