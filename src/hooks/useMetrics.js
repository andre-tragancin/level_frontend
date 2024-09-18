import { useQuery } from '@tanstack/react-query';
import axios from "../lib/axios"


const fetchMetrics = async () => {
    const { data } = await axios.get('/metrics/');
    return data;
};

export const useGetMetrics = () => {
    return useQuery({
      queryKey: ['metrics'],
      queryFn: () => fetchMetrics(),
    });
  };