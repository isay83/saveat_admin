import { BoxIcon, GroupIcon, PieChartIcon } from "@/icons";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Home | saveat",
  description: "This is Next.js Home for saveat Dashboard",
};

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-700 dark:text-green-500 mb-4">Saveat</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Control Panel - Food Bank</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition">
            <div className="text-4xl mb-2"><BoxIcon/></div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Inventory</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your products and stock</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition">
            <div className="text-4xl mb-2"><GroupIcon/></div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Beneficiaries</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage registered beneficiaries</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition">
            <div className="text-4xl mb-2"><PieChartIcon/></div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Reports</h2>
            <p className="text-gray-600 dark:text-gray-400">View statistics and data</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Welcome</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            This is your administration platform for the food bank. From here, you can manage your inventory and beneficiaries and access important reports.
          </p>
        </div>
      </div>
    </div>
  );
}
