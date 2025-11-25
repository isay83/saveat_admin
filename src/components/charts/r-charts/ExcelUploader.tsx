"use client";
import React, { useState } from "react";
import { ArrowUpIcon, CheckCircleIcon, CloseLineIcon } from "@/icons"; // Usa tus iconos

export default function ExcelUploader({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // URL DE R
  const R_UPLOAD_URL = `${process.env.NEXT_PUBLIC_R_API_URL || 'http://127.0.0.1:17969'}/api/upload-goals`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file); // 'file' debe coincidir con req$body$file en R

    try {
      const res = await fetch(R_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Fallo en la subida");

      setMessage({ type: 'success', text: 'Archivo procesado correctamente por R' });
      setFile(null); // Limpiar input
      onUploadSuccess(); // Avisar al padre para recargar la gráfica
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Error al conectar con el servidor de R' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Actualizar Metas (Fuente: Excel)
      </h3>
      
      <div className="flex flex-col gap-4">
        {/* Input de Archivo Estilizado */}
        <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-colors ${file ? 'border-brand-500 bg-brand-50/20' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {file ? (
                    <div className="flex items-center gap-2 text-brand-600">
                        <span className="font-medium">{file.name}</span>
                        <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="p-1 hover:bg-red-100 rounded-full text-red-500 z-20">
                            <CloseLineIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <ArrowUpIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Arrastra tu Excel aquí o haz clic</p>
                        <p className="text-xs text-gray-400 mt-1">Columnas requeridas: Concepto, Meta, Actual</p>
                    </>
                )}
            </div>
        </div>

        {/* Botón de Subida */}
        <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                !file || uploading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800' 
                : 'bg-brand-500 text-white hover:bg-brand-600 shadow-theme-xs'
            }`}
        >
            {uploading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                </>
            ) : (
                "Subir y Recalcular"
            )}
        </button>

        {/* Mensajes de Feedback */}
        {message && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                message.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
            }`}>
                {message.type === 'success' && <CheckCircleIcon className="w-4 h-4" />}
                {message.text}
            </div>
        )}
      </div>
    </div>
  );
}