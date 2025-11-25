"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import SearchBar from "@/components/header/SearchBar"; // <-- IMPORTAR NUEVO COMPONENTE

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        
        {/* --- SECCIÓN IZQUIERDA: Toggle y Logo Móvil --- */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          
          {/* Botón de Menú Hamburguesa */}
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border hover:text-gray-700 dark:hover:text-white transition-colors"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
             {/* Icono condicional (Hamburguesa o Flecha) */}
             {isMobileOpen ? (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             ) : (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             )}
          </button>

          {/* Logo (Solo Visible en Móvil) */}
          <Link href="/" className="lg:hidden block">
            <Image
              width={130}
              height={32}
              src="/images/logo/logo-dark.svg" // Asegúrate de tener un logo aquí
              alt="Logo"
              className="dark:hidden"
            />
             <Image
              width={130}
              height={32}
              src="/images/logo/logo-white.svg" // Y aquí
              alt="Logo"
              className="hidden dark:block"
            />
          </Link>

          {/* --- AQUÍ VA LA BARRA DE BÚSQUEDA --- */}
          <div className="hidden lg:block w-full max-w-md ml-4">
             <SearchBar />
          </div>
        </div>

        {/* --- SECCIÓN DERECHA: Acciones --- */}
        <div className="flex items-center justify-end w-full gap-4 px-5 py-4 lg:w-auto lg:px-0">
           {/* Botón de Búsqueda (Solo Móvil - Opcional) */}
           <button className="lg:hidden text-gray-500 hover:text-gray-700">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </button>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Toggle de Tema */}
            <ThemeToggleButton />
            
            {/* Notificaciones */}
            <NotificationDropdown />
          </div>

          {/* Separador Vertical */}
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

          {/* Menú de Usuario */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;