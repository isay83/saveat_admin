"use client";
import React from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode; // Permite JSX para texto en negrita
  confirmText: string;
  confirmColor?: 'primary' | 'success' | 'error';
  isConfirming: boolean; // Para mostrar estado de carga en el botón
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor = 'primary',
  isConfirming,
}: ConfirmModalProps) {
  
  // Clases de color para el botón de confirmación
  const colorClasses = {
    primary: 'bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300',
    success: 'bg-success-500 hover:bg-success-600 disabled:bg-success-300',
    error: 'bg-error-500 hover:bg-error-600 disabled:bg-error-300',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[450px] p-5 lg:p-8">
      <div className="text-center">
        {/* Aquí puedes añadir un icono si lo deseas */}
        
        <h4 className="mt-5 mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h4>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {message}
        </div>

        <div className="flex items-center justify-center w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isConfirming}>
            Cancel
          </Button>
          <Button 
            size="sm" 
            variant="primary" 
            onClick={onConfirm} 
            disabled={isConfirming} 
            className={colorClasses[confirmColor]} // Color dinámico
          >
            {isConfirming ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
