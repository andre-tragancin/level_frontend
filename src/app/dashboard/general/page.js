"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useGetUser, useGetMetricsUser } from "@/hooks/useUsers";
import { useState } from "react";
import { useGetMetricsGame, useGetMetrics } from "@/hooks/useMetrics";
import { useEffect } from "react";
import { useGetGames } from "@/hooks/useGames";
import { useGetClassRoom } from "@/hooks/useClassRooms";
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { MetricsBarChart } from "@/app/components/MetricsBarChart/MetricsBarChart";

export default function General() {

    const { data: games } = useGetGames()
    const { data: classRoom } = useGetClassRoom()
    const { data: metrics } = useGetMetrics()


    const { data: userData, isLoading, error: userError } = useGetUser();
    const { data: userMetrics, isLoading: isLoadingMetrics } = useGetMetricsUser(userData.user.id || null)


    const [selectedClass, setSelectedClass] = useState('')
    const [selectedGame, setSelectedGame] = useState('')
    const [selectedMetrics, setSelectedMetrics] = useState([])
    const [studentsMetrics, setStudentsMetrics] = useState('')

    const { data: metricsStudents } = useGetMetricsGame(selectedClass || null, selectedGame || null, selectedMetrics || null)
    // const { data: metricsStudents } = useGetMetricsStudents(selectedClass || null, [userData.user.id] || null, selectedMetrics || null )

    // console.log("UserMetrics", userMetrics)
    console.log("Metrics Student", metricsStudents)
    console.log("user Data", userData)

    useEffect(() => {
        if (userMetrics) {
            const metricIds = userMetrics.map(item => item.metric.id);
            console.log("MetricIds", metricIds)
            setSelectedMetrics(metricIds)
        }
    }, [userMetrics])

    useEffect(() => {
        if (metricsStudents?.length > 0) {
            const metricsStudentsDict = {}

            metricsStudents.forEach(subArray => {
                subArray.forEach(item => {
                    const student = item.student;
                    console.log("Student", student)
                    if (student.username == userData.user.username) {
                        const metric = item.metric;
                        const metricName = metric.metric.name;
                        let metricValue = item.value;

                        if (metricValue === "True") {
                            metricValue = 1;
                        } else if (metricValue === "False") {
                            metricValue = 0;
                        } else if (typeof metricValue === "string" && metricValue.includes(',')) {
                            metricValue = parseFloat(metricValue.replace(',', '.'));
                        } else if (!isNaN(parseFloat(metricValue))) {
                            metricValue = parseFloat(metricValue);
                        }

                        // console.log("Value", metricValue, typeof metricValue)

                        const studentKey = `${student.first_name} ${student.last_name}`.trim();

                        if (!metricsStudentsDict[studentKey]) {
                            metricsStudentsDict[studentKey] = {};
                        }

                        metricsStudentsDict[studentKey][metricName] = metricValue;
                    }
                });
            });
            console.log("Metrics Students Dict", metricsStudentsDict)
            setStudentsMetrics(metricsStudentsDict)
        }
    }, [metricsStudents])

    return (
        <div className="flex flex-col items-start w-full space-y-5">
            {/* <div className="flex p-3 space-x-4 justify-center w-full bg-white"> */}
            <Card className='flex w-full justify-center items-center'>
                <CardContent className="flex items-center justify-center space-x-4 !pt-6">
                    <FormControl className="w-[200px]" >
                        <InputLabel>Sala</InputLabel>
                        <Select
                            value={selectedClass}
                            label="Sala"
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            {classRoom?.map((room) => (
                                <MenuItem key={room.id} value={room.id}>
                                    {room.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Select do Jogo */}
                    <FormControl className="w-[200px]"  >
                        <InputLabel>Jogo</InputLabel>
                        <Select
                            value={selectedGame}
                            label="Jogo"
                            onChange={(e) => setSelectedGame(e.target.value)}
                        >
                            {games?.map((game) => (
                                <MenuItem key={game.id} value={game.id}>
                                    {game.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Métricas Favoritas</CardTitle>
                </CardHeader>
                <CardContent>
                    {studentsMetrics && (
                        <MetricsBarChart
                            studentsMetrics={studentsMetrics}
                            selectedMetrics={selectedMetrics}
                            metrics={metrics}
                        />
                    )}
                    {selectedMetrics == 0 && !isLoadingMetrics && (
                        <div>
                            <p>Você ainda não possui métricas favoritas</p>
                            <p>Configure-as na seção Configurações</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Visualização por Sala</CardTitle>
                </CardHeader>
            </Card>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Visualização por Sala</CardTitle>
                </CardHeader>
            </Card> */}
        </div>
    )
}