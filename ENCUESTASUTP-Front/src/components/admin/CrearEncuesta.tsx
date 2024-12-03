// src/components/admin/CrearEncuesta.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { cursosService } from '../../services/cursos.service';
import { encuestasService } from '../../services/encuestas.service';
import type { Curso } from '../../../types';

export const CrearEncuesta: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error', texto: string} | null>(null);
  const [encuestaData, setEncuestaData] = useState({
    nombre: '',
    curso_id: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await cursosService.obtenerAllCursos(); // Cambiar aquí
        setCursos(data);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
        setMensaje({ tipo: 'error', texto: 'Error al cargar los cursos' });
      }
    };
    fetchCursos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await encuestasService.crearEncuesta({
        ...encuestaData,
        curso_id: Number(encuestaData.curso_id)
      });
      setMensaje({ tipo: 'success', texto: 'Encuesta creada exitosamente' });
      setEncuestaData({
        nombre: '',
        curso_id: '',
        fecha_inicio: '',
        fecha_fin: ''
      });
    } catch (error) {
      console.error('Error al crear encuesta:', error);
      setMensaje({ tipo: 'error', texto: 'Error al crear la encuesta' });
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Crear Nueva Encuesta
      </Typography>

      {mensaje && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Nombre de la Encuesta"
          value={encuestaData.nombre}
          onChange={(e) => setEncuestaData({ ...encuestaData, nombre: e.target.value })}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Curso</InputLabel>
          <Select
            value={encuestaData.curso_id}
            label="Curso"
            onChange={(e) => setEncuestaData({ ...encuestaData, curso_id: e.target.value })}
            required
          >
            {cursos.map((curso) => (
              <MenuItem key={curso.id} value={curso.id}>
                {`${curso.nombre} - ${curso.carrera_nombre} (Ciclo ${curso.ciclo_numero})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          type="datetime-local"
          label="Fecha de Inicio"
          value={encuestaData.fecha_inicio}
          onChange={(e) => setEncuestaData({ ...encuestaData, fecha_inicio: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          type="datetime-local"
          label="Fecha de Fin"
          value={encuestaData.fecha_fin}
          onChange={(e) => setEncuestaData({ ...encuestaData, fecha_fin: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          Crear Encuesta
        </Button>
      </Box>
    </Paper>
  );
};