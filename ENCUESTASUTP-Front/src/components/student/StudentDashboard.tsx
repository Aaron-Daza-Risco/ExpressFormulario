// src/components/student/StudentDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Button, 
  Typography, 
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import { ResponderEncuesta } from './ResponderEncuesta';
import { useAuth } from '../../contexts/AuthContext';
import { cursosService } from '../../services/cursos.service';
import { encuestasService } from '../../services/encuestas.service';
import type { Curso, Encuesta } from '../../../types';
import SchoolIcon from '@mui/icons-material/School';
import SurveyIcon from '@mui/icons-material/QuestionAnswer';

const UTP_PRIMARY_COLOR = '#003366'; // Ejemplo de color UTP
const UTP_SECONDARY_COLOR = '#FFCC00'; // Ejemplo de color UTP

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [encuestas, setEncuestas] = useState<{ [key: number]: Encuesta[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cursosData = await cursosService.obtenerAllCursos();
        setCursos(cursosData);
        const encuestasData: { [key: number]: Encuesta[] } = {};
        for (const curso of cursosData) {
          const encuestasCurso = await encuestasService.obtenerEncuestas(curso.id);
          encuestasData[curso.id] = encuestasCurso;
        }
        setEncuestas(encuestasData);
      } catch {
        setError('Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="secondary" />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center', color: UTP_PRIMARY_COLOR }}>
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography variant="h4" gutterBottom>
          Mis Cursos y Encuestas
        </Typography>
      </Box>
      
      {cursos.length === 0 ? (
        <Alert severity="info">No hay cursos disponibles</Alert>
      ) : (
        <Grid container spacing={4}>
          {cursos.map((curso) => (
            <Grid item xs={12} sm={6} md={4} key={curso.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `5px solid ${UTP_SECONDARY_COLOR}` }}>
                <CardContent>
                  <Typography variant="h6" color="UTP_PRIMARY_COLOR" gutterBottom>
                    {curso.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Carrera: {curso.carrera_nombre} <br />
                    Ciclo: {curso.ciclo_numero}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {encuestas[curso.id]?.length > 0 ? (
                      encuestas[curso.id].map((encuesta) => (
                        <Chip
                          key={encuesta.id}
                          icon={<SurveyIcon />}
                          label={encuesta.nombre}
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No hay encuestas pendientes
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/student/responder-encuesta/${curso.id}`}
                    disabled={!encuestas[curso.id]?.length}
                    sx={{ backgroundColor: UTP_PRIMARY_COLOR, '&:hover': { backgroundColor: UTP_SECONDARY_COLOR } }}
                  >
                    Ver Encuestas
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Routes>
        <Route path="responder-encuesta/:cursoId" element={<ResponderEncuesta />} />
      </Routes>
    </Container>
  );
};