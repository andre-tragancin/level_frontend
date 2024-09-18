"use client";

import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGetMetrics } from '@/hooks/useMetrics'; // Hook para pegar as métricas
import { Pen, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select'; // Exemplo para o select
import axios from "../../lib/axios";
import { Box, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

export default function Metrics() {
    const { data, isLoading, error } = useGetMetrics(); // Hook de consulta das métricas
    const [open, setOpen] = useState(false);
    const [metricName, setMetricName] = useState('');
    const [metricType, setMetricType] = useState('simple'); // Simples por padrão
    const [expression, setExpression] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [metricId, setMetricId] = useState(null);

    const queryClient = useQueryClient();

    const handleSubmit = async () => {
        try {
            const payload = { name: metricName };
            if (metricType === 'composed') {
                payload.expression = expression;
            }
            const response = await axios.post('/metrics/', payload);
            console.log('Metric added:', response.data);
            setOpen(false);
            queryClient.invalidateQueries(['metrics']);
        } catch (error) {
            console.error('Failed to add metric:', error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const payload = { name: metricName };
            if (metricType === 'composed') {
                payload.expression = expression;
            }
            const response = await axios.put(`/metrics/${metricId}`, payload);
            console.log('Metric updated:', response.data);
            setOpen(false);
            queryClient.invalidateQueries(['metrics']); // Atualizar a lista de métricas
        } catch (error) {
            console.error('Failed to update metric:', error);
        }
    };

    const handleEdit = (id, currentName, currentExpression, type) => {
        setEditMode(true);
        setMetricId(id);
        setMetricName(currentName);
        setExpression(type === 'composed' ? currentExpression : '');
        setMetricType(type); // Definir o tipo de métrica
        setOpen(true);
    };

    const handleDelete = async (metricId) => {
        try {
            const response = await axios.delete(`/metrics/${metricId}`);
            console.log('Metric deleted:', response.data);
            queryClient.invalidateQueries(['metrics']);
        } catch (error) {
            console.error('Failed to delete metric:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', flex: 'auto' },
        { field: 'name', headerName: 'Name', flex: 1 },
        { 
            field: 'expression', 
            headerName: 'Expression', 
            flex: 1,
            // renderCell: (params) => (
            //     <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            //         {params.value}
            //     </div>
            // ),
        }, 
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            align: 'right',
            flex: 1,
            renderCell: (params) => (
                <div className='flex justify-end items-center h-full space-x-1'>
                    <Pen
                        onClick={() => handleEdit(params.row.id, params.row.name, params.row.expression, params.row.expression ? 'composed' : 'simple')}
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

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error.message}</p>;

    const availableMetrics = data?.filter(metric => !metric.expression) || [];

    const addToExpression = (metricName) => {
        setExpression((prev) => `${prev} ${metricName}`);
    };

    const getRowHeight = (params) => {
        const expression = params.model.expression || ''; // Trata valores nulos
        const lineLengthThreshold = 15; // Comprimento limite do texto
      
        // Se o texto for maior que o limite, use altura automática
        console.log("LENGHT", expression.length)
        if (expression.length > lineLengthThreshold) {
          return 'auto'; // Calcula a altura baseada no conteúdo
        }
      
        return null; // Aplica a altura padrão se for menor
    };

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
                        getRowHeight={getRowHeight}
                        // autosizeOnMount
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
                        <DialogTitle>{editMode ? 'Edit Metric' : 'Add a New Metric'}</DialogTitle>
                    </DialogHeader>

                    <form className='space-y-2'>
                        <Input
                            label="Metric Name"
                            placeholder="Enter the metric name"
                            value={metricName}
                            onChange={(e) => setMetricName(e.target.value)}
                        />
                        <Select value={metricType} onValueChange={setMetricType} disabled={editMode}>
                            <SelectTrigger>
                                {/* Trigger content */}
                                {metricType === 'simple' ? 'Simple' : 'Composed'}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="simple">Simple</SelectItem>
                                <SelectItem value="composed">Composed</SelectItem>
                            </SelectContent>
                        </Select>
                        {metricType === 'composed' && (
                            <>
                                <Input
                                    label="Expression"
                                    placeholder="Enter the expression"
                                    value={expression}
                                    onChange={(e) => setExpression(e.target.value)}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                                    {availableMetrics.length > 0 && (
                                        <div>
                                            <strong>Available Metrics:</strong>
                                            <List className='border border-zinc-200'>
                                                {availableMetrics.map((metric) => (
                                                    <ListItem
                                                        // component='button'
                                                        
                                                        key={metric.id}
                                                        // onClick={() => addToExpression(metric.name)}
                                                        // onClick={() => console.log("TESTE")}
                                                    >
                                                        <ListItemButton onClick={() => addToExpression(metric.name)}>
                                                            <ListItemText primary={metric.name} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </div>
                                    )}
                                </Box>
                            </>
                        )}
                    </form>

                    <DialogFooter>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={editMode ? handleEditSubmit : handleSubmit}>
                            {editMode ? 'Save Changes' : 'Add Metric'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}