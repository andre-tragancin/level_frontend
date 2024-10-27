"use client"

import { Bar, BarChart } from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ShoppingCart } from 'lucide-react';
import { BoxIcon } from "lucide-react"
import { useState } from "react"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';

export default function General() {
    const data_ = [
        { name: "Dom", pl: 1.0, pv: 1.2 },
        { name: "Seg", pl: 1.4, pv: 0.8 },
        { name: "Ter", pl: 1.0, pv: 1.0 },
        { name: "Qua", pl: 0.8, pv: 1.2 },
        { name: "Qui", pl: 1.0, pv: 1.3 },
        { name: "Sex", pl: 1.2, pv: 1.0 },
        { name: "Sáb", pl: 2.0, pv: 1.8 },
    ];

    const config = {
        theme: 'light', 
        color: '#8884d8',
    };

    const [chartType, setChartType] = useState('line');

    return (
        <div className="flex flex-col items-start w-full space-y-5">
            <div className="flex space-x-4">
                <Card className='w-60'>
                    <CardHeader>
                        <CardTitle>Games</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-around">
                            <div className="size-14 bg-slate-100 rounded-full flex justify-center items-center">
                                <BoxIcon className="size-10 text-indigo-400 " />
                            </div>
                            <p className="flex justify-center items-center text-3xl font-bold">
                                5
                            </p>
                        </div>
                    </CardContent>
                </Card >
                <Card className='w-60'>
                    <CardHeader>
                        <CardTitle>Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-around">
                            <div className="size-14 bg-slate-100 rounded-full flex justify-center items-center">
                                <ShoppingCart className="size-10 text-red-400 " />
                            </div>
                            <p className="flex justify-center items-center text-3xl font-bold">
                                3
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Média de Horas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end pb-2">
                        <Select value={chartType} onValueChange={setChartType}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Escolha o tipo de gráfico" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="line">Gráfico de Linha</SelectItem>
                                <SelectItem value="bar">Gráfico de Barra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <ChartContainer config={config} className="w-full h-[400px]">
                        {chartType === 'line' ? (
                            <LineChart data={data_}>
                                <Legend />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0.6, 2]} />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="pl" stroke="#5b21b6" dot={{ fill: '#5b21b6' }} strokeWidth={2} name='Pensar e Lavar' />
                                <Line type="monotone" dataKey="pv" stroke="#0ea5e9" dot={{ fill: '#0ea5e9' }} strokeWidth={2} name='Pensar e Vestir' />
                            </LineChart>

                        ) : (
                            <BarChart data={data_} className="w-full h-full">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0.6, 2]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pl" fill="#5b21b6" name='Pensar e Lavar' />
                                <Bar dataKey="pv" fill="#0ea5e9" name='Pensar e Vestir' />
                            </BarChart>
                        )}
                    </ChartContainer>

                </CardContent>
            </Card>

        </div>
    )
}