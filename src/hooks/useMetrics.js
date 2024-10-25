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

const fetchMetricsStudent = async (class_id, student_id) => {
  const { data } = await axios.get(`/metrics/${class_id}/students/${student_id}`)
  return data
}

export const useGetMetricsClassStudent = (class_id, student_id) => {
  return useQuery({
    queryKey: ['metrics_student', class_id, student_id],
    queryFn: () => fetchMetricsStudent(class_id, student_id),
    enabled: !!student_id
  })
}

const fetchMetricsClassGame = async (class_id, game_id) => {
  const { data } = await axios.get(`metrics/classroom/${class_id}/games/${game_id}`)
  return data
}

export const useGetMetricsClassGame = (class_id, game_id) => {
  return useQuery({
    queryKey: ['metrics_game', class_id, game_id],
    queryFn: () => fetchMetricsClassGame(class_id, game_id),
    enabled: !!class_id && !!game_id
  })
}

const fetchMetricsStudents = async (class_id, students_id, metrics_id) => {
  try {
    const promises = [];

    students_id.forEach((student_id) => {
      metrics_id.forEach((metric_id) => {
        const request = axios.get(`metrics/classroom/${class_id}/students/${student_id}/${metric_id}`);
        promises.push(request);
      });
    });

    // Executar todas as requisições em paralelo com Promise.all
    const responses = await Promise.all(promises);

    // Extrair os dados de cada resposta
    const data = responses
      .map((response) => response.data)
      .filter((result) => result.length !== 0);

    return data; // Retorna todos os dados combinados

  } catch (error) {
    console.error("Erro ao buscar métricas para estudantes:", error);
    throw error;
  }
}

export const useGetMetricsStudents = (class_id, students_id, metrics_id) => {
  return useQuery({
    queryKey: ['single_metrics_student', class_id, students_id, metrics_id],
    queryFn: () => fetchMetricsStudents(class_id, students_id, metrics_id),
    enabled: !!class_id && !!students_id && !!metrics_id
  })
}

const fetchMetricsGame = async (class_id, game_id, metrics_id) => {
  try {
    const promises = [];

    metrics_id.forEach((metric_id) => {
      const request = axios.get(`metrics/classroom/${class_id}/games/${game_id}/${metric_id}`);
      promises.push(request);
    });

    // Executar todas as requisições em paralelo com Promise.all
    const responses = await Promise.all(promises);

    // Extrair os dados de cada resposta
    const data = responses
      .map((response) => response.data)
      .filter((result) => result.length !== 0);

    return data; // Retorna todos os dados combinados

  } catch (error) {
    console.error("Erro ao buscar métricas para estudantes:", error);
    throw error;
  }
}

export const useGetMetricsGame = (class_id, game_id, metrics_id) => {
  return useQuery({
    queryKey: ['single_metrics_student', class_id, game_id, metrics_id],
    queryFn: () => fetchMetricsGame(class_id, game_id, metrics_id),
    enabled: !!class_id && !!game_id && !!metrics_id
  })
}