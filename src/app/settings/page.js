"use client";


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm, Controller } from 'react-hook-form';
import { Form, FormLabel, FormItem, FormControl, FormDescription, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { InputLabel, MenuItem, Select, Chip, Checkbox } from '@mui/material';
import { useGetMetrics } from "@/hooks/useMetrics";
import { useGetMetricsUser, useGetUser } from "@/hooks/useUsers";
import { useEffect } from "react";
import axios from "../../lib/axios"
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import { selectedMetricIds } from "@/lib/utils/metricConfig";

export default function Settings() {

    const { data, isLoading: isMetricsLoading, error } = useGetMetrics();

    // const userToken = localStorage.getItem('authToken');

    // console.log("TOKEN", userToken)

    const { data: userData, isLoading, error: userError } = useGetUser();
    const { data: userMetrics, isLoading: isLoadingMetrics } = useGetMetricsUser(userData.user.id || null)
    const [metricsId, setMetricsId] = useState(null)

    console.log("User Data", userData)
    console.log("User Metrics", userMetrics)
    const queryClient = useQueryClient();



    const form = useForm({
        defaultValues: {
            email: '',
            username: '',
            password: '',
            confirm_password: '',
            shared_data: false,
            select_metrics: []
        }
    });

    const { reset, handleSubmit, formState: { errors }, watch } = form;

    useEffect(() => {
        if (!isLoading && userData) {
            // console.log("ENTROU AQUI", userData)
            reset({
                email: userData?.user?.email || "",
                username: userData?.user?.username || "",
                password: '',
                confirm_password: '',
                shared_data: userData?.is_sharing_data || false,
                select_metrics: [] // Se você deseja que nenhum valor seja selecionado inicialmente
            });
        }
    }, [userData, isLoading, reset]);

    useEffect(() => {
        if (!isLoading && userData && !isLoadingMetrics && userMetrics) {
            // Extrair IDs das métricas do usuário
            const metricIds = userMetrics.map(item => item.metric.id);
            setMetricsId(metricIds)
            console.log("Metrics ID", metricIds)

            // Atualizar o formulário com valores de userData e select_metrics
            reset({
                email: userData?.user?.email || "",
                username: userData?.user?.username || "",
                password: '',
                confirm_password: '',
                shared_data: userData?.is_sharing_data || false,
                select_metrics: metricIds // Definindo valores iniciais para select_metrics
            });
        }
    }, [userData, userMetrics, isLoading, isLoadingMetrics, reset]);

    const onSubmit = async (data) => {
        // const formData = new FormData();
        // formData.append('user', JSON.stringify(data));
        // console.log("Users", formData.get('user')['select_metrics'])
        // // Handle form submission
        // console.log('SUBMIT', data);
        const selectedMetricIds = data.select_metrics;
        const originalMetricIds = metricsId;

        const arraysAreEqual = (arr1, arr2) => {
            if (arr1.length !== arr2.length) return false;
            return arr1.every(item => arr2.includes(item));
        };

        try {
            if (!arraysAreEqual(selectedMetricIds, originalMetricIds) && originalMetricIds.length > 0) {
                const deleteUserMetrics = originalMetricIds.map(metric_id =>
                    axios.delete(`/users/${userData.user.id}/metrics/${metric_id}`)
                );

                await Promise.all([...deleteUserMetrics])
            }
        } catch (error) {
            console.error('Erro ao excluir Metricas', error)
        }

        // Se tiver valores vazios, nem passa para a API
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => value !== "")
        );

        // Criar um novo FormData com os campos filtrados
        const formData = new FormData();
        formData.append('user', JSON.stringify(filteredData));

        console.log("Dados filtrados", formData.get('user'));
        console.log("formData", formData)
        try {
            // Requisição para atualizar o usuário
            const userUpdatePromise = axios.put(`/users/${userData.id}`, formData);

            // Requisição para associar métricas ao usuário
            const metricPromises = data.select_metrics.map(metricId => {
                return axios.post(`/users/${userData.user.id}/metrics/?metric_id=${metricId}`);
            });

            // Aguardar ambas as requisições finalizarem
            await Promise.all([userUpdatePromise, ...metricPromises]);

            toast.success('Success');

        } catch (error) {
            console.error('Erro ao atualizar:', error);
            toast.error('Falha ao atualizar');
        }
    };

    if (isLoading || isLoadingMetrics) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error.message}</p>;

    const availableMetrics = data?.filter(metric => !metric.expression) || [];
    const options = data?.map(metric => ({
        value: metric.id,
        label: metric.name
    }));

    // const options = data
    //     ?.filter(metric => selectedMetricIds.includes(metric.id))
    //     .map(metric => ({
    //         value: metric.id,
    //         label: metric.name
    //     }));


    return (
        <Card>
            <CardContent>
                <Form {...form} >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >E-mail</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="email" {...field} placeholder="E-mail" />
                                        </FormControl>
                                        {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                        {/* <FormMessage>{errors.username?.message}</FormMessage> */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >Nome de Uusário</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="username" {...field} placeholder="usuário" />
                                        </FormControl>
                                        {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                        {/* <FormMessage>{errors.username?.message}</FormMessage> */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >Senha</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="password" {...field} placeholder="senha" type='password' />
                                        </FormControl>
                                        {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                        {/* <FormMessage>{errors.username?.message}</FormMessage> */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                rules={{
                                    validate: (value) => value === watch('password') || 'As senhas devem ser iguais',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >Confirme sua Senha</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="confirm_password" {...field} placeholder="confirmar senha" type='password' />
                                        </FormControl>
                                        {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                        <FormMessage>{errors.confirm_password?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="shared_data"
                                render={({ field }) => (
                                    <FormItem className='flex space-x-2 items-center'>
                                        <FormLabel className=''>
                                            <div className="space-y-1">
                                                <p className="text-lg">Compartilhar Dados</p>
                                                <p className="font-normal">Necessário para o funcionamento dos dashboards</p>
                                            </div>

                                        </FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                        {/* <FormMessage>{errors.username?.message}</FormMessage> */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='select_metrics'
                                render={({ field: { value, onChange } }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>
                                            Métricas Favoritas (máx. 3)
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                multiple
                                                value={value || []}
                                                onChange={(event) => {
                                                    let selectedValues = event.target.value;

                                                    if (selectedValues.length > 3) {
                                                        selectedValues.splice(2, 1)
                                                    }

                                                    onChange(selectedValues);
                                                }}
                                                renderValue={(selected) => (
                                                    <div >
                                                        {selected.map((value) => (
                                                            <Chip
                                                                key={value}
                                                                label={options.find(option => option.value === value)?.label}
                                                                sx={{
                                                                    whiteSpace: 'normal', // Permite que o texto dentro do Chip quebre em várias linhas
                                                                    overflow: 'visible', // Garante que o texto não seja cortado
                                                                    margin: '2px', // Adiciona um espaço entre os Chips
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {options?.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>

                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="md:col-span-2 flex justify-end">
                                <Button type='submit'>
                                    Salvar
                                </Button>

                            </div>
                        </div>
                    </form>

                </Form>
            </CardContent>

        </Card>
    )
}