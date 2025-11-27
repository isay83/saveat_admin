"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductScanner, { SearchResponse } from "@/components/ecommerce/ProductScanner";
import DynamicTicker from "@/components/ecommerce/DynamicTicker";
import SmartPriceAlert from "@/components/ecommerce/SmartPriceAlert"; // <--- NUEVO
import Alert from "@/components/ui/alert/Alert";

export default function WebDataPage() {
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);

  // Helper para aplanar resultados de competencia
  const getCompetitorProducts = () => {
    if (!searchData?.results) return [];
    // Juntamos todos los arrays que NO sean "Local"
    return Object.entries(searchData.results)
      .filter(([key]) => key !== "Local")
      .flatMap(([, products]) => products);
  };

  const handlePriceUpdated = () => {
    // Aquí podrías recargar la búsqueda automáticamente si quisieras
    // Por ahora, limpiamos la alerta para mostrar que ya se atendió
    setSearchData(null); 
    <Alert
      variant="success"
      title="Success"
      message="Price updated successfully in the system."
    />
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Web" />

      {/* 1. Ticker (Informativo) */}
      <DynamicTicker data={searchData?.ticker || null} />

      {/* 2. ALERTA INTELIGENTE (Accionable) */}
      {/* Solo aparece si hay resultados locales Y competencia */}
      {searchData?.results?.Local && (
          <SmartPriceAlert 
            localProducts={searchData.results.Local}
            competitorProducts={getCompetitorProducts()}
            onPriceUpdated={handlePriceUpdated}
          />
      )}

      {/* 3. Escáner (Buscador) */}
      {/* Actualizamos para recibir el objeto completo */}
      <ProductScanner onSearchComplete={setSearchData} />
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
            * Prices are obtained in real time. Saveat uses AI to suggest competitive prices.
        </p>
      </div>
    </div>
  );
}