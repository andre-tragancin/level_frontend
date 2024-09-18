"use client"

import React, {useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGetGames } from '@/hooks/useGames';
import { Pen, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button} from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import axios from "../../lib/axios"
import { useQueryClient } from '@tanstack/react-query';

export default function Games() {
    const { data, isLoading, error } = useGetGames();
    const [open, setOpen] = useState(false);
    const [gameName, setGameName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [gameId, setGameId] = useState(null);

    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/games/', { name: gameName });
            console.log('Game added:', response.data);
            setOpen(false);
            queryClient.invalidateQueries(['games']);
        } catch (error) {
            console.error('Failed to add game:', error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(`/games/${gameId}`, { name: gameName });
            console.log('Game updated:', response.data);
            setOpen(false);
            queryClient.invalidateQueries(['games']);  // Atualizar a lista de jogos
        } catch (error) {
            console.error('Failed to update game:', error);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error.message}</p>;

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Game Name', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            align: 'right',
            flex: 1,
            renderCell: (params) => (
                <div className='flex justify-end items-center h-full space-x-1'>
                    <Pencil
                        onClick={() => handleEdit(params.row.id, params.row.name)}
                        style={{ cursor: 'pointer' }}
                    />
                    <Trash2
                        onClick={() => handleDelete(params.row.id)}
                        style={{cursor: 'pointer'}}
                    />
                </div>
            ),
        },
    ];

    const handleEdit = (id, currentName) => {
        console.log(`Editing game with ID: ${id}`);
        setEditMode(true);      // Ativa o modo de edição
        setGameId(id);          // Define o ID do jogo a ser editado
        setGameName(currentName);  // Preenche o campo de nome com o nome do jogo atual
        setOpen(true);          // Abre o Dialog
    };

    const handleDelete = async (gameId) => {
        console.log(`Delete game with ID: ${gameId}`)
        try {
            const response = await axios.delete(`/games/${gameId}`);
            console.log('Game deleted:', response.data);
            queryClient.invalidateQueries(['games']);
        } catch (error) {
            console.error('Failed to delete game:', error);
        }
    }

    return (
        <>
            <div className='flex justify-center items-center w-3/4'>
                <div className='w-3/4'>
                    <div className='p-2'>
                        <Button onClick={() => setOpen(true)}>
                            <Plus />
                            Adicionar
                        </Button>
                    </div>
                    <DataGrid
                        rows={data || []}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                            sorting: {
                                sortModel: [
                                  {
                                    field: 'id',
                                    sort: 'asc',
                                  },
                                ],
                            },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        autoHeight
                        sx={{
                            borderRadius: '20px',
                            backgroundColor: 'white'
                        }}
                    />

                </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editMode ? 'Edit Game' : 'Add a New Game'}</DialogTitle>
                    </DialogHeader>

                    <form>
                        <Input
                            label="Game Name"
                            placeholder="Enter the game name"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                        />
                    </form>

                    <DialogFooter>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={editMode ? handleEditSubmit : handleSubmit}>
                            {editMode ? 'Save Changes' : 'Add Game'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
