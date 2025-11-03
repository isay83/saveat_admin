"use client";

import React from 'react';
import { IReservation } from '@/types/reservation'; // Importamos el tipo
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { CheckLineIcon, CloseLineIcon } from '@/icons';

// Props que este componente recibirá de su página padre
interface ReservationTableProps {
  reservations: IReservation[];
  onConfirm: (reservation: IReservation) => void;
  onCancel: (reservation: IReservation) => void;
}

export default function ReservationTable({
  reservations,
  onConfirm,
  onCancel,
}: ReservationTableProps) {
  
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Función para obtener el color del badge de estado
  const getStatusBadgeColor = (status: IReservation['status']): "success" | "warning" | "error" | "light" => {
    switch (status) {
      case 'recogido':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelado':
      case 'expirado':
        return 'error';
      default:
        return 'light'; // Por si acaso
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]"> {/* Ancho mínimo para la tabla */}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Customer</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Product</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Quantity</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Deadline</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Reservation Date</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {reservations.map((res) => (
                <TableRow key={res._id}>
                  <TableCell className="px-5 py-4 text-start">
                    {/* Mostramos datos del usuario poblado */}
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {res.user_id?.first_name || 'User'} {res.user_id?.last_name || 'Deleted'}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {res.user_id?.email || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                     <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {res.product_name}
                     </span>
                     <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      (ID: ...{res.product_id?._id.slice(-6) || 'N/A'})
                     </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {res.quantity_reserved} {res.unit}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={getStatusBadgeColor(res.status)}>
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDate(res.pickup_deadline)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDate(res.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-end">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onConfirm(res)}
                        // Deshabilitado si la reserva NO está 'pendiente'
                        disabled={res.status !== 'pendiente'}
                        className="disabled:bg-gray-100 disabled:opacity-50"
                      >
                        <CheckLineIcon className="w-4 h-4" />
                        Confirm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onCancel(res)}
                        // Deshabilitado si la reserva NO está 'pendiente'
                        disabled={res.status !== 'pendiente'}
                        className="disabled:bg-gray-100 disabled:opacity-50"
                      >
                        <CloseLineIcon className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
