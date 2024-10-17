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
import { useGetUser } from "@/hooks/useUsers";
import { useEffect } from "react";
import axios from "../../lib/axios"
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function Settings() {

    const { data, isLoading: isMetricsLoading, error } = useGetMetrics();

    // const userToken = localStorage.getItem('authToken');

    // console.log("TOKEN", userToken)

    const { data: userData, isLoading, error: userError } = useGetUser();

    console.log("User Data", userData)
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
            console.log("ENTROU AQUI", userData)
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

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('user', JSON.stringify(data));
        console.log("Users", formData.get('user')['select_metrics'])
        // Handle form submission
        console.log('SUBMIT', data);
        // try {
        //     const response = await axios.put(`/users/${userData.id}`, formData);
        //     console.log('Game added:', response.data);
        //     if (response.status === 200) {
        //         toast.success('Success')
        //     }
        // } catch (error) {
        //     console.error('Failed to add game:', error);
        // }

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

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error.message}</p>;

    const availableMetrics = data?.filter(metric => !metric.expression) || [];
    const options = data?.map(metric => ({
        value: metric.id,
        label: metric.name
    }));


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
                                        <FormLabel >Nick name</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="username" {...field} placeholder="nick name" />
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
                                        <FormLabel >Password</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="password" {...field} placeholder="password" type='password' />
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
                                    validate: (value) => value === watch('password') || 'Passwords do not match',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="confirm_password" {...field} placeholder="confirm_password" type='password' />
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
                                                <p className="text-lg">Shared Data</p>
                                                <p className="font-normal">Required for the functioning of the dashboards</p>
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
                                            Key Metrics (up to 3)
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                multiple
                                                value={value || []}
                                                onChange={(event) => {
                                                    let selectedValues = event.target.value;
                                                    console.log("SELECTED", selectedValues)

                                                    // Se o número de seleções exceder o limite, remova o primeiro item
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
                                    Save
                                </Button>

                            </div>
                        </div>
                    </form>

                </Form>
            </CardContent>

        </Card>
    )
}