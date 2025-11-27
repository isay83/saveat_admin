"use client";
import React, { useState } from "react";
import { CheckCircleIcon, CloseLineIcon } from "@/icons";
import DropZoneComponent from "@/components/form/form-elements/DropZone";

interface Props {
  onUploadSuccess: () => void;
}

export default function InegiUploader({ onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const R_UPLOAD_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:8000'}/api/upload-inegi`;

  // Esta función la recibe el DropZone y nos devuelve el archivo
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(R_UPLOAD_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Fallo en la subida");
      
      setMessage({ type: 'success', text: 'INEGI data correctly updated' });
      setFile(null); // Limpiamos para permitir subir otro
      onUploadSuccess(); 
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Error al conectar con R' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
        Update Database
      </h3>
      
      <div className="mb-4">
        {!file ? (
          // 1. Mostramos el DropZone si no hay archivo seleccionado
          <DropZoneComponent 
            onFileSelect={handleFileSelect}
            accept={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/vnd.ms-excel': ['.xls']
            }}
            label="Excel Data"
          />
        ) : (
          // 2. Si ya seleccionó, mostramos la tarjeta del archivo con opción de quitar
          <div className="flex items-center justify-between p-4 border border-brand-200 bg-brand-50 rounded-xl dark:bg-brand-900/20 dark:border-brand-800">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-white rounded-lg dark:bg-gray-800 text-xs font-bold text-brand-600">XLSX</div>
                <span className="text-sm font-medium text-brand-900 dark:text-brand-100 truncate max-w-[180px]">
                    {file.name}
                </span>
            </div>
            <button 
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
                <CloseLineIcon className="w-5 h-5"/>
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={handleUpload} 
        disabled={!file || uploading} 
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
            !file || uploading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
            : 'bg-brand-500 text-white hover:bg-brand-600 shadow-theme-xs'
        }`}
      >
        {uploading ? (
            <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
            </span>
        ) : "Upload Data to R"}
      </button>

      {message && (
        <div className={`mt-3 p-3 rounded-lg text-xs flex items-center gap-2 font-medium ${
            message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-100' 
            : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
            {message.type === 'success' && <CheckCircleIcon className="w-4 h-4 shrink-0"/>} 
            {message.text}
        </div>
      )}
    </div>
  );
}