"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { scaleLinear } from "d3-scale";
// --- NUEVO: Importamos los tipos específicos de eventos y capas ---
import type { PathOptions, Layer, LeafletMouseEvent, Path } from "leaflet";
import type { Feature, Geometry, FeatureCollection } from "geojson";

const R_API_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}`;

// --- Importación Dinámica (Solo Cliente) ---
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

// URL del GeoJSON de los estados de México
const MEXICO_GEOJSON_URL =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/mexico.geojson";

// --- DEFINICIÓN DE TIPOS ---
interface ApiData {
  state: string;
  value: number;
}

interface MexicoGeoJsonProperties {
  name: string;
  [key: string]: unknown;
}

type MapFeature = Feature<Geometry, MexicoGeoJsonProperties>;

// --- AGREGA ESTO AQUÍ ---
const STATE_ALIASES: Record<string, string> = {
  "Distrito Federal": "Ciudad de México",
  "Coahuila de Zaragoza": "Coahuila",
  "Michoacán de Ocampo": "Michoacán",
  "Veracruz de Ignacio de la Llave": "Veracruz",
  "México": "Estado de México"
};

export default function InegiMap() {
  // Usamos unknown para el GeoJSON crudo inicial
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [apiData, setApiData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [povertyType, setPovertyType] = useState("extrema");
  const [minVal, setMinVal] = useState(0);

  // 1. Cargar el mapa geométrico
  useEffect(() => {
    fetch(MEXICO_GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error cargando GeoJSON:", err));
  }, []);

  // 2. Cargar datos de R
  useEffect(() => {
    const fetchApiData = async () => {
      if (!geoData) return;

      try {
        const response = await fetch(
          `${R_API_URL}/api/inegi-map-data?type=${povertyType}&min_val=${minVal}`
        );
        const result = await response.json();
        setApiData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error conectando con R:", error);
        setLoading(false);
      }
    };

    fetchApiData();
  }, [povertyType, minVal, geoData]);

  const findStateData = (mapName: string) => {
    // 1. Traducir nombre (ej: Distrito Federal -> Ciudad de México)
    const aliasedName = STATE_ALIASES[mapName] || mapName;

    // 2. Buscar ignorando acentos y mayúsculas
    return apiData.find(d => {
      const dName = d.state.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quitar acentos
      const mName = aliasedName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      return dName === mName;
    });
  };

  // --- FUNCIÓN DE ESTILO ---
  const colorScale = scaleLinear<string>()
    .domain([0, 40])
    .range(["#FFEDD5", "#C2410C"]);

  const styleFeature = (feature: MapFeature | undefined): PathOptions => {
    if (!feature || !feature.properties) return {};

    const stateData = findStateData(feature.properties.name);

    return {
      fillColor: stateData ? colorScale(stateData.value) : "#E5E7EB",
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  // --- TOOLTIPS Y EVENTOS CORREGIDOS ---
  const onEachFeature = (feature: MapFeature, layer: Layer) => {
    const originalName = feature.properties.name;
    const stateData = findStateData(originalName);

    // Usamos el nombre corregido para el título del popup
    const displayName = STATE_ALIASES[originalName] || originalName;
    const valueText = stateData ? `${stateData.value}%` : "No data";

    layer.bindPopup(`
      <div class="text-center">
        <strong class="text-lg">${displayName}</strong><br/>
        <span class="text-gray-600">${
          povertyType === "extrema" ? "Extreme Poverty" : 
          povertyType === "moderada" ? "Moderate Poverty" : "Total Poverty"
        }:</span>
        <br/><span class="text-xl font-bold text-orange-600">${valueText}</span>
      </div>
    `);

    // --- AQUÍ ESTÁ LA CORRECCIÓN ---
    // 1. Usamos LeafletMouseEvent para el evento 'e'
    // 2. Casteamos e.target como 'Path' (que es el tipo que tiene setStyle)
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const layer = e.target as Path;
        layer.setStyle({ weight: 3, color: "#666", fillOpacity: 0.9 });
        layer.bringToFront(); // Trae el estado al frente para que el borde resalte
      },
      mouseout: (e: LeafletMouseEvent) => {
        const layer = e.target as Path;
        layer.setStyle({ weight: 1, color: "white", fillOpacity: 0.7 });
      },
    });
  };

  if (!geoData)
    return (
      <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse flex items-center justify-center text-gray-400">
        Loading base map...
      </div>
    );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Poverty Map of Mexico
          </h3>
          <p className="text-sm text-gray-500">
            Official data processed by R
          </p>
        </div>

        <div className="flex gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Indicator
            </label>
            <select
              className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={povertyType}
              onChange={(e) => setPovertyType(e.target.value)}
            >
              <option value="total">Total Poverty</option>
              <option value="moderada">Moderate Poverty</option>
              <option value="extrema">Extreme Poverty</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Minimum Filter: {minVal}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={minVal}
              onChange={(e) => setMinVal(Number(e.target.value))}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Contenedor del Mapa */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 relative z-0">
        <MapContainer
          center={[23.6345, -102.5528]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", background: "transparent" }}
        >
          {/* Renderizamos GeoJSON solo si hay datos de API para evitar parpadeos */}
          {apiData.length > 0 && (
            <GeoJSON
              key={`${povertyType}-${minVal}`}
              data={geoData}
              style={styleFeature} // Leaflet types vs React-Leaflet types a veces chocan levemente
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-[1000]">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center mt-4 gap-2 text-xs text-gray-500">
        <span>Low (0%)</span>
        <div className="w-48 h-3 rounded-full bg-gradient-to-r from-[#FFEDD5] to-[#C2410C]"></div>
        <span>High (40%+)</span>
      </div>
    </div>
  );
}