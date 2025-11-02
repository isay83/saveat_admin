"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ISocialMedia {
  facebook?: string;
  x?: string;
  linkedin?: string;
  instagram?: string;
}

// Definimos la forma del objeto de usuario que guardamos
interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'gestor';
  profile_picture_url?: string;
  // --- AÑADE CAMPOS NUEVOS ---
  phone?: string;
  employeeId?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  socialMedia?: ISocialMedia;
  // --- FIN DE CAMPOS NUEVOS ---
}

// Definimos la forma del contexto
interface AuthContextType {
  token: string | null;
  user: AdminUser | null;
  isLoading: boolean; // Para saber si aún estamos cargando la info inicial
  login: (token: string, user: AdminUser, rememberMe: boolean) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<AdminUser>) => void; // Para actualizar perfil
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Creamos el Proveedor del contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Empezamos cargando
  const router = useRouter();
  // const pathname = usePathname(); // Para saber en qué ruta estamos

  // Efecto para cargar el estado inicial desde localStorage y sessionStorage
  useEffect(() => {
    try {
      let storedToken = localStorage.getItem('adminToken');
      let storedUser = localStorage.getItem('adminUser');

      if (!storedToken) {
        // Si no está en localStorage, revisa sessionStorage (sesión temporal)
        storedToken = sessionStorage.getItem('adminToken');
        storedUser = sessionStorage.getItem('adminUser');
      }

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      // Limpiar localStorage si hay error al parsear
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
    } finally {
      setIsLoading(false); // Terminamos de cargar
    }
  }, []); // Se ejecuta solo una vez al montar

  const login = useCallback((newToken: string, newUser: AdminUser, rememberMe: boolean) => {
    // Elige dónde guardar basado en el checkbox
    const storage = rememberMe ? localStorage : sessionStorage;

    try {
      storage.setItem('adminToken', newToken);
      storage.setItem('adminUser', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      router.push('/'); // Redirige al dashboard después del login
    } catch (error) {
      console.error("Error saving auth state to localStorage:", error);
    }
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
      setToken(null);
      setUser(null);
      router.push('/signin'); // Redirige al login después del logout
    } catch (error) {
      console.error("Error clearing auth state from localStorage:", error);
    }
  }, [router]);

  const updateUser = useCallback((updatedUserData: Partial<AdminUser>) => {
     setUser(prevUser => {
       if (!prevUser) return null;
       const newUser = { ...prevUser, ...updatedUserData };
       try {
        // Revisa cuál storage está en uso (primero el persistente)
        if (localStorage.getItem('adminToken')) {
          localStorage.setItem('adminUser', JSON.stringify(newUser));
        } else if (sessionStorage.getItem('adminToken')) {
          sessionStorage.setItem('adminUser', JSON.stringify(newUser));
        }
       } catch (error) {
         console.error("Error updating user in localStorage:", error);
       }
       return newUser;
     });
  }, []);


  const value = { token, user, isLoading, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
