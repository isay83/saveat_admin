"use client";

import React, { useState } from 'react';
import apiService from '@/lib/apiService';
import { IProduct } from '@/types/product';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: IProduct | null;
}

export default function DeleteProductModal({ isOpen, onClose, onSuccess, product }: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);
    setError(null);
    try {
      await apiService.delete(`/products/${product._id}`);
      onSuccess(); // Recarga la tabla
      onClose();   // Cierra el modal
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("Error al eliminar. Inténtalo de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Limpiar error al cerrar
  const handleClose = () => {
    setError(null);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[450px] p-5 lg:p-8">
      <div className="text-center">
        <span className="inline-flex items-center justify-center w-16 h-16 mx-auto bg-error-100 rounded-full dark:bg-error-500/20">
          <svg className="text-error-600 dark:text-error-400" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        
        <h4 className="mt-5 mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          ¿Eliminar Producto?
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Estás a punto de eliminar
          <strong className="font-medium text-gray-700 dark:text-white/80"> {product?.name}</strong>.
          Esta acción no se puede deshacer.
        </p>

        {error && <p className="mt-4 text-sm text-center text-error-500">{error}</p>}

        <div className="flex items-center justify-center w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button size="sm" variant="primary" onClick={handleDelete} disabled={isDeleting} className="bg-error-500 hover:bg-error-600 disabled:bg-error-300">
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
