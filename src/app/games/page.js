"use client"

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGetGames } from '@/hooks/useGames';
import { Pen, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogHeader, DialogDescription, DialogClose } from '@/components/ui/dialog';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import axios from "../../lib/axios"
import { useQueryClient } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { useGetMetrics } from '@/hooks/useMetrics';
import { usePostGameMetrics } from '@/hooks/useGames';
import { useDeleteGameMetrics } from '@/hooks/useGames';
import { selectedMetricIds } from '@/lib/utils/metricConfig';

export default function Games() {
    const { data, isLoading, error } = useGetGames();
    const [open, setOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [gameName, setGameName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [gameId, setGameId] = useState(null);
    const [gameToken, setGameToken] = useState(null)
    const [actionType, setActionType] = useState('');
    const searchParams = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameToEdit, setGameToEdit] = useState(null)
    const { data: dataMetrics, isLoading: isMetricsLoading } = useGetMetrics();
    const [selectedMetrics, setSelectedMetrics] = useState('')

    const { mutate: postGameMetrics } = usePostGameMetrics();
    const { mutate: deleteGameMetrics } = useDeleteGameMetrics();
    const queryClient = useQueryClient();

    useEffect(() => {
        // Abrir o modal se o parâmetro showModal estiver presente
        if (searchParams.get('showModal') === 'true') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!isLoading && gameId) {
            const game = data.find(item => item.id === gameId)
            // console.log("GAME TO EDIT", game)
            setGameToEdit(game)
        }
    }, [data, gameId])

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('/games/', { name: gameName });
            // console.log('Game added:', response.data);
            if (response.status === 200) {
                toast.success('Success')
                queryClient.invalidateQueries(['games']);
            }
        } catch (error) {
            console.error('Failed to add game:', error);
        }
        setGameName('')
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(`/games/${gameId}`, { name: gameName });
            if (response.status === 200) {
                toast.success('Success')
                // console.log('Game updated:', response.data);
                queryClient.invalidateQueries(['games']);  // Atualizar a lista de jogos
            }
        } catch (error) {
            console.error('Failed to update game:', error);
        }
        setEditMode(false)
        setGameName('')
    };

    const handleMetricSubmit = (event) => {
        event.preventDefault()
        // console.log("Selected Metrics:", selectedMetrics);
        // console.log("Selected Game", gameToEdit?.id)
        if (gameToEdit?.id && selectedMetrics) {
            postGameMetrics(
                { game_id: gameToEdit.id, metrics: selectedMetrics },
                {
                    onSuccess: () => {
                        toast.success('Success')
                    },
                    onError: (error) => {
                        toast.error('Erro ao adicionar métrica ' + error.message)
                    }
                }
            )
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            const response = await axios.delete(`/games/${gameId}`);
            if (response.status === 200) {
                toast.success('Success')
                // console.log('Game deleted:', response.data);
                queryClient.invalidateQueries(['games']);
            }
        } catch (error) {
            console.error('Failed to delete game:', error);
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

    // const options = selectedMetrics?.map(game => {

    //     return {
    //         value: game,
    //         label: game.name,
    //         id: game.id,
    //     }
    // });

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

    const handleEdit = (id, currentName, token) => {
        // const game = data.find(item => item.id === id)

        // console.log(`Editing game with ID: ${id}`);
        // console.log("TOKEN", token)
        setEditMode(true);
        setGameId(id);
        setGameName(currentName);
        setGameToken(token)
        setOpen(true);
        // setGameToEdit(game)
        // console.log("Game To Edit", game)
    };

    const handleCopyToken = () => {
        if (gameToken) {
            navigator.clipboard.writeText(gameToken) // Copia o token para a área de transferência
                .then(() => {
                    alert('Token copiado para a área de transferência!'); // Alerta opcional
                })
                .catch(err => {
                    console.error('Erro ao copiar o token: ', err);
                });
        }
    };

    const handleDelete = async (id) => {
        // console.log(`Delete game with ID: ${id}`)
        setGameId(id)
        handleOpenConfirmation('delete')
    }

    const handleDeleteGameMetrics = (metric_id, game_id) => {
        // setOpenDeleteDialog(true)
        // setMetricToDelete(metric)
        // setGameIdToDelete(game_id)
        deleteGameMetrics({ game_id: game_id, metric_id: metric_id })
        // console.log("DELETE", metric_id, game_id)
    }

    const handleCloseDialog = () => {
        setGameName('')
        setSelectedMetrics('')
        setEditMode(false)
        setOpen(false)
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
            <Dialog open={open} onClose={handleCloseDialog} maxWidth='xs' fullWidth={true}>
                <DialogTitle>{editMode ? 'Editar Jogo' : 'Adicionar Jogo'}</DialogTitle>
                <DialogContent>
                    <form>
                        <Input
                            label="Game Name"
                            placeholder="Nome do jogo"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            className='mt-2'
                        />
                        {editMode && gameToEdit && (
                            <div className="mt-4">
                                <Label className="block mb-1">Token</Label>
                                <div className="flex items-center">
                                    <Input
                                        value={gameToken}
                                        disabled
                                        className="mr-2 flex-1" // Estilo opcional para espaço entre o input e o ícone
                                    />
                                    <Button type="button" onClick={handleCopyToken} className="flex items-center">
                                        <Copy size={16} />
                                    </Button>
                                </div>
                                <Accordion key={gameToEdit.id} className='w-full'>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        {/* {gameToEdit.name} */}
                                        Adicionar Métricas
                                    </AccordionSummary>
                                    <AccordionDetails className='space-y-2'>
                                        <div className='flex items-center space-x-2'>
                                            <FormControl fullWidth>
                                                <InputLabel id="select-label">Métricas</InputLabel>
                                                <Select
                                                    labelId="select-label"
                                                    id="select"
                                                    value={selectedMetrics}  // Este será o valor atual selecionado
                                                    label="Métricas"
                                                    onChange={(event) => setSelectedMetrics(event.target.value)} // Atualiza o estado com a métrica selecionada
                                                >
                                                    {/* {dataMetrics?.map((metric) => (
                                                        <MenuItem key={metric.id} value={metric.id}>
                                                            {metric.name}
                                                        </MenuItem>
                                                    ))} */}
                                                    {dataMetrics
                                                        ?.filter((metric) => selectedMetricIds.includes(metric.id) || metric.id > 428)
                                                        .map((metric) => (
                                                            <MenuItem key={metric.id} value={metric.id}>
                                                                {metric.name}
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                            <Button onClick={handleMetricSubmit}>
                                                Adicionar Métrica
                                            </Button>

                                        </div>
                                        <List className='space-y-2'>
                                            {gameToEdit.metrics.length > 0 ? (
                                                gameToEdit.metrics.map((metric) => (
                                                    <ListItem className='border' key={metric.id} secondaryAction={
                                                        <IconButton edge="end" aria-label='delete' onClick={() => handleDeleteGameMetrics(metric.id, gameToEdit.id)}>
                                                            <Trash2 />
                                                        </IconButton>
                                                    }>
                                                        <div>
                                                            {metric.name}
                                                            {metric.expression && (
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {metric.expression}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </ListItem>
                                                ))
                                            ) : (
                                                <ListItem className='border'>
                                                    Jogo sem métrica.
                                                </ListItem>
                                            )}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        )}
                    </form>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>

                    <Button onClick={() => handleOpenConfirmation(editMode ? 'edit' : 'add')}>
                        {editMode ? 'Salvar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                <DialogTitle>{actionType === 'delete' ? 'Excluir Jogo?' : actionType === 'edit' ? 'Salvar Alterações?' : 'Adicionar Jogo?'}</DialogTitle>
                <DialogContent>
                    <p>
                        {actionType === 'delete'
                            ? 'Você realmente deseja excluir este jogo?'
                            : actionType === 'edit'
                                ? `Você realmente deseja editar o jogo "${gameName}"?`
                                : `Você realmente deseja criar o jogo "${gameName}"?`}
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)}>Cancelar</Button>
                    <Button onClick={handleConfirmationSubmit}>Confirmar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTitle>Seja bem-vindo, Dev!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Nesta página, você poderá criar e editar os seus jogos. Vamos lá?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Vamos lá!</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
