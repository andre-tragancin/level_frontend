import { useQuery } from '@tanstack/react-query';
import axios from "../lib/axios"

const fetchUsers = async () => {
    const { data } = await axios.get('/users/');
    console.log("DATA", data)
    return data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

const fetchGetUsers = async (user_name) => {
    const { data } = await axios.get(`/users/${user_name}/`);
    return data;
}

export const useGetUser = (user_name) => {
    return useQuery({
        queryKey: ['get_user'],
        queryFn: () => fetchGetUsers(user_name),
        enabled: !!user_name,
    })
}