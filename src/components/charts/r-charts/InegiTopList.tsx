"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/icons"; // O cualquier icono que te guste

interface ApiData {
  state: string;
  value: number;
}

export default function InegiTopList() {
  const [data, setData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(true);

  // Usamos el mismo endpoint de R, pidiendo pobreza extrema
  const R_API_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/inegi-map-data?type=extrema`;

  useEffect(() => {
    fetch(R_API_URL)
      .then((res) => res.json())
      .then((result: ApiData[]) => {
        // Tomamos solo los primeros 5 (el Top 5)
        setData(result.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-full animate-pulse">
        <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top 5: Pobreza Extrema
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Estados con mayor índice crítico
        </p>
      </div>

      <div className="space-y-5">
        {data.map((item, index) => (
          <div key={item.state} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              {/* Círculo con el número de ranking */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                {index + 1}
              </div>
              
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {item.state}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  México
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                        {item.value}%
                    </span>
                    {/* Icono decorativo de alerta */}
                    <span className="text-error-500">
                        <ArrowUpIcon className="w-3 h-3" />
                    </span>
                </div>
                
                {/* Barra de progreso visual */}
                <div className="relative block h-1.5 w-24 rounded-full bg-gray-200 dark:bg-gray-800">
                    <div 
                        className="absolute left-0 top-0 h-full rounded-full bg-brand-500" 
                        style={{ width: `${(item.value / 40) * 100}%` }} // Asumiendo 40% como maximo visual
                    ></div>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-center text-gray-400">
              Datos procesados directamente del archivo .xlsx de INEGI
          </p>
      </div>
    </div>
  );
}