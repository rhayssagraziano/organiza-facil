import api from './api';
import type { Receita } from '../types';

export const listarReceitas = async (): Promise<Receita[]> => {
    const response = await api.get(`/api/receitas`);
    return response.data;
};

export const listarReceitasPorUsuario = async (usuarioId: number): Promise<Receita[]> => {
    const response = await api.get(`/api/receitas/usuario/${usuarioId}`);
    return response.data;
};

export const buscarReceitaPorId = async (id: number): Promise<Receita> => {
    const response = await api.get(`api/receitas/${id}`);
    return response.data;
};

export const criarReceita = async (receita: Receita): Promise<Receita> => {
    const response = await api.post(`/api/receitas`, receita);
    return response.data;
};

export const atualizarReceita = async (id: number, receita: Receita): Promise<Receita> => {
    const response = await api.put(`/api/receitas/${id}`, receita);
    return response.data;
};

export const deletarReceita = async (id: number): Promise<void> =>{
    await api.delete(`/api/receitas/${id}`)

};