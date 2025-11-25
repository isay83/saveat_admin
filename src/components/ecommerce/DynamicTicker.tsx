"use client";
import React from "react";

interface TickerData {
  product: string;
  competitor: string;
  their_price: number;
  my_price: number;
  saving: number;
}

export default function DynamicTicker({ data }: { data: TickerData | null }) {
  // VALIDACIÓN DE SEGURIDAD:
  // Si no hay datos, O si los precios no son números válidos, no renderizamos nada.
  if (!data || isNaN(Number(data.my_price)) || isNaN(Number(data.their_price))) {
    return null;
  }

  return (
    <div className="w-full bg-gray-900 text-white overflow-hidden py-3 rounded-lg mb-6 relative shadow-lg">
      <div className="absolute left-0 top-0 bottom-0 bg-red-600 z-10 px-4 flex items-center font-bold text-sm uppercase tracking-wider">
        OPORTUNIDAD
      </div>
      
      <div className="flex animate-marquee whitespace-nowrap items-center pl-32">
          <span className="text-gray-300 mr-2">Detectamos un precio alto en</span>
          <span className="font-bold text-white mr-2">{data.competitor}:</span>
          <span className="text-white mr-2">&quot;{data.product}&quot; a</span>
          <span className="text-red-400 font-bold strike mr-4">${Number(data.their_price).toFixed(2)}</span>
          
          <span className="text-brand-400 font-bold mr-2">¡Con nosotros solo: ${Number(data.my_price).toFixed(2)}!</span>
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
            Ahorras ${Number(data.saving).toFixed(2)}
          </span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}