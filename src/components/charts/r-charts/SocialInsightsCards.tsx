"use client";
import React from "react";
import { GroupIcon } from "@/icons"; // Usa tus iconos existentes

interface InsightsData {
  trend: string;
  best_day: string;
  keywords: string[];
}

interface Props {
  data: InsightsData | null; // Recibe los datos desde el padre
  loading: boolean;
}

export default function SocialInsightsCards({ data, loading }: Props) {
  
  // Skeleton Loader (Muestra cuadros grises mientras carga)
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      
      {/* --- CARD 1: IMPACTO DIGITAL (Tendencia) --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          Impacto Digital
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Comportamiento reciente de búsquedas en México.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            data.trend.includes("Aumento") 
              ? "bg-success-50 text-success-600 border-success-200" 
              : data.trend.includes("baja")
                ? "bg-error-50 text-error-600 border-error-200"
                : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
            {data.trend}
          </span>
        </div>
      </div>

      {/* --- CARD 2: PALABRAS CLAVE (Trending Topics) --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Búsquedas
        </h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {data.keywords.map((tag, idx) => (
            <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-700">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* --- CARD 3: ESTRATEGIA (Mejor Día) --- */}
      <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-start justify-between">
            <h3 className="mb-2 text-lg font-semibold text-brand-600 dark:text-white/90">
            Estrategia IA
            </h3>
            <GroupIcon className="w-5 h-5 text-brand-500" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Basado en el histórico, te recomendamos lanzar campañas los:
        </p>
        <p className="text-xl font-bold text-gray-800 dark:text-white mt-2 capitalize">
            📅 {data.best_day}
        </p>
      </div>
    </div>
  );
}