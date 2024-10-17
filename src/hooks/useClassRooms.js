import { useQuery } from '@tanstack/react-query';
import axios from "../lib/axios"


const fetchClassRoom = async () => {
    const { data } = await axios.get('/classroom/');
    return data;
};

export const useGetClassRoom = () => {
    return useQuery({
      queryKey: ['classroom'],
      queryFn: () => fetchClassRoom(),
    });
  };