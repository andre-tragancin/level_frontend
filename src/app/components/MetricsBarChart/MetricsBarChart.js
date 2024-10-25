import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

export const MetricsBarChart = ({ studentsMetrics, selectedMetrics, metrics }) => {

    const colors = [
        "#82ca9d",
        "#8884d8",
        "#ff8042",
        "#ffcc00",
        "#66b2ff",
        "#a4de6c",
        "#ffa07a",
    ];

    // Função para gerar os dados formatados para o gráfico
    const generateChartData = () => {
        if (!studentsMetrics || Object.keys(studentsMetrics).length === 0) return [];

        return Object.keys(studentsMetrics).map((studentKey) => {
            const studentMetrics = studentsMetrics[studentKey];
            return {
                name: studentKey,
                ...studentMetrics, // Spread das métricas
            };
        });
    };

    const chartData = generateChartData();

    return (
        <ChartContainer config={{ theme: "light", color: "#8884d8" }} className="w-full h-[400px]">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                {/* Renderizar as barras para as métricas selecionadas */}
                {selectedMetrics.length > 0 ? (
                    selectedMetrics.map((metricId, index) => {
                        console.log("Meitrcssss", studentsMetrics)
                        const metric = metrics.find((m) => m.id === metricId); // Encontrar a métrica correta pelo ID
                        return metric ? (
                            <Bar key={metric.id} dataKey={metric.name} fill={colors[index % colors.length]} name={metric.name} />
                        ) : null;
                    })
                ) : (
                    <>
                        <Bar dataKey="Acertos Totais" fill="#82ca9d" name="Acertos Totais" />
                        <Bar dataKey="Arrastos Totais" fill="#8884d8" name="Arrastos Totais" />
                        <Bar dataKey="Erros Totais" fill="#ff8042" name="Erros Totais" />
                    </>
                )}
            </BarChart>
        </ChartContainer>
    );
};
