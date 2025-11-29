"use client";
import React, { useEffect, useState } from "react";
import { ArrowUpIcon } from "@/icons"; // Usa tus iconos

interface Trend {
  term: string;
  growth: number;
}

export default function TrendingTable() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrends = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/global-trends`)
      .then(res => res.json())
      .then(data => {
        // Validación simple por si R devuelve error
        if(Array.isArray(data)) setTrends(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-6 pb-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Global Trends (Social Media)
          </h3>
          <p className="text-sm text-gray-500">What Mexico is searching for on Google today</p>
        </div>
        
        <button 
            onClick={fetchTrends}
            disabled={loading}
            className="text-sm font-medium text-brand-500 hover:text-brand-600 disabled:opacity-50"
        >
            {loading ? "Updating..." : "↻ Update"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {loading && trends.length === 0 ? (
            <div className="text-center py-10 text-gray-400">Analyzing web...</div>
        ) : trends.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                    #{idx + 1}
                </span>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-white capitalize">
                        {item.term}
                    </p>
                    <span className="text-xs text-gray-500">Related search</span>
                </div>
            </div>
            
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <ArrowUpIcon className="w-3 h-3 text-green-600" />
                <span className="text-xs font-bold text-green-700 dark:text-green-400">
                    +{item.growth}%
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}