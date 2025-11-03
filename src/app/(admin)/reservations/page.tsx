"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import apiService from '@/lib/apiService';
import { IReservation } from '@/types/reservation';
import ReservationTable from '@/components/reservations/ReservationTable';
import ConfirmModal from '@/components/reservations/ConfirmModal'; // Importar el modal genérico
// import { useAuth } from '@/context/AuthContext';

// Metadata (solo funciona en Server Components, pero es bueno tenerla)
// export const metadata: Metadata = {
//   title: "Reservas | saveat",
//   description: "Gestión de reservas de usuarios",
// };

export default function ReservationsPage() {
//   const { user } = useAuth(); // (No es necesario, pero es buena práctica)
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para los modales
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: 'confirm' | 'cancel' | null;
    reservation: IReservation | null;
  }>({ isOpen: false, action: null, reservation: null });
  
  const [isProcessing, setIsProcessing] = useState(false); // Para el estado de carga del botón

  // Función para cargar las reservas
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get('/reservations');
      setReservations(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las reservas.');
    } finally {
      setIsLoading(false);
    }
  }, []); // useCallback con array vacío

  // Cargar reservas al montar el componente
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]); // El linter pedirá fetchReservations como dependencia

  // --- Handlers para abrir modales ---
  const handleOpenConfirmModal = (reservation: IReservation) => {
    setModalState({ isOpen: true, action: 'confirm', reservation });
  };

  const handleOpenCancelModal = (reservation: IReservation) => {
    setModalState({ isOpen: true, action: 'cancel', reservation });
  };
  
  // --- Handlers para cerrar modales ---
  const handleCloseModal = () => {
    setModalState({ isOpen: false, action: null, reservation: null });
    setError(null); // Limpiar errores al cerrar
  }

  // --- Lógica de Confirmación/Cancelación ---
  const handleConfirmAction = async () => {
    const { action, reservation } = modalState;
    if (!action || !reservation) return;

    setIsProcessing(true);
    setError(null);
    
    // Elige el endpoint de la API basado en la acción
    const endpoint = action === 'confirm' 
      ? `/reservations/${reservation._id}/confirm` 
      : `/reservations/${reservation._id}/cancel`;

    try {
      await apiService.put(endpoint);
      // Éxito: recargar la lista y cerrar modal
      await fetchReservations();
      handleCloseModal();
    } catch (err) {
      console.error(`Error al ${action} la reserva:`, err);
      // Mostrar error en el modal (o en la página)
      setError(`Error al procesar la solicitud.`);
      // No cerramos el modal, para que el usuario vea el error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Reservation Management" />

      {/* No hay botón de "Añadir" aquí, se crean desde el sitio público */}

      <div className="space-y-6">
        {isLoading && <p className="text-center">Loading reservations...</p>}
        {/* Mostramos el error de carga principal aquí */}
        {error && !modalState.isOpen && <p className="text-center text-error-500">{error}</p>}
        
        {!isLoading && reservations.length > 0 && (
          <ReservationTable
            reservations={reservations}
            onConfirm={handleOpenConfirmModal}
            onCancel={handleOpenCancelModal}
          />
        )}
        
        {!isLoading && reservations.length === 0 && !error && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                No reservations to show.
            </p>
        )}
      </div>

      {/* Modal de Confirmación Genérico */}
      {/* Solo se renderiza si isOpen es true */}
      <ConfirmModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        isConfirming={isProcessing}
        title={modalState.action === 'confirm' ? 'Confirm Delivery' : 'Cancel Reservation'}
        message={
          <>
            <p>
              Are you sure you want to {modalState.action === 'confirm' ? 'confirm delivery of' : 'cancel'} this reservation?
            </p>
            <p className="font-medium text-gray-700 dark:text-white/80 mt-2">
              {modalState.reservation?.quantity_reserved}x {modalState.reservation?.product_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
               to {modalState.reservation?.user_id.first_name} {modalState.reservation?.user_id.last_name}
            </p>
            {/* Mostramos el error de la API (si lo hay) dentro del modal */}
            {error && modalState.isOpen && <p className="mt-4 text-sm text-error-500">{error}</p>}
          </>
        }
        confirmText={modalState.action === 'confirm' ? 'Yes, Confirm' : 'Yes, Cancel'}
        confirmColor={modalState.action === 'confirm' ? 'success' : 'error'}
      />
    </div>
  );
}
