"use client"

import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { useUsers } from '@/hooks/useUsers';
import { useGetClassRoom } from '@/hooks/useClassRooms';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
// import {
//     Dialog, DialogContent, DialogFooter, DialogTitle, DialogHeader, DialogDescription, DialogClose
// } from '@/components/ui/dialog';
import { Pen, Pencil, Plus, Trash2 } from 'lucide-react';
import { DataGrid } from '@mui/x-data-grid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from '@/components/ui/accordion';
import { useGetMetrics } from "@/hooks/useMetrics";
import { useGetGames } from '@/hooks/useGames';
// import { InputLabel, MenuItem, Select, Chip, Checkbox } from '@mui/material';
import {
    List,
    ListItem,
    ListSubheader,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    FormControl,
    InputLabel,
    CircularProgress,
    Typography,
    Box,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    DialogContentText,
    IconButton,
} from '@mui/material';
import axios from "../../lib/axios"
import { useGetUser } from "@/hooks/useUsers";
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';


export default function Rooms() {

    const { data: classRooms, error, isLoading } = useGetClassRoom();
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [classRoomName, setClassRoomName] = useState('');
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classRoomId, setClassRoomId] = useState(null);
    const [classRoomToken, setClassRoomToken] = useState(null)
    const [actionType, setActionType] = useState('');
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedGames, setSelectedGames] = useState([])
    const { data, isLoading: isMetricsLoading } = useGetGames();

    const queryClient = useQueryClient();

    const userToken = localStorage.getItem('authToken');

    const { data: userData } = useGetUser();

    // console.log("User Data Rooms", userData)





    useEffect(() => {
        // Abrir o modal se o parâmetro showModal estiver presente
        if (searchParams.get('showModal') === 'true') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    const handleClose = () => {
        setIsModalOpen(false);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // console.log("DATA PAGE", classRooms)

    // const options = data?.map(game => {
    //     // Cria uma cópia de 'game' sem a propriedade 'metrics'
    //     const { metrics, ...gameWithoutMetrics } = game;

    //     return {
    //         value: gameWithoutMetrics,
    //         label: game.name
    //     };
    // });

    const options = data?.map(game => {

        return {
            value: game,
            label: game.name,
            id: game.id,
        }
    });

    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'ClassRoom', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            align: 'right',
            flex: 1,
            renderCell: (params) => (
                <div className='flex justify-end items-center h-full space-x-1'>
                    <Pencil
                        onClick={() => handleEdit(params.row.id, params.row.name, params.row.token)}
                        style={{ cursor: 'pointer' }}
                    />
                    <Trash2
                        onClick={() => handleDelete(params.row.id)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            ),
        },
    ];

    const handleSubmit = async () => {
        const classRoomData = {
            name: classRoomName,
            games: selectedGames,
        }
        try {
            const response = await axios.post('/classroom/', { classroom: classRoomData, user: userData.user });
            // console.log('Game added:', response.data);
            if (response.status === 200) {
                toast.success('Success')
                queryClient.invalidateQueries(['classroom']);
            }
        } catch (error) {
            console.error('Failed to add classroom:', error);
        }
        setClassRoomName('')
    };

    const handleEditSubmit = async () => {
        const classRoomData = {
            name: classRoomName,
            games: selectedGames,
        }
        // console.log("CLASS ROOM DATA PUT", classRoomData)
        try {
            const response = await axios.put(`/classroom/${classRoomId}`, classRoomData);
            if (response.status === 200) {
                toast.success('Success')
                // console.log('ClassRoom updated:', response.data);
                queryClient.invalidateQueries(['classroom']);  // Atualizar a lista de jogos
            }
        } catch (error) {
            console.error('Failed to update game:', error);
        }
        setEditMode(false)
        setClassRoomName('')
    };

    const handleDeleteSubmit = async () => {
        try {
            const response = await axios.delete(`/classroom/${classRoomId}`);
            if (response.status === 200) {
                toast.success('Success')
                // console.log('ClassRoom deleted:', response.data);
                queryClient.invalidateQueries(['classroom']);
            }
        } catch (error) {
            console.error('Failed to delete classRoom:', error);
        }
    }

    const handleOpenConfirmation = (type) => {
        setActionType(type);
        setOpen(false);
        setConfirmationOpen(true);
    };

    const handleConfirmationSubmit = () => {
        setConfirmationOpen(false);
        if (actionType === 'add') {
            handleSubmit();
        } else if (actionType === 'edit') {
            handleEditSubmit();
        } else if (actionType === 'delete') {
            handleDeleteSubmit()
            // Lógica para deletar o jogo
        }
    };

    const handleEdit = (id, currentName, token) => {
        const room = classRooms.find(item => item.id === id)
        // console.log("ROOM", room.games)
        // console.log(`Editing classRoom with ID: ${id}`);
        // console.log("TOKEN", token)
        setEditMode(true);
        setClassRoomId(id);
        setClassRoomName(currentName);
        setClassRoomToken(token)
        // setSelectedGames(room.games)
        setOpen(true);
    };

    const handleCopyToken = () => {
        if (classRoomToken) {
            navigator.clipboard.writeText(classRoomToken) // Copia o token para a área de transferência
                .then(() => {
                    alert('Token copiado para a área de transferência!'); // Alerta opcional
                })
                .catch(err => {
                    console.error('Erro ao copiar o token: ', err);
                });
        }
    };

    const handleDelete = async (id) => {
        // console.log(`Delete classRoom with ID: ${id}`)
        setClassRoomId(id)
        handleOpenConfirmation('delete')
    }

    const handleOnChangeSelect = (values) => {
        // console.log("VALUES", values)
        setSelectedGames(values)
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
                        rows={classRooms || []}
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

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth='xs' fullWidth={true}>
                <DialogTitle>{editMode ? 'Editar Sala' : 'Adicionar Sala'}</DialogTitle>
                <DialogContent>

                    <form>
                        <Input
                            label="Class Name"
                            placeholder="Nome da Sala"
                            value={classRoomName}
                            onChange={(e) => setClassRoomName(e.target.value)}
                            className='mt-4'
                        />
                        {editMode && (
                            <div className="mt-4">
                                <Label className="block mb-1">Token</Label>
                                <div className="flex items-center">
                                    <Input
                                        value={classRoomToken}
                                        disabled
                                        className="mr-2 flex-1" // Estilo opcional para espaço entre o input e o ícone
                                    />
                                    <Button type="button" onClick={handleCopyToken} className="flex items-center">
                                        <Copy size={16} />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Jogos</AccordionTrigger>
                                <AccordionContent className='pt-3'>
                                    <FormControl fullWidth variant='outlined'>
                                        <InputLabel id='selected-games_classroom'>Jogos</InputLabel>
                                        <Select
                                            multiple
                                            label="Jogos"
                                            value={selectedGames}
                                            onChange={(event) => {
                                                let selectedValues = event.target.value;
                                                // console.log("SELECTED", selectedValues)

                                                handleOnChangeSelect(selectedValues);
                                            }}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap'>
                                                    {selected.map((value) => (
                                                        <Chip
                                                            key={value.id}
                                                            label={options.find(option => option.value.id === value.id)?.label}
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
                                                <MenuItem key={option.value.id} value={option.value}>

                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>

                    <Button onClick={() => handleOpenConfirmation(editMode ? 'edit' : 'add')}>
                        {editMode ? 'Salvar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                <DialogTitle>{actionType === 'delete' ? 'Excluir Sala?' : actionType === 'edit' ? 'Salvar Alterações?' : 'Adicionar Sala?'}</DialogTitle>
                <DialogContent>
                    <p>
                        {actionType === 'delete'
                            ? 'Você realmente deseja excluir esta sala ?'
                            : actionType === 'edit'
                                ? `Você realmente deseja editar a sala "${classRoomName}"?`
                                : `Você realmente deseja criar a sala "${classRoomName}"?`}
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)}>Cancelar</Button>
                    <Button onClick={handleConfirmationSubmit}>Confirmar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} >

                <DialogTitle>Seja bem-vindo, Professor!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Nesta página, você poderá criar e editar as salas. Vamos lá?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Vamos lá!</Button>
                </DialogActions>
            </Dialog>
        </>
    );
    return (
        <h1>Rooms page</h1>
    )
}