"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Import dinámico de ApexCharts
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    wind: number;
    condition: string;
    is_day: number;
  };
  logistics: {
    risk: string;
    message: string;
    color: "success" | "warning" | "error";
  };
  forecast: {
    days: string[];
    max: number[];
    min: number[];
    rain_prob: number[];
  };
}

export default function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Ubicación Detectada");

  useEffect(() => {
    // 1. Obtener Geolocalización
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.warn("Permiso denegado o error GPS, usando default (Celaya/Bajío)", error);
          fetchWeather(20.52, -100.81); // Coordenadas default
          setLocationName("Bajío (Default)");
        }
      );
    } else {
      fetchWeather(20.52, -100.81);
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:17969'}/api/weather-logistics?lat=${lat}&lon=${lon}`;
      const res = await fetch(url);
      const result = await res.json();
      
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>;
  }

  // Configuración de la Gráfica de Pronóstico
  const chartOptions: ApexOptions = {
    chart: { type: "area", height: 100, sparkline: { enabled: true } },
    stroke: { curve: "smooth", width: 2 },
    fill: { opacity: 0.3 },
    colors: ["#3C50E0"],
    tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => "Temp" } } },
  };

  const chartSeries = [{ name: "Máxima", data: data.forecast.max }];

  // Determinar estilos según riesgo
  const statusColors = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };
  
  const statusBg = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800",
  };

  return (
    <div className="space-y-6">
      
      {/* TARJETA PRINCIPAL DE ESTADO */}
      <div className={`rounded-2xl border p-6 ${statusBg[data.logistics.color]} transition-colors`}>
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    {/* Punto pulsante del semáforo */}
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColors[data.logistics.color]} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${statusColors[data.logistics.color]}`}></span>
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                        Logística: {data.logistics.risk}
                    </h3>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                    {data.current.condition}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {locationName} • {data.current.temp}°C
                </p>
            </div>
            <div className="text-right">
                <div className="text-xs text-gray-500">Viento</div>
                <div className="font-bold text-gray-700 dark:text-gray-300">{data.current.wind} km/h</div>
                <div className="text-xs text-gray-500 mt-2">Humedad</div>
                <div className="font-bold text-gray-700 dark:text-gray-300">{data.current.humidity}%</div>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Recomendación IA:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {data.logistics.message}
            </p>
        </div>
      </div>

      {/* PRONÓSTICO SEMANAL (Pequeña tabla visual) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Pronóstico 7 Días
        </h3>
        
        {/* Gráfica pequeña de fondo */}
        <div className="mb-4">
            <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={80} />
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
            {data.forecast.days.slice(0, 7).map((day, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">
                        {new Date(day).toLocaleDateString('es-MX', { weekday: 'narrow' })}
                    </span>
                    {/* Icono simple basado en prob. lluvia */}
                    <span className="text-lg">
                        {data.forecast.rain_prob[idx] > 40 ? '🌧️' : '☀️'}
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1">
                        {Math.round(data.forecast.max[idx])}°
                    </span>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}