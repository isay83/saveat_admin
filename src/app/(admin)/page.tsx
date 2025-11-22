import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Home | saveat",
  description: "This is Next.js Home for saveat Dashboard",
};

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-700 dark:text-green-500 mb-4">Saveat</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Panel de Control - Banco de Alimentos</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition">
            <div className="text-4xl mb-2">📦</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Inventario</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestiona tus productos y stock</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition">
            <div className="text-4xl mb-2">👥</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Beneficiarios</h2>
            <p className="text-gray-600 dark:text-gray-400">Administra beneficiarios registrados</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition">
            <div className="text-4xl mb-2">📊</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Reportes</h2>
            <p className="text-gray-600 dark:text-gray-400">Visualiza estadísticas y datos</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Bienvenido</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Esta es tu plataforma de administración para el banco de alimentos. Desde aquí puedes gestionar tu inventario, beneficiarios y acceder a reportes importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
