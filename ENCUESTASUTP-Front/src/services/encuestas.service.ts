// src/services/encuestas.service.ts
import api from './api';
import type { Encuesta } from '../../types';

export const encuestasService = {
  obtenerPreguntas: async (encuesta_id: number) => {
    const response = await api.get(`/encuestas/${encuesta_id}/preguntas`);
    return response.data.data;
  },

  crearPregunta: async (encuesta_id: number, preguntaData: { pregunta: string }) => {
    const response = await api.post(
      `/encuestas/${encuesta_id}/preguntas`,
      preguntaData
    );
    return response.data;
  },

  eliminarPregunta: async (id: number) => {
    const response = await api.delete(`/encuestas/preguntas/${id}`);
    return response.data;
  },

  crearEncuesta: async (encuestaData: {
    nombre: string;
    curso_id: number;
    fecha_inicio: string;
    fecha_fin: string;
  }) => {
    const response = await api.post('/encuestas', encuestaData);
    return response.data;
  },

  obtenerEncuestas: async (curso_id?: number) => {
    const url = curso_id ? `/encuestas/curso/${curso_id}` : '/encuestas';
    const response = await api.get(url);
    return response.data;
  },

  obtenerEncuestasPendientes: async (curso_id: number): Promise<Encuesta[]> => {
    const response = await api.get(`/encuestas/curso/${curso_id}/pendientes`);
    return response.data;
  },

  enviarRespuesta: async (respuestaData: {
    pregunta_encuesta_id: number;
    respuesta: number;
  }) => {
    const response = await api.post('/encuestas/respuestas', respuestaData);
    return response.data;
  }
};