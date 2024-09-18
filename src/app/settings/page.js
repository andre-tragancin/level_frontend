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

export default function Settings() {
    const form = useForm({
        defaultValues:{
            shared_data: false
        }
    })
    const { handleSubmit } = form;

    const { data, isLoading, error } = useGetMetrics(); 


    const onSubmit = (data) => {
        // Handle form submission
        console.log('SUBMIT',data);
    };
    
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error.message}</p>;

    const availableMetrics = data?.filter(metric => !metric.expression) || [];
    const options = availableMetrics.map(metric => ({
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
                                            <Input className="bg-slate-200" id="username" {...field} placeholder="E-mail" />
                                        </FormControl>
                                        {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                        {/* <FormMessage>{errors.username?.message}</FormMessage> */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nickname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >Nick name</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="nickname" {...field} placeholder="nick name" />
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input className="bg-slate-200" id="confirm_password" {...field} placeholder="confirm_password" type='password' />
                                        </FormControl>
                                        {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                        {/* <FormMessage>{errors.username?.message}</FormMessage> */}
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
                                                        selectedValues.splice(2,1)
                                                    }
                            
                                                    onChange(selectedValues);
                                                }}
                                                renderValue={(selected) => (
                                                    <div >
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={options.find(option => option.value === value)?.label} />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {options.map((option) => (
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