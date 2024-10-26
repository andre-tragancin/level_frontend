"use client";

import React, { useState } from 'react';
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
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDeleteGameMetrics, useGetGames } from '@/hooks/useGames';
import { useGetMetrics } from '@/hooks/useMetrics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePostGameMetrics } from '@/hooks/useGames';
import { Bell, Plus, Check, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Game() {
  const { data: games, isLoading: isLoadingGames, error: errorGames } = useGetGames();
  const { data: availableMetrics, isLoading, error } = useGetMetrics();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [metricToDelete, setMetricToDelete] = useState(null);
  const [gameIdToDelete, setGameIdToDelete] = useState(null);


  const { mutate: postGameMetrics, isLoading: isLoadingPost, isError: isPostError, isSuccess: isPostSuccess } = usePostGameMetrics();
  const { mutate: deleteGameMetrics, isLoading: isLoadingDelete, isError: isDeleteError, isSuccess: isDeleteSuccess } = useDeleteGameMetrics();


  const handleAddMetricClick = (game) => {
    setSelectedGame(game);
    setOpen(true);
  };

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    // console.log("Teste", value);

    setSelectedMetrics(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = () => {
    // console.log("Selected Metrics:", selectedMetrics);
    // console.log("Selected Game", selectedGame?.id)
    if (selectedGame?.id && selectedMetrics) {
      postGameMetrics(
        { game_id: selectedGame.id, metrics: selectedMetrics },
        {
          onSuccess: () => {
            toast.success('Success')
            setOpen(false);
            setOpenAddDialog(false);
          },
          onError: (error) => {
            toast.error('Erro ao adicionar métrica ' + error.message)
          }
        }
      )
    }
  };

  const handleDeleteGameMetrics = (metric, game_id) => {
    setOpenDeleteDialog(true)
    setMetricToDelete(metric)
    setGameIdToDelete(game_id)
    // deleteGameMetrics({game_id: game_id, metric_id:metric_id})
  }

  const handleConfirmDelete = () => {
    deleteGameMetrics(
      { game_id: gameIdToDelete, metric_id: metricToDelete.id },
      {
        onSuccess: () => {
          toast.success('Success')
          setOpenDeleteDialog(false);
        },
        onError: (error) => {
          toast.error('Erro ao deletar métrica ' + error.message)
        }
      }
    )
  }

  return (
    <div className='flex flex-col justify-center items-center w-3/4'>
      {games && games.map((game) => (
        <Accordion key={game.id} className='w-full'>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {game.name}
          </AccordionSummary>
          <AccordionDetails className='space-y-2'>
            <List className='space-y-2'>
              {game.metrics.length > 0 ? (
                game.metrics.map((metric) => (
                  <ListItem className='border' key={metric.id} secondaryAction={
                    <IconButton edge="end" aria-label='delete' onClick={() => handleDeleteGameMetrics(metric, game.id)}>
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
            <Button onClick={() => handleAddMetricClick(game)}>
              Adicionar Métrica
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Tive que usar o Dialog do MaterialUi aqui pq estava bugando o Select.
          Usei o Select do MaterialUI pq tem a prop multiple que facilitou nesse caso.
          Mantive o padrão nessa pagina de usar o Dialog do MaterialUI.    
      */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Metric to {selectedGame?.name}</DialogTitle>
        <DialogContent>
          <form className='space-y-4'>
            <Input
              label="Game Name"
              value={selectedGame?.name}
              disabled
            />
            <FormControl fullWidth variant='outlined'>
              <InputLabel id="select-metrics-label">Metrics</InputLabel>
              <Select
                labelId="select-metrics-label"
                id="select-metrics"
                multiple
                value={selectedMetrics}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Metrics" />}
                renderValue={(selectedIds) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedIds.map((id) => (
                      <Chip key={id} label={availableMetrics.find(metric => metric.id === id)?.name} />
                    ))}
                  </Box>
                )}
              >
                {isLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : error ? (
                  <MenuItem disabled>
                    <Typography color="error">Error loading metrics</Typography>
                  </MenuItem>
                ) : (
                  availableMetrics?.map((metric) => (
                    <MenuItem key={metric.id} value={metric.id}>
                      {metric.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpenAddDialog(true)}>Add Metric</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} >
        <DialogTitle>Confirm Addition</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to add the selected metrics to "{selectedGame?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Metrics</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Confirmar Exclusão de Métrica */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the metric "{metricToDelete?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
