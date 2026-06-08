import api from './api';
import type { Despesa } from '../types';

export const listarDespesas = async (): Promise<Despesa[]> => {
    const response = await api.get(`/api/despesas`);
    return response.data;
};

export const listarDespesasPorUsuario = async (usuarioId: number): Promise<Despesa[]> => {
    const response = await api.get(`/api/despesas/usuario/${usuarioId}`);
    return response.data;
};

export const listarDespesasPorTipo = async (usuarioId: number, tipo: string): Promise<Despesa[]> => {
    const response = await api.get(`/api/despesas/usuario/${usuarioId}/tipo/${tipo}`);
    return response.data;
};

export const listarParcelas = async (usuarioId: number): Promise<Despesa[]> => {
    const response = await api.get(`/api/despesas/usuario/${usuarioId}/parcelas`)
    return response.data;
};

export const buscarDespesaPorId = async (id: number): Promise<Despesa> => {
    const response = await api.get(`/api/despesas/${id}`);
    return response.data;
};

export const criarDespesa = async (despesa: Despesa): Promise<Despesa> => {
    const response = await api.post(`/api/despesas`, despesa);
    return response.data;
};

export const atualizarDespesa = async (id: number, despesa: Despesa): Promise<Despesa> => {
    const response = await api.put(`/api/despesas/${id}`, despesa);
    return response.data;
};

export const deletarDespesa = async (id: number): Promise<void> => {
    await api.delete(`/api/despesas/${id}`);
};

export const gerarPlanoQuitacao = async (usuarioId: number, valorDisponivel: number): Promise<string> => {
    const response = await api.get(`/api/despesas/plano-quitacao/${usuarioId}`, {
        params: { valorDisponivel }
    });
    return response.data;
};


