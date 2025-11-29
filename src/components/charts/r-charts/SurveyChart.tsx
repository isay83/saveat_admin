"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SurveyChart() {
  const [data, setData] = useState<{ categories: string[], data: number[] } | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/survey-stats`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div className="h-[300px] bg-gray-100 animate-pulse rounded-xl"></div>;

  const options: ApexOptions = {
    colors: ["#3C50E0", "#E91E63", "#FFC107", "#4CAF50", "#00BCD4"],
    chart: { fontFamily: "Outfit, sans-serif", type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: true } }, // Horizontal se lee mejor para nombres largos
    dataLabels: { enabled: true },
    xaxis: { categories: data.categories },
    grid: { show: false }
  };

  const series = [{ name: "Users", data: data.data }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        User Origin (Survey)
      </h3>
      <div className="overflow-hidden">
        <ReactApexChart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
}