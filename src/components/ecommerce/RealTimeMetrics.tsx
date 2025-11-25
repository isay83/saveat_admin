"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

interface MetricsData {
  totalUsers: number;
  userGrowth: number;
  totalOrders: number;
  orderGrowth: number;
}

export const RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(false); // Nuevo estado para errores

  const R_API_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/general-metrics`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(R_API_URL);
        
        // Si R devuelve un error (ej. 500 o 404), lanzamos excepción
        if (!response.ok) {
          throw new Error(`Error API: ${response.status}`);
        }

        const data = await response.json();
        setMetrics(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading R metrics:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderGrowthBadge = (growth: number = 0) => { // Valor por defecto 0
    const isPositive = growth >= 0;
    return (
      <Badge color={isPositive ? "success" : "error"}>
        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
        {Math.abs(growth)}%
      </Badge>
    );
  };

  if (loading) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 animate-pulse">
            <div className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
        </div>
    );
  }

  // --- BLINDAJE CONTRA DATOS NULOS ---
  // Si hay error o metrics es null, usamos valores seguros
  // El operador '?.' evita el crash si metrics es undefined
  const totalUsers = metrics?.totalUsers ?? 0;
  const userGrowth = metrics?.userGrowth ?? 0;
  const totalOrders = metrics?.totalOrders ?? 0;
  const orderGrowth = metrics?.orderGrowth ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {/* Usamos la variable segura 'totalUsers' */}
              {totalUsers.toLocaleString()}
            </h4>
          </div>
          {renderGrowthBadge(userGrowth)}
        </div>
      </div>

      {/* */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {/* Usamos la variable segura 'totalOrders' */}
              {totalOrders.toLocaleString()}
            </h4>
          </div>
          {renderGrowthBadge(orderGrowth)}
        </div>
      </div>
    </div>
  );
};