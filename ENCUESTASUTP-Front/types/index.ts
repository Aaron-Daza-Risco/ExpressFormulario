// src/types/index.ts

// Tipos existentes
export interface Curso {
  id: number;
  nombre: string;
  ciclo_id: number;
  carrera_id: number;
  carrera_nombre?: string; // Nuevo campo
  ciclo_numero?: number;   // Nuevo campo
}

export interface Encuesta {
  id: number;
  nombre: string;
  curso_id: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface Pregunta {
  id: number;
  encuesta_id: number;
  pregunta: string;
  administrador_id: number;
}

export interface Respuesta {
  id: number;
  pregunta_encuesta_id: number;
  estudiante_id: number;
  respuesta: number;
  fecha: string;
}

// Nuevos tipos
export interface Carrera {
  id: number;
  nombre: string;
}

export interface Ciclo {
  id: number;
  numero: number;
  carrera_id: number;
}

export interface Administrador {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol_id: number;
}

export interface Estudiante {
  id: number;
  username: string;
  nombre: string;
  email: string;
  carrera_id: number;
  ciclo_id: number;
  rol_id: number;
}

export interface Rol {
  id: number;
  nombre: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  tipo: 'admin' | 'student';
}

export interface RegisterData extends Omit<LoginCredentials, 'tipo'> {
  nombre: string;
  email: string;
  carrera_id?: number;
  ciclo_id?: number;
  rol_id: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}