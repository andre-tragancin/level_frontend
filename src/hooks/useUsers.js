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

const fetchGetUsers = async (userToken) => {
  try {
    console.log("TOKEN USER", userToken)
    const { data } = await axios.get("users/me", {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    const {data:dataView} = await axios.get(`users/${data.id}`)
    return dataView; // Retorna os dados do usuário
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Propaga o erro para quem chamar a função
  }
  const { data } = await axios.get(`/users/${user_name}/`);
  return data;
}

export const useGetUser = (userToken) => {
  return useQuery({
    queryKey: ['get_user'],
    queryFn: () => fetchGetUsers(userToken),
    enabled: !!userToken,
  })
}