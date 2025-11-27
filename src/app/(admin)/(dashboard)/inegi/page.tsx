"use client"; // Convertir a Client Component para usar estado
import React, { useState } from "react";
// import { Metadata } from "next"; // Metadata no funciona en "use client", habría que moverla a un layout o wrapper, pero por ahora la comentamos para que compile
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InegiMap from "@/components/charts/r-charts/InegiMap";
import InegiTopList from "@/components/charts/r-charts/InegiTopList";
import InegiUploader from "@/components/charts/r-charts/InegiUploader"; // <--- NUEVO

export default function InegiPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="INEGI" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        
        {/* Columna Principal: MAPA */}
        <div className="col-span-12 xl:col-span-8">
           {/* Pasamos key para forzar recarga al subir archivo */}
           <InegiMap key={`map-${refreshKey}`} />
        </div>

        {/* Columna Lateral */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          
          {/* 1. Componente de Carga */}
          <InegiUploader onUploadSuccess={handleRefresh} />

          {/* 2. Top Lista */}
          <InegiTopList key={`list-${refreshKey}`} />

          {/* 3. Panel Informativo */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Methodological Note
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              The data displayed corresponds to the National Household Income and Expenditure Survey (ENIGH).
              When a new file is uploaded, the system will automatically recalculate the extreme and moderate poverty indices.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}