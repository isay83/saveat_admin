"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import apiService from '@/lib/apiService';
import { IReservation } from '@/types/reservation';
import ReservationTable from '@/components/reservations/ReservationTable';
import ConfirmModal from '@/components/reservations/ConfirmModal'; // Importar el modal genérico
import Image from 'next/image';
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

  // Helper para formatear moneda en el modal
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

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
          <div className="space-y-4 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              ¿Are you sure you want to {modalState.action === 'confirm' ? 'confirm delivery' : 'cancel'} for this reservation?
            </p>
            
            {/* --- INFORMACIÓN DETALLADA DE LA RESERVA --- */}
            {modalState.reservation && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-left">
                
                {/* Producto y Cantidad */}
                <div className="flex items-start gap-3 mb-3">
                   <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200 shrink-0">
                        <Image
                        src={modalState.reservation.product_id.image_url || '/placeholder.png'}
                        alt={modalState.reservation.product_name}
                        width={48}
                        height={48}
                        className="object-cover"
                        />
                   </div>
                   <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {modalState.reservation.product_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: <span className="font-medium text-gray-700 dark:text-gray-300">{modalState.reservation.quantity_reserved} {modalState.reservation.unit}</span>
                      </p>
                   </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                {/* Información de Pago */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                            {modalState.reservation.total_price === 0 ? 'Gratis' : formatCurrency(modalState.reservation.total_price)}
                        </span>
                    </div>

                    {modalState.reservation.total_price > 0 && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method:</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                                    {modalState.reservation.payment_method === 'card' ? 'Tarjeta' : 'Efectivo'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Payment:</span>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${modalState.reservation.is_paid ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}`}>
                                    {modalState.reservation.is_paid ? 'PAGADO' : 'PENDIENTE DE PAGO'}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Mensaje de Acción para el Cajero */}
                {modalState.action === 'confirm' && (
                    <div className={`mt-4 p-3 rounded-md text-center text-sm font-medium ${
                        modalState.reservation.total_price > 0 && !modalState.reservation.is_paid 
                        ? 'bg-warning-50 text-warning-700 border border-warning-200'
                        : 'bg-success-50 text-success-700 border border-success-200'
                    }`}>
                        {modalState.reservation.total_price === 0 
                            ? "✅ Deliver product (Free)" 
                            : !modalState.reservation.is_paid 
                                ? `⚠️ CHARGE ${formatCurrency(modalState.reservation.total_price)} BEFORE DELIVERY`
                                : "✅ Already paid. Deliver product."
                        }
                    </div>
                )}

              </div>
            )}
            {/* --------------------------------------- */}

            <p className="text-xs text-gray-400 mt-2">
               Customer: {modalState.reservation?.user_id.first_name} {modalState.reservation?.user_id.last_name}
            </p>

            {/* Mostramos el error de la API (si lo hay) dentro del modal */}
            {error && modalState.isOpen && <p className="mt-4 text-sm text-error-500 bg-error-50 p-2 rounded border border-error-200">{error}</p>}
          </div>
          </>
        }
        confirmText={modalState.action === 'confirm' ? 'Yes, confirm' : 'Yes, cancel'}
        confirmColor={modalState.action === 'confirm' ? 'success' : 'error'}
      />
    </div>
  );
}
