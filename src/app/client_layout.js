"use client";

import { useEffect, useState } from "react";
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
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import axios from "../lib/axios"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuthUser } from "@/hooks/useAuthUser";
import { TriangleAlert } from 'lucide-react';
import { useQueryClient } from "@tanstack/react-query";

export const USER_TYPE_CHOICES = {
    0: "Developer",
    1: "Professor",
    2: "Student",
    3: "Admin",
}

export default function ClientLayout({ children }) {

    const [userToken, setUserToken] = useState(null)
    const { data: userData, error: getUserError, isLoading } = useGetUser(userToken)
    const { mutate: authUser, isLoading: authLoading, isError, error: authError, data: authData } = useAuthUser()
    const [login, setLogin] = useState(false);
    const [userType, setUserType] = useState(null)
    const [selectedType, setSelectedType] = useState(null);

    const [isLogin, setIsLogin] = useState(true);

    const queryClient = useQueryClient()

    const handleLoginClick = () => {
        setIsLogin(true);
    };

    const handleSignupClick = () => {
        setIsLogin(false);
    };

    const form_create = useForm({
        defaultValues: {
            username: '',
            password: '',
            first_name: '',
            last_name: '',
            email: '',
            type: 0,
            classroom_token: '',
        }
    });

    const form_login = useForm({
        defaultValues: {
            username: '',
            password: '',
        }
    })

    const { control: createControl, handleSubmit: handleSubmitCreate, formState: { errors: createErrors }, reset: resetFormCreate } = form_create;
    const { control: loginControl, handleSubmit: handleSubmitLogin, formState: { errors: loginErrors }, reset: resetFormLogin } = form_login;


    // const { handleSubmit, control, formState: { errors } } = form;
    // const form = useForm();
    // const { handleSubmit, control, formState: { errors } } = form;

    const onSubmitLogin = async (data) => {
        console.log("Login", data);
        console.log(data.username);

        authUser(
            { username: data.username, password: data.password },
            {
                onSuccess: (authData) => {
                    if (authData) {
                        console.log("authData", authData.access)
                        setUserToken(authData.access);
                        queryClient.invalidateQueries('get_user')
                        localStorage.setItem('authToken', authData.access);
                        setLogin(true)
                        resetFormLogin()
                    }
                },
                onError: (authError) => {
                    console.error('Erro na autenticação', authError);
                }
            }
        )
    }

    const onSubmitCreate = async (data) => {
        console.log("Create", data);
        try {
            const formData = new FormData();
            formData.append('user', JSON.stringify(data));
            console.log("Users", formData)
            const payload = {
                'email': data.email,
                'first_name': data.first_name,
                'last_name': data.last_name,
                'password': data.password,
                'type': data.type,
                'username': data.username
            }
            const response = await axios.post(`/users/`, formData);
            console.log("RESPONSE", response)
            if (response.status === 200) {
                setUserType(data.type)
                resetFormCreate()
                // setLogin(true)
                onSubmitLogin(data)
            }

        } catch (error) {
            console.error('Failed to create user:', error.response.data);
        }
    };

    useEffect(() => {
        console.log("UserType", userType)
        console.log("Login", login)
    }, [userType, login])

    const handleFormSubmit = (event) => {
        console.log("Submitting form...");
        handleSubmit(onSubmit)(event);
    };

    return (
        <>
            {(login && (userData || userType !== null)) ? (
                <Layout userType={userType} userData={userData} setLogin={setLogin} setUserToken={setUserToken}>
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
                                            {(authError || getUserError) && (
                                                <Alert className='mt-4' variant='destructive'>
                                                    {/* <AlertTitle>Error</AlertTitle> */}
                                                    <AlertDescription>
                                                        <div className="flex items-center space-x-2">
                                                            <TriangleAlert />
                                                            <spam>Usuário ou senha incorretos. Por favor, tente novamente.</spam>
                                                        </div>
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                            <div className="pt-4 space-y-4">
                                                <Form {...form_login} >
                                                    <form onSubmit={handleSubmitLogin(onSubmitLogin)} className="space-y-5">
                                                        <FormField
                                                            control={loginControl}
                                                            name="username"
                                                            rules={{ required: 'Username is required' }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel >Username</FormLabel>
                                                                    <FormControl>
                                                                        <Input className="bg-slate-200" id="user_name" {...field} placeholder="Enter your username" />
                                                                    </FormControl>
                                                                    {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                                                    <FormMessage>{loginErrors.username?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={loginControl}
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
                                                                    <FormMessage>{loginErrors.password?.message}</FormMessage>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="flex justify-center pt-6">
                                                            <Button className="w-52" type="submit" disabled={authLoading}>
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
                                                <Form {...form_create} >
                                                    <form onSubmit={handleSubmitCreate(onSubmitCreate)} className="space-y-5">

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={createControl}
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
                                                                        <FormMessage>{createErrors.first_name?.message}</FormMessage>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={createControl}
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
                                                                        <FormMessage>{createErrors.last_name?.message}</FormMessage>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={createControl}
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
                                                                        <FormMessage>{createErrors.email?.message}</FormMessage>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={createControl}
                                                                name="username"
                                                                rules={{ required: 'Username is required' }}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel >Username</FormLabel>
                                                                        <FormControl>
                                                                            <Input className="bg-slate-200" id="username" {...field} placeholder="Enter your username" />
                                                                        </FormControl>
                                                                        {/* <FormDescription>Your username must be unique.</FormDescription> */}
                                                                        <FormMessage>{createErrors.username?.message}</FormMessage>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <FormField
                                                                control={createControl}
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
                                                                        <FormMessage>{createErrors.password?.message}</FormMessage>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={createControl}
                                                                name="type"
                                                                rules={{ required: 'User Type is required' }}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>User Type</FormLabel>
                                                                        <FormControl>
                                                                            <Select
                                                                                value={field.value?.toString()}
                                                                                onValueChange={(val) => {
                                                                                    field.onChange(Number(val));
                                                                                    setSelectedType(Number(val));

                                                                                }}
                                                                            >
                                                                                <SelectTrigger className="w-full">
                                                                                    <SelectValue placeholder="Select your type" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {Object.entries(USER_TYPE_CHOICES).map(([key, label]) => (
                                                                                        <SelectItem key={key} value={key}>
                                                                                            {label}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage>{createErrors.type?.message}</FormMessage>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        {selectedType === 2 && (
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <FormField
                                                                    control={createControl}
                                                                    name="classroom_token"
                                                                    rules={{ required: 'Classroom token is required' }}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Classroom Token</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="Enter your classroom token" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage>{createErrors.classroom_token?.message}</FormMessage>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>

                                                        )}

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
                            </CardContent>
                        </Card>

                    </div>
                </div>
            )}
        </>
    );
}
