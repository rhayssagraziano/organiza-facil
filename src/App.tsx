import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import type { ReactNode } from 'react';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import ReceitasPage from './pages/ReceitasPage';
import DespesasPage from './pages/DespesasPage';
import ObjetivosPage from './pages/ObjetivosPage';
import PerfilPage from './pages/PerfilPage';
import PlanoAcaoPage from './pages/PlanoAcaoPage';
import AvatarCustomizerPage from './pages/AvatarCustomizerPage';
import NotFoundPage from './pages/NotFoundPage';

// Apenas usuários NÃO autenticados passam — autenticados vão para /dashboard
const PublicOnly = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// Apenas usuários autenticados passam — não autenticados vão para /
const RotaProtegida = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicOnly>
            <LandingPage />
          </PublicOnly>
        } />
        <Route path="/login" element={
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        } />
        <Route path="/cadastro" element={<RegisterPage />} />

        <Route path="/dashboard" element={
          <RotaProtegida>
            <DashboardPage />
          </RotaProtegida>
        } />

        <Route path="/onboarding" element={
          <RotaProtegida>
            <OnboardingPage />
          </RotaProtegida>
        } />

        <Route path="/receitas" element={
          <RotaProtegida>
            <ReceitasPage />
          </RotaProtegida>
        } />

        <Route path="/despesas" element={
          <RotaProtegida>
            <DespesasPage />
          </RotaProtegida>
        } />

        <Route path="/objetivos" element={
          <RotaProtegida>
            <ObjetivosPage />
          </RotaProtegida>
        } />

        <Route path="/perfil" element={
          <RotaProtegida>
            <PerfilPage />
          </RotaProtegida>
        } />

        <Route path="/plano-acao" element={
          <RotaProtegida>
            <PlanoAcaoPage />
          </RotaProtegida>
        } />

        <Route path="/avatar" element={
          <RotaProtegida>
            <AvatarCustomizerPage />
          </RotaProtegida>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
