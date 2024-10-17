import { useQuery, useMutation } from '@tanstack/react-query';
import axios from "../lib/axios"

const fetchAuthUser = async ({username, password}) => {
    const {data} = await axios.post("/token/pair", {
        username: username,
        password: password
    }, {
        headers: {
            'Content-Type': 'application/json'  // Ensure the correct content type
        }
    });
    return data
}


export const useAuthUser = (username, password) => {
    return useMutation({
        mutationFn: fetchAuthUser,
    })
    return useQuery({
        queryKey: ['auth_user', username],
        queryFn: () => fetchAuthUser({ username, password }),
        enabled: !!username && !!password,
    });
};