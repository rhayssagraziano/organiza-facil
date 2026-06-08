import api from './api';
import type { Objetivo } from '../types';


export const listarObjetivos = async (): Promise<Objetivo[]> => {
    const response = await api.get('/api/objetivos');
    return response.data;
};

export const listarObjetivosPorUsuario = async (usuarioId: number): Promise<Objetivo[]> => {
    const response = await api.get(`/api/objetivos/usuario/${usuarioId}`);
    return response.data;
};

export const listarObjetivosPorPrioridade = async (usuarioId: number, prioridade: string): Promise<Objetivo[]> => {
    const response = await api.get(`/api/objetivos/usuario/${usuarioId}/prioridade/${prioridade}`);
    return response.data;
};

export const buscarObjetivoPorId = async (id: number): Promise<Objetivo> => {
    const response = await api.get(`/api/objetivos/${id}`);
    return response.data;
};

export const criarObjetivo = async (objetivo: Objetivo): Promise<Objetivo> => {
    const response = await api.post('/api/objetivos', objetivo);
    return response.data;
};

export const criarObjetivoDivida = async (despesaId: number): Promise<Objetivo> => {
    const response = await api.post(`/api/objetivos/criar-de-divida/${despesaId}`);
    return response.data;
};

export const atualizarObjetivo = async (id: number, objetivo: Objetivo): Promise<Objetivo> => {
    const response = await api.put(`/api/objetivos/${id}`, objetivo);
    return response.data;
};

export const deletarObjetivo = async (id: number): Promise<void> => {
    await api.delete(`/api/objetivos/${id}`);
};