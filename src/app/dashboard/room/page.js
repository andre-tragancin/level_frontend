"use client";

import { useGetClassRoom, useGetClassRoomStudents } from "@/hooks/useClassRooms";
import { useGetMetrics, useGetMetricsGame } from "@/hooks/useMetrics";
import { useState } from "react";
import { useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useGetGames } from "@/hooks/useGames";
import { Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';
import { MetricsBarChart } from "@/app/components/MetricsBarChart/MetricsBarChart";

export default function Room() {

    const { data: metrics } = useGetMetrics()
    const { data: games } = useGetGames()
    const { data: classRoom } = useGetClassRoom()


    const [studentsMetrics, setStudentsMetrics] = useState('')
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedGame, setSelectedGame] = useState('')
    const [selectedMetrics, setSelectedMetrics] = useState([])

    const { data: students } = useGetClassRoomStudents(selectedClass || null)
    // TODO Esperar a API funcionar para usar esse hook
    // const { data: games } = useGetClassRoomGames(selectedClass || null)
    
    const { data: metricsStudents } = useGetMetricsGame(selectedClass || null, selectedGame || null, selectedMetrics || null)

    useEffect(() => {
        if(metricsStudents?.length > 0){
            const metricsStudentsDict = {}

            metricsStudents.forEach(subArray => {
                subArray.forEach(item => {
                    const student = item.student;
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
                });
            });
            setStudentsMetrics(metricsStudentsDict)
        }
    }, [metricsStudents])


    return (
        <div className="flex flex-col items-start w-full space-y-5">
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Visualização por Sala</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Selects */}
                    <div className="flex justify-end pb-2 space-x-4">

                        {/* Select da Sala */}
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


                        <FormControl className="w-[200px]">
                            <InputLabel>Métricas</InputLabel>
                            <Select
                                multiple
                                label="Métricas"
                                value={selectedMetrics}
                                onChange={(e) => setSelectedMetrics(e.target.value)}
                                renderValue={(selected) =>
                                    selected
                                        .map((id) => {
                                            const metric = metrics.find((metric) => metric.id === id);
                                            return metric ? metric.name : '';
                                        })
                                        .join(', ')
                                }
                            >
                                {metrics?.map((metric) => (
                                    <MenuItem key={metric.id} value={metric.id}>
                                        <Checkbox checked={selectedMetrics.indexOf(metric.id) > -1} />
                                        <ListItemText primary={metric.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    {studentsMetrics && (
                        <MetricsBarChart
                            studentsMetrics={studentsMetrics}
                            selectedMetrics={selectedMetrics}
                            metrics={metrics}
                        />
                    )}
                </CardContent>
            </Card>

        </div>
    );
}