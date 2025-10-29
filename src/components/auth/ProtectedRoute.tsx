"use client";

import React, { useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'gestor')[]; // Opcional: roles específicos permitidos
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Definimos las rutas públicas (donde NO se requiere login)
  const publicPaths = ['/signin', '/signup']; // Añade '/reset-password' si la creas

  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // Si aún está cargando el estado inicial, no hacemos nada
    if (isLoading) {
      return;
    }

    // Caso 1: Usuario NO logueado intenta acceder a ruta protegida
    if (!token && !isPublicPath) {
      console.log("Redirecting to signin (not logged in, accessing protected)");
      router.push('/signin');
    }

    // Caso 2: Usuario SI logueado intenta acceder a ruta pública (login/signup)
    if (token && isPublicPath) {
      console.log("Redirecting to dashboard (logged in, accessing public)");
      router.push('/');
    }

    // Caso 3: (Opcional) Verificar roles si se especificaron
    if (token && !isPublicPath && allowedRoles && user && !allowedRoles.includes(user.role)) {
       console.log(`Redirecting to / (role not allowed: ${user.role})`);
       // Podrías redirigir a una página de "No autorizado" o al dashboard
       router.push('/');
    }

  }, [token, user, isLoading, router, pathname, isPublicPath, allowedRoles]);

  // Mientras carga, puedes mostrar un spinner o nada
  if (isLoading) {
    return <div>Cargando...</div>; // O un componente Spinner
  }

  // Si está logueado y accede a pública, o no logueado y accede a protegida,
  // la redirección se manejará en el useEffect. Mientras tanto, evitamos renderizar.
  if ((!token && !isPublicPath) || (token && isPublicPath)) {
     // Mostramos carga mientras redirige para evitar flashes de contenido incorrecto
     return <div>Cargando...</div>;
  }

  // Si todo está bien (logueado en ruta protegida, o no logueado en pública),
  // renderizamos el contenido
  return <>{children}</>;
};

export default ProtectedRoute;
