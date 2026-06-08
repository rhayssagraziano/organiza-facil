import api from './api';
import type { Usuario } from '../types';

export const listarUsuarios = async (): Promise<Usuario[]> => {
    const response = await api.get('/api/usuarios');
    return response.data;
};

export const buscarUsuarioPorId = async (id: number): Promise<Usuario> => {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
};

export const criarUsuario = async (usuario: Usuario): Promise<Usuario> => {
    const response = await api.post('/api/usuarios', usuario);
    return response.data;
};

export const atualizarUsuario = async (id: number, dados: Record<string, string>): Promise<Usuario> => {
    const response = await api.put(`/api/usuarios/${id}`, dados);
    return response.data;
};

export const deletarUsuario = async (id: number): Promise<void> => {
    await api.delete(`/api/usuarios/${id}`);
};