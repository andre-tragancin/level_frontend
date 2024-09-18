"use client";

import { useState } from "react";
import { Layout } from "./components/Layout/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { Form, FormLabel, FormItem, FormControl, FormDescription, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/hooks/useUsers";

export default function ClientLayout({ children }) {

    const [userName, setUserName] = useState(null)
    const {data, error, isLoading} = useGetUser(userName)
    const [login, setLogin] = useState(false);

    const [isLogin, setIsLogin] = useState(true);

    const handleLoginClick = () => {
        setIsLogin(true);
    };

    const handleSignupClick = () => {
        setIsLogin(false);
    };
    const form = useForm({
        defaultValues: {
            user_name: '',
            password: '',
            first_name: '',
            last_name: '',
            email: '',
        }
    });
    const { handleSubmit, control, formState: { errors } } = form;
    // const form = useForm();
    // const { handleSubmit, control, formState: { errors } } = form;

    const onSubmitLogin = (data) => {
        console.log("Login", data)
        console.log(data.user_name)
        // setUserName(data.user_name)
        setLogin(true)
    }

    console.log("DATA", data)

    const onSubmitCreate = (data) => {
        console.log("Create", data);
        // setLogin(true)
        // Aqui você pode adicionar a lógica para enviar os dados do formulário ao servidor
    };

    const handleFormSubmit = (event) => {
        console.log("Submitting form...");
        handleSubmit(onSubmit)(event);
    };

    return (
        <>
            {login ? (
                <Layout>
                    {children}
                </Layout>
            ) : (
                <div className="flex flex-1 justify-center items-center h-screen bg-gradient-to-r from-indigo-700 to-indigo-500">
                    <div>
                        <Card className="w-[1056px] h-[750px] overflow-hidden bg-indigo-200 border-0 drop-shadow-xl">
                            <CardContent className="flex justify-center p-0 h-full">
                                <div className="w-[40%] flex items-center justify-center bg-indigo-200">
                                    <Image
                                        src="/images/level_logo.png"
                                        width={600}
                                        height={600}
                                        alt="level_logo"
                                    />
                                </div>

                                <div className="w-[60%] p-8 bg-white rounded-l-3xl">
                                    {isLogin ? (
                                        <div>
                                            <div className="text-center">
                                                <p className=" text-3xl font-bold">Log In</p>
                                            </div>
                                            <div className="pt-4 space-y-4">
                                                <Form {...form} >
                                                    <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-5">
                                                        <FormField
                                                            control={control}
                                                            name="user_name"
                                                            rules={{ required: 'Username is required' }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel >Username</FormLabel>
                                                                    <FormControl>
                                                                        <Input className="bg-slate-200" id="user_name" {...field} placeholder="Enter your username" />
                                                                    </FormControl>
                                                                    {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                                                    <FormMessage>{errors.user_name?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={control}
                                                            name="password"
                                                            rules={{
                                                                required: 'Password is required',
                                                            }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Password</FormLabel>
                                                                    <FormControl>
                                                                        <Input className="bg-slate-200" id="password" type="password" {...field} placeholder="Enter your password" />
                                                                    </FormControl>
                                                                    {/* <FormDescription>Your password must be strong.</FormDescription> */}
                                                                    <FormMessage>{errors.password?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="flex justify-center pt-6">
                                                            <Button className="w-52" type="submit">
                                                                Log In
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </Form>
                                            </div>
                                            <p className="mt-8 text-sm text-zinc-400">
                                                Don't have an account?{' '}
                                                <Button className="ml-1 p-0" variant="link" onClick={handleSignupClick}>
                                                    Create Account
                                                </Button>
                                            </p>
                                        </div>
                                        // <h1>Login</h1>
                                    ) : (
                                        <div>
                                            <div className="text-center">
                                                <p className=" text-3xl font-bold">Create your Account</p>
                                            </div>
                                            <div className="pt-4 space-y-4">
                                                <Form {...form} >
                                                    <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-5">
                                                        <FormField
                                                            control={control}
                                                            name="first_name"
                                                            rules={{ required: 'First name is required' }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>First Name</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            className="bg-slate-200"
                                                                            id="first_name"
                                                                            {...field}
                                                                            placeholder="Enter your first name"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage>{errors.first_name?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={control}
                                                            name="last_name"
                                                            rules={{ required: 'Last name is required' }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Last Name</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            className="bg-slate-200"
                                                                            id="last_name"
                                                                            {...field}
                                                                            placeholder="Enter your last name"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage>{errors.last_name?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={control}
                                                            name="email"
                                                            rules={{
                                                                required: 'Email is required',
                                                                pattern: {
                                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                                    message: 'Enter a valid email address',
                                                                },
                                                            }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Email</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            className="bg-slate-200"
                                                                            id="email"
                                                                            type="email"
                                                                            {...field}
                                                                            placeholder="Enter your email"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage>{errors.email?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={control}
                                                            name="user_name"
                                                            rules={{ required: 'Username is required' }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel >Username</FormLabel>
                                                                    <FormControl>
                                                                        <Input className="bg-slate-200" id="user_name" {...field} placeholder="Enter your username" />
                                                                    </FormControl>
                                                                    {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                                                    <FormMessage>{errors.user_name?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={control}
                                                            name="password"
                                                            rules={{
                                                                required: 'Password is required',
                                                                minLength: {
                                                                    value: 8,
                                                                    message: 'Password must be at least 8 characters long',
                                                                },
                                                            }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Password</FormLabel>
                                                                    <FormControl>
                                                                        <Input className="bg-slate-200" id="password" type="password" {...field} placeholder="Enter your password" />
                                                                    </FormControl>
                                                                    {/* <FormDescription>Your password must be strong.</FormDescription> */}
                                                                    <FormMessage>{errors.password?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="flex justify-center pt-6">
                                                            <Button className="w-52" type="submit">Submit</Button>
                                                        </div>
                                                    </form>
                                                </Form>
                                            </div>
                                            <p className="mt-8 text-sm text-zinc-400">Already have a account?
                                                <Button className='ml-1 p-0' variant='link' onClick={handleLoginClick}>
                                                    Log In
                                                </Button>
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* <p className="w-full">BackGround</p>
                        <Card className="w-full h-full">
                            <CardContent>
                                <p>Form Login</p>
                            </CardContent>
                        </Card> */}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            )}
        </>
    );
}
