// Exemplo de dados fakes
const fakeMetrics = [
    { id: 1, name: 'Métrica A' },
    { id: 2, name: 'Métrica B' },
    { id: 3, name: 'Métrica C' },
    { id: 4, name: 'Métrica D' },
  ];
  
  // Componente com Select usando dados fakes
  import React, { useState } from 'react';
  import { Select, MenuItem, Chip, OutlinedInput, Box, CircularProgress, Typography } from '@mui/material';
  
  const TestSelect = () => {
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const isLoading = false; // Simulando que os dados estão prontos
    const error = false; // Simulando que não há erro
    const availableMetrics = fakeMetrics; // Usando os dados fakes
  
    const handleSelectChange = (event) => {
      const { target: { value } } = event;
      setSelectedMetrics(value);
    };
  
    return (
      <Select
        labelId="select-metrics-label"
        id="select-metrics"
        multiple
        value={selectedMetrics}
        onChange={handleSelectChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
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
          availableMetrics.map((metric) => (
            <MenuItem key={metric.id} value={metric.name}>
              {metric.name}
            </MenuItem>
          ))
        )}
      </Select>
    );
  };
  
  export default TestSelect;
  