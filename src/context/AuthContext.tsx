import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
    usuario: Usuario | null;
    login: (usuario: Usuario) => void;
    logout: () => void;
    updateUsuario: (usuario: Usuario) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const salvo = localStorage.getItem('usuario');
        return salvo ? JSON.parse(salvo) : null;
    });

    const login = (usuario: Usuario) => {
        setUsuario(usuario);
        localStorage.setItem('usuario', JSON.stringify(usuario));
    };

    const logout = () =>{
        setUsuario(null);
        localStorage.removeItem('usuario');
    };

    const updateUsuario = (novoUsuario: Usuario) => {
        setUsuario(novoUsuario);
        localStorage.setItem('usuario', JSON.stringify(novoUsuario));
    };

    return (
        <AuthContext.Provider value = {{
            usuario,
            login,
            logout,
            updateUsuario,
            isAuthenticated: !!usuario
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error ('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};