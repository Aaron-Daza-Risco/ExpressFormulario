// src/components/admin/AdminDashboard.tsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Box, Container, Paper, Grid, Button } from '@mui/material';
import { CrearEncuesta } from './CrearEncuesta';
import { GestionarPreguntas } from './GestionarPreguntas';

export const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                component={Link}
                to="/admin/crear-encuesta"
              >
                Crear Nueva Encuesta
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/admin/gestionar-preguntas"
              >
                Gestionar Preguntas
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Routes>
            <Route path="crear-encuesta" element={<CrearEncuesta />} />
            <Route path="gestionar-preguntas" element={<GestionarPreguntas />} />
          </Routes>
        </Box>
      </Box>
    </Container>
  );
};