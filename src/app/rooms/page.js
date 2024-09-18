"use client"

import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { useUsers } from '@/hooks/useUsers';

export default function Rooms() {

    const { data, error, isLoading } = useUsers();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    console.log("DATA PAGE", data)

    return (
        <div>
        <h1>Users</h1>
        <ul>
            {data.map((user) => (
                
                <li key={user.id}>{user.user.first_name}</li>
            ))}
        </ul>
        </div>
    );
    return(
        <h1>Rooms page</h1>
    )
}