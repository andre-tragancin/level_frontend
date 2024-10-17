import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from "../lib/axios"


const fetchGames = async () => {
  const { data } = await axios.get('/games/');
  return data;
};

const fetchGetGamesMetrics = async (game_id) => {
  const { data } = await axios.get(`games/${game_id}/metrics/`)
  return data
}

export const useGetGames = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => fetchGames(),
  });
};

export const postGameMetrics = async (game_id, metric_id) => {
  console.log("Game ID", game_id)
  console.log("Metrics", metric_id)
  try {
    // const responses = await Promise.all(
    //   metrics.map((metric_id) => {
    //     return axios.post(`/games/${game_id}/metrics/compound?metric_id=${metric_id}`);
    //   })
    // );
    return axios.post(`/games/${game_id}/metrics/compound?metric_id=${metric_id}`);
    return responses.map((response) => response.data);
  } catch (error) {
    console.error('Erro ao enviar métricas', error);
    throw error; // Repropaga o erro para ser capturado no onError
  }
}

export const deleteGameMetrics = async (game_id, metric_id) => {
  console.log("Delete Game ID", game_id)
  console.log("Delete Metric ID", metric_id)
  return axios.delete(`/games/${game_id}/metrics/${metric_id}`)
}

export const useGetGamesMetrics = (game_id) => {
  return useQuery({
    queryKey: ['gamesMetrics'],
    queryFn: (game_id) => fetchGetGamesMetrics(),
  })
}

export const usePostGameMetrics = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ game_id, metrics }) => postGameMetrics(game_id, metrics),
    onSuccess(data) {

      // Aqui, você pode invalidar as queries relacionadas ao game_id, por exemplo
      queryClient.invalidateQueries([`gameMetrics`]);
      queryClient.invalidateQueries([`metrics`]);


      // Outros efeitos colaterais, como exibir mensagens de sucesso
      console.log('Métricas enviadas com sucesso!', data);
    },
    onError: (error) => {
      // Lidar com erros
      console.error('Erro ao enviar métricas', error);
    }
  });
}

export const useDeleteGameMetrics = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({game_id, metric_id}) => deleteGameMetrics(game_id, metric_id),
    onSuccess(data){
      queryClient.invalidateQueries([`gameMetrics`]);
      queryClient.invalidateQueries([`metrics`]);
      console.log("Métricas deletadas com sucesso", data);
    },
    onError: (error) => {
      console.log("Erro ao dleetar métricas", error)
    }
  })
}