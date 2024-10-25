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


const fetchClassRoomStudents = async (class_id) => {
  const { data } = await axios.get(`/classroom/${class_id}/students`);
  return data;
};

export const useGetClassRoomStudents = (class_id) => {
  return useQuery({
    queryKey: ['classroom_students', class_id], 
    queryFn: () => fetchClassRoomStudents(class_id), 
    enabled: !!class_id,
  })
}

const fetchClassRoomGames = async (class_id) => {
  const { data } = await axios.get(`/classroom/${class_id}/games`);
  return data;
};

export const useGetClassRoomGames = (class_id) => {
  return useQuery({
    queryKey: ['classroom_games', class_id], 
    queryFn: () => fetchClassRoomGames(class_id), 
    enabled: !!class_id,
  })
}