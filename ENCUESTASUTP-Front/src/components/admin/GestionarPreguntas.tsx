// src/components/admin/GestionarPreguntas.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { encuestasService } from '../../services/encuestas.service';
import type { Encuesta, Pregunta } from '../../../types';

export const GestionarPreguntas: React.FC = () => {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [selectedEncuesta, setSelectedEncuesta] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [mensaje, setMensaje] = useState<{tipo: 'success' | 'error', texto: string} | null>(null);

  useEffect(() => {
    const fetchEncuestas = async () => {
      try {
        const data = await encuestasService.obtenerEncuestas();
        setEncuestas(data);
      } catch (error) {
        console.error('Error al cargar encuestas:', error);
        setMensaje({ tipo: 'error', texto: 'Error al cargar las encuestas' });
      }
    };
    fetchEncuestas();
  }, []);

  useEffect(() => {
    const fetchPreguntas = async () => {
      if (selectedEncuesta) {
        try {
          const data = await encuestasService.obtenerPreguntas(Number(selectedEncuesta));
          setPreguntas(data);
        } catch (error) {
          console.error('Error al cargar preguntas:', error);
          setMensaje({ tipo: 'error', texto: 'Error al cargar las preguntas' });
        }
      }
    };
    fetchPreguntas();
  }, [selectedEncuesta]);
  
  // Al crear una nueva pregunta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEncuesta || !pregunta) return;
  
    try {
      await encuestasService.crearPregunta(Number(selectedEncuesta), { pregunta });
      setPregunta('');
      // Actualizar la lista de preguntas
      const updatedPreguntas = await encuestasService.obtenerPreguntas(Number(selectedEncuesta));
      setPreguntas(updatedPreguntas);
      setMensaje({ tipo: 'success', texto: 'Pregunta creada exitosamente' });
    } catch (error) {
      console.error('Error al crear pregunta:', error);
      setMensaje({ tipo: 'error', texto: 'Error al crear la pregunta' });
    }
  };

  const handleDeletePregunta = async (id: number) => {
    try {
      await encuestasService.eliminarPregunta(id);
      setPreguntas(preguntas.filter(p => p.id !== id));
      setMensaje({ tipo: 'success', texto: 'Pregunta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar pregunta:', error);
      setMensaje({ tipo: 'error', texto: 'Error al eliminar la pregunta' });
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gestionar Preguntas
      </Typography>

      {mensaje && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel>Seleccionar Encuesta</InputLabel>
        <Select
          value={selectedEncuesta}
          label="Seleccionar Encuesta"
          onChange={(e) => setSelectedEncuesta(e.target.value)}
        >
          {encuestas.map((encuesta) => (
            <MenuItem key={encuesta.id} value={encuesta.id}>
              {encuesta.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Nueva Pregunta"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!selectedEncuesta}
        >
          Agregar Pregunta
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Preguntas Existentes
      </Typography>

      <List>
        {preguntas.map((pregunta) => (
          <ListItem key={pregunta.id}>
            <ListItemText primary={pregunta.pregunta} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeletePregunta(pregunta.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};