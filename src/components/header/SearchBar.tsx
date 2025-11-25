"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BoltIcon, BoxCubeIcon, BoxIcon, ChatIcon, DocsIcon, GridIcon, GroupIcon, LogoIcon, PieChartIcon, TableIcon, UserCircleIcon } from "@/icons"; // Importa tus iconos

// Definimos el tipo de resultado de búsqueda
interface SearchResult {
  title: string;
  path: string;
  icon: React.ReactNode;
  type: "Page" | "Action";
}

// Lista de páginas disponibles (puedes expandir esto luego con datos de la API)
const searchablePages: SearchResult[] = [
    // PAGES
  { title: "Home", path: "/", icon: <GridIcon className="w-6 h-6" />, type: "Page" },
  { title: "Inventory", path: "/inventory", icon: <BoxCubeIcon className="w-6 h-6" />, type: "Page" },
  { title: "Donors", path: "/donors", icon: <GroupIcon className="w-6 h-6" />, type: "Page" },
  { title: "Reservations", path: "/reservations", icon: <BoxIcon className="w-6 h-6" />, type: "Page" },
  // Account
  { title: "User Profile", path: "/profile", icon: <UserCircleIcon className="w-6 h-6" />, type: "Page" },
  // Dashboard
  { title: "Food Bank Dashboard", path: "/food-bank", icon: <LogoIcon className="w-6 h-6" />, type: "Page" },
  { title: "INEGI Data Dashboard", path: "/inegi", icon: <PieChartIcon className="w-6 h-6" />, type: "Page" },
  { title: "Social Media Trends Dashboard", path: "/social-trends", icon: <ChatIcon className="w-6 h-6" />, type: "Page" },
  { title: "Internal Goals Excel Dashboard", path: "/excel-data", icon: <TableIcon className="w-6 h-6" />, type: "Page" },
  { title: "Web Market Analysis Dashboard", path: "/web-data", icon: <DocsIcon className="w-6 h-6" />, type: "Page" },
  { title: "Weather Logistics Dashboard", path: "/weather", icon: <BoltIcon className="w-6 h-6" />, type: "Page" },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Manejar el atajo de teclado (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      // Cerrar con Escape
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Manejar clics fuera para cerrar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica de búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Filtrar páginas (aquí podrías también llamar a tu API de productos)
    const filtered = searchablePages.filter(page => 
      page.title.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(true);
  };

  const handleSelect = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setQuery(""); // Limpiar búsqueda
  };

  return (
    <div className="hidden lg:block relative w-full max-w-md">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          {/* Icono de Lupa */}
          <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" fill="currentColor" />
            </svg>
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search (Ctrl+K)..."
            value={query}
            onChange={handleSearch}
            onFocus={() => query && setIsOpen(true)}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
          />

          {/* Atajo de Teclado */}
          <button 
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
          >
            <span className="text-xs">⌘</span> K
          </button>
        </div>
      </form>

      {/* Dropdown de Resultados */}
      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} className="absolute left-0 top-full mt-2 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50">
           <h6 className="mb-2 px-2 text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Páginas</h6>
           <ul>
             {results.map((result, index) => (
               <li key={index}>
                 <button
                    onClick={() => handleSelect(result.path)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                 >
                    <span className="text-gray-500 dark:text-gray-400">{result.icon}</span>
                    <span>{result.title}</span>
                 </button>
               </li>
             ))}
           </ul>
        </div>
      )}

      {/* Estado vacío (opcional) */}
      {isOpen && results.length === 0 && query.trim() !== "" && (
         <div ref={dropdownRef} className="absolute left-0 top-full mt-2 w-full rounded-xl border border-gray-200 bg-white p-4 text-center shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50">
            <p className="text-sm text-gray-500">No se encontraron resultados.</p>
         </div>
      )}
    </div>
  );
}