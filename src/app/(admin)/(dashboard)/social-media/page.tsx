"use client"; // Ahora es Client Component para poder hacer fetch
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SocialTrendsChart from "@/components/charts/r-charts/SocialTrendsChart";
import SocialInsightsCards from "@/components/charts/r-charts/SocialInsightsCards";
import SurveyChart from "@/components/charts/r-charts/SurveyChart";
import TrendingTable from "@/components/charts/r-charts/TrendingTable";

// Tipos de datos completos
interface FullSocialData {
  chart: { categories: string[]; series: [] };
  insights: { trend: string; best_day: string; keywords: string[] };
  error?: string;
}

export default function SocialMediaPage() {
  const [data, setData] = useState<FullSocialData | null>(null);
  const [loading, setLoading] = useState(true);

  // TU PUERTO R
  const R_API_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/social-trends`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(R_API_URL);
        const result = await response.json();
        
        if (result.error) {
            console.error("Error R:", result.error);
        } else {
            setData(result);
        }
      } catch (err) {
        console.error("Error fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Social Media" />

      <div className="space-y-6">
        
        {/* 1. GRÁFICA (Recibe datos del padre) */}
        <SocialTrendsChart 
            chartData={data?.chart || null} 
            loading={loading} 
        />

        {/* 2. TARJETAS DINÁMICAS (Reciben datos del padre) */}
        <SocialInsightsCards 
            data={data?.insights || null} 
            loading={loading} 
        />

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <SurveyChart />
        <TrendingTable />
      </div>
    </div>
  );
}