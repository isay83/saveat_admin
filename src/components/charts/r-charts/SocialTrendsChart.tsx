"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// AHORA ACEPTA PROPS
interface Props {
  chartData: { categories: string[]; series: [] } | null;
  loading: boolean;
}

export default function SocialTrendsChart({ chartData, loading }: Props) {
  
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 h-[310px] flex flex-col items-center justify-center dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm">Analyzing Big Data with R...</p>
      </div>
    );
  }

  if (!chartData) return null;

  // Configuración de la gráfica (Igual que antes)
  const options: ApexOptions = {
    legend: { show: true, position: "top", horizontalAlign: "left", fontFamily: "Outfit, sans-serif" },
    colors: ["#465FFF", "#22AD5C"],
    chart: { fontFamily: "Outfit, sans-serif", height: 310, type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
    grid: { borderColor: '#E2E8F0', strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    xaxis: {
      type: "datetime",
      categories: chartData.categories,
      tooltip: { enabled: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748B", fontSize: "12px" }, format: 'dd MMM' }
    },
    yaxis: { labels: { style: { colors: "#64748B", fontSize: "12px" } } },
    tooltip: { x: { format: "dd MMM yyyy" } },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Search Interest (Google Trends)
        </h3>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px]">
          <ReactApexChart options={options} series={chartData.series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}