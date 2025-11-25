import React from "react";
import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { RealTimeMetrics } from "@/components/ecommerce/RealTimeMetrics";
import ReservationChart from "@/components/charts/r-charts/ReservationChart";
import ReservationHeatmap from "@/components/charts/r-charts/ReservationHeatMap";

export const metadata: Metadata = {
  title: "Food Bank Dashboard | Saveat",
  description: "Panel principal de estadísticas del Banco de Alimentos",
};

export default function FoodBank() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Food Bank Analytics" />
    
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Columna Izquierda Principal */}
        <div className="col-span-12 space-y-6 xl:col-span-7">
          
          {/* Métricas Numéricas (Usuarios y Órdenes) */}
          <RealTimeMetrics />

          {/* Gráfica de Barras (Estado de Reservas) */}
          <ReservationChart />

          {/* 2. Nuevo Mapa de Calor (Ventas por Estado) */}
          <ReservationHeatmap />
          
        </div>

        {/* Columna Derecha Secundaria */}
        <div className="col-span-12 xl:col-span-5">
           <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Resumen Rápido
              </h3>
              <p className="text-sm text-gray-500">
                Este panel concentra la inteligencia de negocio de Saveat:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>Métricas:</strong> Crecimiento diario real comparado con ayer.</li>
                  <li><strong>Gráfica:</strong> Estado actual de las reservas (pendientes vs. entregadas).</li>
                  <li><strong>Mapa:</strong> Geomarketing automático basado en los códigos postales de tus usuarios.</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}