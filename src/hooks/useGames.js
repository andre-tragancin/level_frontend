import { useQuery } from '@tanstack/react-query';
import axios from "../lib/axios"


const fetchGames = async () => {
    const { data } = await axios.get('/games/');
    return data;
};

export const useGetGames = () => {
    return useQuery({
      queryKey: ['games'],
      queryFn: () => fetchGames(),
    });
  };