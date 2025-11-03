"use client";

import React, { useState, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import apiService from '@/lib/apiService';
import { IDonor } from '@/types/donor';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import { useAuth } from '@/context/AuthContext'; // Para chequear el rol
import DonorTable from '@/components/donors/DonorTable';
import DonorModal from '@/components/donors/DonorModal';
import DeleteDonorModal from '@/components/donors/DeleteDonorModal';

// Metadata (solo funciona en Server Components, pero es bueno tenerla)
// export const metadata: Metadata = {
//   title: "Donantes | saveat",
//   description: "Gestión de donantes",
// };

export default function DonorsPage() {
  const { user } = useAuth(); // Obtenemos el usuario para verificar su rol
  const [donors, setDonors] = useState<IDonor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<IDonor | null>(null);

  // Función para cargar los donantes
  const fetchDonors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get('/donors');
      setDonors(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los donantes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // --- Handlers para los botones ---
  const handleOpenCreateModal = () => {
    setSelectedDonor(null);
    setIsDonorModalOpen(true);
  };

  const handleOpenEditModal = (donor: IDonor) => {
    setSelectedDonor(donor);
    setIsDonorModalOpen(true);
  };

  const handleOpenDeleteModal = (donor: IDonor) => {
    setSelectedDonor(donor);
    setIsDeleteModalOpen(true);
  };
  
  // --- Handlers para cerrar modales y recargar ---
  const handleCloseModals = () => {
    setIsDonorModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedDonor(null);
  }

  const handleSuccess = () => {
    fetchDonors(); // Recarga la tabla
    handleCloseModals(); // Cierra todos los modales
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Gestión de Donantes" />

      <div className="flex justify-end mb-4">
        {/* Solo mostramos el botón "Añadir" si es un admin */}
        {user?.role === 'admin' && (
          <Button size="md" variant="primary" onClick={handleOpenCreateModal} startIcon={<PlusIcon />}>
            Añadir Donante
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {isLoading && <p className="text-center">Cargando donantes...</p>}
        {error && <p className="text-center text-error-500">{error}</p>}
        {!isLoading && !error && (
          <DonorTable
            donors={donors}
            userRole={user?.role || 'gestor'} // Pasamos el rol a la tabla
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        )}
      </div>

      {/* Modales (Ocultos por defecto) */}
      <DonorModal 
        isOpen={isDonorModalOpen}
        onClose={handleCloseModals}
        donor={selectedDonor}
        onSuccess={handleSuccess}
      />
      <DeleteDonorModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        donor={selectedDonor}
        onSuccess={handleSuccess}
      />
    </div>
  );
}