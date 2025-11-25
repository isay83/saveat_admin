"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductScanner, {TickerData} from "@/components/ecommerce/ProductScanner";
import DynamicTicker from "@/components/ecommerce/DynamicTicker";

export default function WebDataPage() {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);

  return (
    <div>
      <PageBreadcrumb pageTitle="Web" />

      {/* El Ticker aparece solo si hay una oportunidad detectada */}
      <DynamicTicker data={tickerData} />

      {/* Buscador y Resultados */}
      {/* Le pasamos la función setTickerData para que el buscador actualice el ticker */}
      <ProductScanner onSearchComplete={setTickerData} />
      
      {/* Nota legal / disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
            * Los precios son obtenidos en tiempo real de los sitios públicos de los proveedores.
            Saveat no garantiza la disponibilidad de estos precios en tienda física.
        </p>
      </div>
    </div>
  );
}