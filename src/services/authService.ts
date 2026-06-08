import api from './api';
import type { Usuario } from '../types';

export const loginUsuario = async (email: string, senha: string): Promise<Usuario> => {
    const response = await api.post('/api/usuarios/login', { email, senha });
    return response.data;
};

export const loginComGoogle = async (accessToken: string): Promise<Usuario> => {
    const response = await api.post('/api/usuarios/google-login', { accessToken });
    return response.data;
};
