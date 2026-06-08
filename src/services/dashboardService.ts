import api from './api';
import type { DashboardDTO } from '../types';

export const gerarDashboard = async (usuarioId: number): Promise<DashboardDTO> => {
    const response = await api.get(`/api/dashboard/${usuarioId}`);
    return response.data;
};