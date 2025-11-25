import React from "react";
import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WeatherWidget from "@/components/charts/r-charts/WeatherWidget";

export const metadata: Metadata = {
  title: "Logistics Weather | Saveat Dashboard",
  description: "Pronóstico logístico basado en clima en tiempo real",
};

export default function WeatherPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Weather" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda: Widget Inteligente */}
        <div>
            <WeatherWidget />
        </div>

        {/* Columna Derecha: Información Estática o Mapa de Rutas futuro */}
        <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 dark:bg-blue-900/10 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Why do we monitor this?
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                    The harvesting of perishable foods depends on optimal conditions. 
                    R cross-references temperature data with your products to alert you to potential heat-related spoilage.
                </p>
            </div>

            {/* Aquí podrías poner una lista de choferes o rutas activas */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                    Active Routes
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Downtown Route</span>
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">In Time</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Northern Route</span>
                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">Delay due to weather conditions</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}