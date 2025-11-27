"use client";
import React, { useState } from "react";
import { ArrowDownIcon, CheckCircleIcon } from "@/icons"; // Tus iconos
import apiService from "@/lib/apiService"; // Para actualizar en Node.js
import Alert from "@/components/ui/alert/Alert";

interface Product {
  id?: string; // Solo los locales tienen ID
  title: string;
  price: number;
  store: string;
  image?: string;
}

interface Props {
  localProducts: Product[];
  competitorProducts: Product[];
  onPriceUpdated: () => void; // Callback para limpiar la búsqueda o avisar
}

export default function SmartPriceAlert({ localProducts, competitorProducts, onPriceUpdated }: Props) {
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. LÓGICA DE DETECCIÓN DE OPORTUNIDAD
  // Buscamos si algún producto local es más caro que el mínimo de la competencia
  
  if (!localProducts || localProducts.length === 0 || !competitorProducts || competitorProducts.length === 0) {
    return null; 
  }

  // Tomamos el primer producto local encontrado como referencia principal
  const myProduct = localProducts[0]; 
  
  // Encontramos el precio más bajo de la competencia
  const cheapestCompetitor = competitorProducts.reduce((prev, curr) => 
    prev.price < curr.price ? prev : curr
  );

  // Si mi precio ya es menor o igual, no hay alerta
  if (myProduct.price <= cheapestCompetitor.price) {
    return null;
  }

  // Calculamos el "Precio Inteligente" (Un poco más bajo para ganar)
  const suggestedPrice = Math.floor(cheapestCompetitor.price) - 0.50; // 50 centavos menos
  const difference = myProduct.price - cheapestCompetitor.price;

  // --- FUNCIÓN PARA ACTUALIZAR PRECIO ---
  const handleUpdatePrice = async () => {
    if (!myProduct.id) return;
    setUpdating(true);

    try {
      // Llamada a tu API de Node (saveat_api)
      await apiService.put(`/products/${myProduct.id}`, {
        price: suggestedPrice
      });

      setSuccessMsg(`Price updated to $${suggestedPrice.toFixed(2)}!`);
      
      // Esperamos un momento y avisamos al padre
      setTimeout(() => {
        setSuccessMsg(null);
        onPriceUpdated();
      }, 2000);

    } catch (error) {
      console.error("Error actualizando precio:", error);
      <Alert
        variant="error"
        title="Error"
        message="Error updating price in the database."
      />
    } finally {
      setUpdating(false);
    }
  };

  if (successMsg) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-green-100 border border-green-200 text-green-800 flex items-center justify-center gap-2 animate-bounce">
        <CheckCircleIcon className="w-6 h-6" />
        <span className="font-bold">{successMsg}</span>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:bg-red-900/10 dark:border-red-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
      
      {/* Sección Izquierda: La Alerta */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-full text-red-500 shadow-sm animate-pulse">
            <ArrowDownIcon className="w-6 h-6" />
        </div>
        <div>
            <h4 className="font-bold text-red-700 dark:text-red-400 text-lg">
                Cheaper competition detected!
            </h4>
            <p className="text-sm text-red-600/80 dark:text-red-300">
                {cheapestCompetitor.store} sells <strong>{cheapestCompetitor.title}</strong> to <span className="font-bold">${cheapestCompetitor.price.toFixed(2)}</span>.
                <br/>
                Your current price is <span className="line-through">${myProduct.price.toFixed(2)}</span> (Diff: +${difference.toFixed(2)})
            </p>
        </div>
      </div>

      {/* Sección Derecha: La Acción */}
      <div className="flex flex-col items-end gap-2 min-w-[200px]">
        <div className="text-right">
            <span className="text-xs text-gray-500 uppercase font-bold">Suggested Price</span>
            <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                ${suggestedPrice.toFixed(2)}
            </div>
        </div>
        
        <button
            onClick={handleUpdatePrice}
            disabled={updating}
            className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium shadow-md transition-all flex items-center justify-center gap-2"
        >
            {updating ? "Updating..." : "Apply Best Price"}
        </button>
      </div>

    </div>
  );
}