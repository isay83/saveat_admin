"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/icons";

interface ApiData {
  state: string;
  value: number;
}

export default function InegiTopList() {
  const [data, setData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(true);

  // Usamos el mismo endpoint de R
  const R_API_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/inegi-map-data?type=extrema`;

  useEffect(() => {
    fetch(R_API_URL)
      .then((res) => res.json())
      .then((result) => {
        // --- CORRECCIÓN AQUÍ ---
        // Verificamos si 'result' es un Array antes de usar .slice
        if (Array.isArray(result)) {
          setData(result.slice(0, 5));
        } else {
          // Si no es array (ej. es un error {error: "..."}), dejamos la lista vacía
          console.warn("Respuesta de R no es una lista:", result);
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetch:", err);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
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

  // Si no hay datos (aún no subes el archivo), mostramos un mensaje amigable
  if (data.length === 0) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full mb-3">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
            </div>
            <h3 className="text-gray-800 dark:text-white font-medium">No data available</h3>
            <p className="text-sm text-gray-500 mt-1">Upload the INEGI Excel file to see the ranking.</p>
        </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top 5: Extreme Poverty
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          States with the highest critical index (2024)
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
                  Mexico
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                        {item.value}%
                    </span>
                    <span className="text-error-500">
                        <ArrowUpIcon className="w-3 h-3" />
                    </span>
                </div>
                
                {/* Barra de progreso visual */}
                <div className="relative block h-1.5 w-24 rounded-full bg-gray-200 dark:bg-gray-800">
                    <div 
                        className="absolute left-0 top-0 h-full rounded-full bg-brand-500" 
                        style={{ width: `${Math.min((item.value / 40) * 100, 100)}%` }} 
                    ></div>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-center text-gray-400">
              Data processed directly from INEGI&apos;s .xlsx file
          </p>
      </div>
    </div>
  );
}