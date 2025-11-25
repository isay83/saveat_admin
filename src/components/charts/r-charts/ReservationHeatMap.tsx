"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { scaleLinear } from "d3-scale";
import type { PathOptions, Layer, LeafletMouseEvent, Path } from "leaflet";
import type { Feature, Geometry, GeoJsonObject } from "geojson";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

const MEXICO_GEOJSON_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/mexico.geojson";

interface ApiData {
  state: string;
  value: number;
}

// Tipos GeoJSON
interface MexicoGeoJsonProperties {
  name: string;
  [key: string]: unknown;
}
type MapFeature = Feature<Geometry, MexicoGeoJsonProperties>;

export default function ReservationHeatmap() {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [apiData, setApiData] = useState<ApiData[]>([]);
  const [, setLoading] = useState(true);

  const R_API_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:17969'}/api/reservations-map`;

  useEffect(() => {
    // 1. Cargar GeoJSON
    fetch(MEXICO_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error GeoJSON:", err));

    // 2. Cargar Datos de Ventas de R
    fetch(R_API_URL)
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error R:", err);
        setLoading(false);
      });
  }, []);

  // Escala de color: De Azul Claro a Azul Intenso (Ventas)
  const maxVal = Math.max(...apiData.map(d => d.value), 10); // Dinámico o default 10
  const colorScale = scaleLinear<string>()
    .domain([0, maxVal])
    .range(["#EFF6FF", "#2563EB"]); // blue-50 a blue-600

  const styleFeature = (feature: MapFeature | undefined): PathOptions => {
    if (!feature || !feature.properties) return {};
    const stateName = feature.properties.name;
    const stateInfo = apiData.find((d) => d.state === stateName || stateName.includes(d.state));

    return {
      fillColor: stateInfo ? colorScale(stateInfo.value) : "#F1F5F9", // Slate-100 si no hay ventas
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature: MapFeature, layer: Layer) => {
    const stateName = feature.properties.name;
    const stateInfo = apiData.find((d) => d.state === stateName || stateName.includes(d.state));
    const sales = stateInfo ? stateInfo.value : 0;

    layer.bindPopup(`
      <div class="text-center">
        <strong class="text-lg">${stateName}</strong><br/>
        <span class="text-gray-600">Total Reservations:</span><br/>
        <span class="text-xl font-bold text-brand-600">${sales}</span>
      </div>
    `);

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const l = e.target as Path;
        l.setStyle({ weight: 3, color: "#666", fillOpacity: 1 });
        l.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        const l = e.target as Path;
        l.setStyle({ weight: 1, color: "white", fillOpacity: 0.8 });
      },
    });
  };

  if (!geoData) return <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse"></div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Sales Heat Map
        </h3>
        <p className="text-sm text-gray-500">
          Geographic concentration of reserves (Based on user CP)
        </p>
      </div>

      <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 relative z-0">
        <MapContainer center={[23.6345, -102.5528]} zoom={5} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <GeoJSON data={geoData} style={styleFeature} onEachFeature={onEachFeature} />
        </MapContainer>
      </div>
    </div>
  );
}