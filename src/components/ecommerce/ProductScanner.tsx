"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BoxIcon } from "@/icons"; // Usa tus iconos

// Tipos de datos
interface Product {
  title: string;
  price: number;
  image: string;
  store: string;
}

// Definimos la estructura exacta del Ticker (coincide con R y DynamicTicker)
export interface TickerData {
  product: string;
  competitor: string;
  their_price: number;
  my_price: number;
  saving: number;
}

interface SearchResponse {
  results: {
    [key: string]: Product[]; // Ej: "Walmart": [product, product...]
  };
  ticker: TickerData | null;
}

// Tipamos las Props del componente
interface ProductScannerProps {
  onSearchComplete: (ticker: TickerData | null) => void;
}

export default function ProductScanner({ onSearchComplete }: ProductScannerProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setData(null);

    try {
      // TU URL
      const res = await fetch(`${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/search-products?q=${query}`);
      const result: SearchResponse = await res.json();
      
      setData(result);
      // Le mandamos los datos del ticker al componente padre (page.tsx)
      if (result.ticker && !Array.isArray(result.ticker)) {
        onSearchComplete(result.ticker);
      } else {
        onSearchComplete(null);
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tiendas en orden de preferencia para mostrar
  const storeOrder = ["Local", "Bodega", "Walmart", "Chedraui", "Basicos", "Costco"];

  return (
    <div className="space-y-6">
      {/* BARRA DE BÚSQUEDA */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Ex. Leche, Arroz, Huevo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-500 px-8 py-3 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Scanning Web..." : "Search"}
          </button>
        </form>
      </div>

      {/* RESULTADOS EN COLUMNAS */}
      {data && data.results && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-w-0">
          {storeOrder.map((storeKey) => {
            const products = data.results[storeKey];
            if (!products || products.length === 0) return null;

            const isMyStore = storeKey === "Local";

            return (
              <div key={storeKey} className={`w-full rounded-2xl border p-4 ${isMyStore ? 'border-brand-500 bg-brand-50/10' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'}`}>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                    {/* Logotipo simple o icono */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMyStore ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {isMyStore ? <BoxIcon className="w-4 h-4" /> : storeKey.charAt(0)}
                    </div>
                    <h3 className={`font-bold text-lg ${isMyStore ? 'text-brand-600' : 'text-gray-700 dark:text-gray-200'}`}>
                        {isMyStore ? "Our Store" : storeKey}
                    </h3>
                </div>

                <div className="space-y-4">
                    {products.map((prod, idx) => (
                        <div key={idx} className="flex gap-3 group">
                            <div className="w-16 h-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white">
                                {prod.image ? (
                                    <Image 
                                        src={prod.image}  
                                        alt={prod.title} 
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-contain" 
                                    />
                                ) : (
                                  <>
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                      <Image src="/images/product/no-image.svg" alt="No image" width={64} height={64} />
                                    </div>
                                  </>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-1 break-words" title={prod.title}>
                                    {prod.title}
                                </p>
                                <span className={`font-bold ${isMyStore ? 'text-lg text-brand-600' : 'text-gray-900 dark:text-white'}`}>
                                    ${prod.price.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}