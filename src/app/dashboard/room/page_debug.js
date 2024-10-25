"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogHeader, DialogDescription, DialogClose } from '@/components/ui/dialog';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
    timelineOppositeContentClasses
} from '@mui/lab';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
// import NotificationsIcon from '@mui/icons-material/Notifications';
import { Bell, Plus, Check, Trash2 } from 'lucide-react';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart } from "recharts"
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';

export default function Room() {
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chartType, setChartType] = useState('line');

    useEffect(() => {
        // Abrir o modal se o parâmetro showModal estiver presente
        if (searchParams.get('showModal') === 'true') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsModalOpen(false);
    };

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
        theme: 'light', // ou 'dark', dependendo do tema desejado
        color: '#8884d8', // Cor principal do gráfico
    };

    const radarData = [
        {
            subject: 'Abstração',
            'Pensar e Lavar': 4,
            'Pensar e Vestir': 3,
        },
        {
            subject: 'Algoritmos',
            'Pensar e Lavar': 3,
            'Pensar e Vestir': 4,
        },
        {
            subject: 'Reconhecimento de Padrões',
            'Pensar e Lavar': 2,
            'Pensar e Vestir': 4,
        },
        {
            subject: 'Decomposição',
            'Pensar e Lavar': 5,
            'Pensar e Vestir': 3,
        },
    ];

    return (
        <div className="flex flex-col items-start w-full space-y-5">
            <div className="flex space-x-4 w-full">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Atividades Recentes</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-0">

                        <Timeline sx={{
                            '& .MuiTimelineItem-root::before': {
                                content: 'none', // Remove o conteúdo do pseudo-elemento para todos os TimelineItems
                            },
                        }}>
                            <TimelineItem>
                                <TimelineSeparator>
                                    <div className='bg-slate-100 rounded-full p-2 border-dashed border-2 border-sky-500'>
                                        <Bell className='text-sky-500 size-5' />
                                    </div>
                                    <TimelineConnector className='border-dashed border' />
                                </TimelineSeparator>
                                <TimelineContent sx={{ padding: '0px 16px' }}>
                                    <div>
                                        <span className="font-bold">Smith</span>
                                        <span className="font-semibold text-gray-500 text-sm ml-2">requisitou ajuda</span>
                                    </div>
                                    <span className="text-gray-400 text-xs mt-1 block">30 minutos atrás</span>

                                </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                                <TimelineSeparator>
                                    <div className='bg-slate-100 rounded-full p-2 border-dashed border-2 border-purple-500'>
                                        <Plus className='text-purple-500 size-5' />
                                    </div>
                                    <TimelineConnector className='border-dashed border' />
                                </TimelineSeparator>
                                <TimelineContent sx={{ padding: '0px 16px' }}>
                                    <div>
                                        <span className="font-bold">Harry</span>
                                        <span className="font-semibold text-gray-500 text-sm ml-2">iniciou um nível</span>
                                    </div>
                                    <span className="text-gray-400 text-xs mt-1 block">1 hora atrás</span>

                                </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                                <TimelineSeparator>
                                    <div className='bg-slate-100 rounded-full p-2 border-dashed border-2 border-green-500'>
                                        <Check className='text-green-500 size-5' />
                                    </div>
                                    <TimelineConnector className='border-dashed border' />
                                </TimelineSeparator>
                                <TimelineContent sx={{ padding: '0px 16px' }}>
                                    <div>
                                        <span className="font-bold">Mark</span>
                                        <span className="font-semibold text-gray-500 text-sm ml-2">completou um nível</span>
                                    </div>
                                    <span className="text-gray-400 text-xs mt-1 block">2 horas atrás</span>

                                </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                                <TimelineSeparator>
                                    <div className='bg-slate-100 rounded-full p-2 border-dashed border-2 border-red-500'>
                                        <Trash2 className='text-red-500 size-5' />
                                    </div>
                                </TimelineSeparator>
                                <TimelineContent sx={{ padding: '0px 16px' }}>
                                    <div>
                                        <span className="font-bold">Steve</span>
                                        <span className="font-semibold text-gray-500 text-sm ml-2">não compartilha mais</span>
                                    </div>
                                    <span className="text-gray-400 text-xs mt-1 block">3 horas atrás</span>

                                </TimelineContent>
                            </TimelineItem>

                            {/* Outros itens */}
                        </Timeline >
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Gráfico de Radar</CardTitle>
                    </CardHeader>
                    <CardContent >
                        <ChartContainer config={config} className="">
                            <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Radar name="Pensar e Lavar" dataKey="Pensar e Lavar" stroke="#5b21b6" fill="#5b21b6" fillOpacity={0.6} />
                                <Radar name="Pensar e Vestir" dataKey="Pensar e Vestir" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                            </RadarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Seja bem-vindo, Aluno!</DialogTitle>
                            <DialogDescription>
                                Nesta página, você poderá Visualizar suas salas. Vamos lá?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={handleClose}>Vamos lá!</Button>
                            <DialogClose asChild>
                                <Button>Fechar</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                    <ChartContainer config={config} className="w-full h-[250px]">
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