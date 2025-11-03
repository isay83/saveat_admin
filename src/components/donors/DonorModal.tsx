"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import apiService from '@/lib/apiService';
import { IDonor } from '@/types/donor';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  donor: IDonor | null;
}

const initialFormData = {
  name: '',
  contact_name: '',
  contact_phone: '',
};

export default function DonorModal({ isOpen, onClose, onSuccess, donor }: DonorModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!donor;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // Modo Editar: Cargar datos del donante
        setFormData({
          name: donor.name,
          contact_name: donor.contact_name || '',
          contact_phone: donor.contact_phone || '',
        });
      } else {
        // Modo Crear: Resetear formulario
        setFormData(initialFormData);
      }
      setError(null);
      setIsSaving(false);
    }
  }, [isOpen, donor, isEditMode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (formData.name === '') {
        setError('El nombre del donante es obligatorio.');
        setIsSaving(false);
        return;
    }

    try {
      if (isEditMode) {
        await apiService.put(`/donors/${donor!._id}`, formData);
      } else {
        await apiService.post('/donors', formData);
      }
      onSuccess(); // Recarga la tabla
      onClose();   // Cierra el modal
    } catch (error: unknown) {
      console.error("Error al guardar donante:", error);
      if (error instanceof Error) {
         setError(error.message);
      } else {
         setError("Error al guardar el donante.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <form onSubmit={handleSubmit} className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? 'Editar Donante' : 'Nuevo Donante'}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {isEditMode ? 'Actualiza los datos del donante.' : 'Añade un nuevo donante a la lista.'}
          </p>
        </div>

        <div className="custom-scrollbar h-auto max-h-[60vh] overflow-y-auto px-2 pb-3 space-y-5">
          <div>
            <Label htmlFor="name">Nombre del Donante (Ej. Restaurante, Empresa)</Label>
            <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="contact_name">Nombre del Contacto (Opcional)</Label>
            <Input id="contact_name" name="contact_name" type="text" value={formData.contact_name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="contact_phone">Teléfono del Contacto (Opcional)</Label>
            <Input id="contact_phone" name="contact_phone" type="tel" value={formData.contact_phone} onChange={handleChange} />
          </div>
        </div>

        {error && <p className="mt-4 px-2 text-sm text-center text-error-500">{error}</p>}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose} type="button" disabled={isSaving}>
            Cancelar
          </Button>
          <Button size="sm" type="submit" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}