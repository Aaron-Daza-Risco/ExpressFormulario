// src/services/cursos.service.ts
import api from './api';
import type { Curso, ApiResponse } from '../../types';

export const cursosService = {
  obtenerCursos: async (carrera_id?: number, ciclo_id?: number): Promise<Curso[]> => {
    const url = carrera_id && ciclo_id 
      ? `/cursos?carrera_id=${carrera_id}&ciclo_id=${ciclo_id}`
      : '/cursos';
    const response = await api.get<ApiResponse<Curso[]>>(url);
    return response.data.data || [];
  },

  obtenerAllCursos: async (): Promise<Curso[]> => {
    const response = await api.get<ApiResponse<Curso[]>>('/cursos/all');
    return response.data.data || [];
  },

  obtenerCursosByStudent: async (): Promise<Curso[]> => {
    const response = await api.get<ApiResponse<Curso[]>>('/cursos/student');
    return response.data.data || []; // Ajuste según la estructura de la respuesta
  },

  crearCurso: async (cursoData: Omit<Curso, 'id'>): Promise<ApiResponse<Curso>> => {
    const response = await api.post<ApiResponse<Curso>>('/cursos', cursoData);
    return response.data;
  }
};