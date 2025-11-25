import React from "react";
import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InegiMap from "@/components/charts/r-charts/InegiMap";
import InegiTopList from "@/components/charts/r-charts/InegiTopList";

export const metadata: Metadata = {
  title: "INEGI Data | Saveat Dashboard",
  description: "Datos oficiales de pobreza y demografía del INEGI",
};

export default function InegiPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="INEGI" />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* 1. Mapa Interactivo (Ocupa 2/3 de la pantalla) */}
        <div className="col-span-12 xl:col-span-8">
           <InegiMap />
        </div>

        {/* 2. Panel Lateral (Datos generales) */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          
          {/* Tarjeta de Resumen */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              National Summary
            </h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              The data displayed comes from the 2024 National Household Income and Expenditure Survey (ENIGH).
            </p>
            
            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">National Average (Extreme)</span>
                    <span className="text-lg font-bold text-brand-600">~7.8%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Most critical condition</span>
                    <span className="text-lg font-bold text-error-600">Chiapas</span>
                </div>
            </div>
          </div>

          {/* Reutilizamos tu DemographicCard (puedes quitarlo si quieres más espacio) */}
          <InegiTopList />
        </div>
      </div>
    </div>
  );
}