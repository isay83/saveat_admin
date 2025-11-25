"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GoalsChart from "@/components/charts/r-charts/GoalsChart";
import ExcelUploader from "@/components/charts/r-charts/ExcelUploader";

export default function ExcelDataPage() {
  // Estado clave para refrescar la gráfica
  // Cada vez que cambie este número, la gráfica volverá a pedir datos a R
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Excel" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        
        {/* 1. Gráfica Radial (Visualización) */}
        <div className="col-span-12 xl:col-span-5">
          {/* Pasamos la 'key' para forzar recarga */}
          <GoalsChart key={refreshKey} />
        </div>

        {/* 2. Uploader (Control) */}
        <div className="col-span-12 xl:col-span-7 space-y-6">
          
          <ExcelUploader onUploadSuccess={handleRefresh} />

          {/* Instrucciones / Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-2">
                ¿Cómo funciona?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                Esta sección se alimenta de un archivo local procesado por R.
                Sube tu reporte mensual con el siguiente formato:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-xs text-gray-600 dark:text-gray-300 font-mono border-collapse">
                  <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left px-3 py-2 font-semibold">Concepto</th>
                    <th className="text-center px-3 py-2 font-semibold">Meta</th>
                    <th className="text-center px-3 py-2 font-semibold">Actual</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50">
                    <td className="text-left px-3 py-2">Recaudación</td>
                    <td className="text-center px-3 py-2">100000</td>
                    <td className="text-center px-3 py-2">65000</td>
                  </tr>
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800/50">
                    <td className="text-left px-3 py-2">Kilos Rescatados</td>
                    <td className="text-center px-3 py-2">5000</td>
                    <td className="text-center px-3 py-2">4200</td>
                  </tr>
                  </tbody>
                </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}