// src/services/auth.service.ts
import api from './api';

export const authService = {
  login: async (username: string, password: string, tipo: 'admin' | 'student') => {
    try {
      const response = await api.post('/auth/signin', { 
        username, 
        password, 
        tipo 
      });
      // Guarda el token en localStorage
      localStorage.setItem('token', response.data.accessToken);
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  register: async (userData: { 
    username: string; 
    password: string; 
    email?: string 
  }, tipo: 'admin' | 'student') => {
    try {
      const response = await api.post(`/auth/signup/${tipo}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }
};