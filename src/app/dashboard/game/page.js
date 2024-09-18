"use client"

import { Bar, BarChart } from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { BoxIcon } from "lucide-react"

export default function Game() {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  }

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const data_ = [
    { name: "Dom", pl:1.0, pv:1.2},
    { name: "Seg", pl:1.4, pv:0.8},
    { name: "Ter", pl:1.0, pv:1.0},
    { name: "Qua", pl:0.8, pv:1.2},
    { name: "Qui", pl:1.0, pv:1.3},
    { name: "Sex", pl:1.2, pv:1.0},
    { name: "Sáb", pl:2.0, pv:1.8},
  ];

  const config = {
    theme: 'light', // ou 'dark', dependendo do tema desejado
    color: '#8884d8', // Cor principal do gráfico
  };

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
                  <BoxIcon className="size-10 text-indigo-400 "/>
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
                  <ShoppingCart className="size-10 text-red-400 "/>
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
          <ChartContainer config={config} className="w-full h-[400px]">
            <LineChart data={data_}>
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0.6, 2]} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="pl" stroke="#5b21b6" dot={{fill:'#5b21b6'}} strokeWidth={2} name='Pensar e Lavar' />
              <Line type="monotone" dataKey="pv" stroke="#0ea5e9" dot={{fill:'#0ea5e9'}} strokeWidth={2} name='Pensar e Vestir'/>
            </LineChart>
          </ChartContainer>

        </CardContent>
      </Card>

    </div>
  )


  return (
    <div className="w-full">
      {/* <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Line Chart in Card</CardTitle>
        </CardHeader>
        <CardContent> */}
      <ChartContainer config={config}>
        <ResponsiveContainer width="100px" height={30000}>
          <LineChart data={data_}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      {/* </CardContent>
      </Card> */}
      {/* <Card>
              <CardContent className='min-h-[300px] min-w-full'>
                  <ChartContainer config={chartConfig} >
                  <LineChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                      }}
                  >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="pv" stroke="#8884d8" dot={{fill:'#8884d8'}} strokeWidth={2} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="uv" stroke="#82ca9d" strokeWidth={3} />
                  </LineChart>
                  </ChartContainer>
              </CardContent>   
          </Card> */}
    </div>
  )
}