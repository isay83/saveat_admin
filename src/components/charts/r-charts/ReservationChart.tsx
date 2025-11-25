"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Importamos dinámicamente ApexCharts (igual que en tus otros componentes)
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function ReservationChart() {
  // 1. Estados para guardar los datos que vienen de R
  const [chartData, setChartData] = useState<{ categories: string[]; data: number[] }>({
    categories: [],
    data: [],
  });
  const [loading, setLoading] = useState(true);

  // URL de tu API de R (Asegúrate que el puerto sea el correcto)
  const R_API_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/reservations-json`;

  // 2. Fetch a la API de R al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(R_API_URL);
        const result = await response.json();
        
        // Guardamos el JSON de R en el estado de React
        setChartData(result); 
        setLoading(false);
      } catch (error) {
        console.error("Error conectando con R:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. Configuración de la gráfica (Reutilizando tus estilos de BarChartOne)
  const options: ApexOptions = {
    colors: ["#D14343", "#FFB020", "#465fff", "#008000"], // Colores personalizados (Azul, Amarillo, Rojo)
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
        distributed: true, // Esto permite pintar cada barra de un color diferente
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    // AQUÍ CONECTAMOS EL EJE X CON LOS DATOS DE R
    xaxis: {
      categories: chartData.categories, // ["pendiente", "recogido", "expirado", "cancelado"]
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: { show: false }, // Ocultamos leyenda si usamos distributed: true
    grid: {
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      theme: 'light', // Se ajustará automáticamente si tienes configurado el dark mode globalmente
      y: {
        formatter: (val: number) => `${val} Reservas`,
      },
    },
  };

  // AQUÍ CONECTAMOS EL EJE Y CON LOS DATOS DE R
  const series = [
    {
      name: "Quantity",
      data: chartData.data, // [5, 10, 2]
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Real-Time Reservations
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Data fetched from R & MongoDB
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[180px] items-center justify-center">
           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[300px]">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={180}
            />
          </div>
        </div>
      )}
    </div>
  );
}