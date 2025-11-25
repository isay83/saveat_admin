"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function GoalsChart() {
  const [goalData, setGoalData] = useState<{ percentage: number; label: string } | null>(null);
  
  // TU PUERTO DE R
  const R_API_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/excel-goals`;

  useEffect(() => {
    fetch(R_API_URL)
      .then((res) => res.json())
      .then((data) => setGoalData(data))
      .catch((err) => console.error("Error R Excel:", err));
  }, []);

  const series = goalData ? [goalData.percentage] : [0];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: { fontFamily: "Outfit, sans-serif", type: "radialBar", height: 330, sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -85, endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: { fontSize: "36px", fontWeight: "600", offsetY: -40, color: "#1D2939", formatter: (val) => val + "%" },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Annual Goal (Excel)
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Data processed from .xlsx file
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] text-sm font-medium text-gray-500">
            {goalData ? goalData.label : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}