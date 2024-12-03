// src/components/student/ResponderEncuesta.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormControl,
  FormLabel,
  Alert,
  Stack,
  CircularProgress,
  Container,
  LinearProgress,
} from '@mui/material';
import { encuestasService } from '../../services/encuestas.service';
import type { Encuesta, Pregunta } from '../../../types';

export const ResponderEncuesta: React.FC = () => {
  const { cursoId } = useParams<{ cursoId: string }>();
  const navigate = useNavigate();
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<{ [key: number]: number }>({});
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEncuesta = async () => {
      if (cursoId) {
        try {
          const encuestas = await encuestasService.obtenerEncuestas(Number(cursoId));
          if (encuestas && encuestas.length > 0) {
            const encuestaActual = encuestas[0];
            setEncuesta(encuestaActual);
            const preguntasData = await encuestasService.obtenerPreguntas(encuestaActual.id);
            setPreguntas(preguntasData);
          } else {
            setEncuesta(null);
          }
        } catch (error) {
          console.error('Error al cargar la encuesta:', error);
          setMensaje({ tipo: 'error', texto: 'Error al cargar la encuesta' });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEncuesta();
  }, [cursoId]);

  const handleRespuestaChange = (preguntaId: number, valor: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: Number(valor),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encuesta) return;

    try {
      const promesas = Object.entries(respuestas).map(([preguntaId, respuesta]) => {
        return encuestasService.enviarRespuesta({
          pregunta_encuesta_id: Number(preguntaId),
          respuesta,
        });
      });

      await Promise.all(promesas);
      setMensaje({ tipo: 'success', texto: 'Encuesta enviada exitosamente' });
      setRespuestas({});
      setTimeout(() => {
        navigate('/student');
      }, 2000);
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
      setMensaje({ tipo: 'error', texto: 'Error al enviar las respuestas' });
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!encuesta) {
    return (
      <Container>
        <Box sx={{ p: 3 }}>
          <Typography>No hay encuestas disponibles para este curso</Typography>
        </Box>
      </Container>
    );
  }

  const totalPreguntas = preguntas.length;
  const respuestasCompletadas = Object.keys(respuestas).length;
  const progreso = (respuestasCompletadas / totalPreguntas) * 100;

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            {encuesta.nombre}
          </Typography>

          <LinearProgress variant="determinate" value={progreso} sx={{ mb: 3 }} />

          {mensaje && (
            <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
              {mensaje.texto}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {preguntas.map((pregunta) => (
                <Box key={pregunta.id}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">{pregunta.pregunta}</FormLabel>
                    <RadioGroup
                      row
                      value={respuestas[pregunta.id] || ''}
                      onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="Muy en desacuerdo" />
                      <FormControlLabel value="2" control={<Radio />} label="En desacuerdo" />
                      <FormControlLabel value="3" control={<Radio />} label="Neutral" />
                      <FormControlLabel value="4" control={<Radio />} label="De acuerdo" />
                      <FormControlLabel value="5" control={<Radio />} label="Muy de acuerdo" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={preguntas.length !== Object.keys(respuestas).length}
              >
                Enviar Respuestas
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};