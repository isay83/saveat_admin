"use client";

import React from 'react';
import { IDonor } from '@/types/donor';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon } from '@/icons';

interface DonorTableProps {
  donors: IDonor[];
  userRole: 'admin' | 'gestor'; // Para saber si mostrar botones
  onEdit: (donor: IDonor) => void;
  onDelete: (donor: IDonor) => void;
}

export default function DonorTable({
  donors,
  userRole,
  onEdit,
  onDelete,
}: DonorTableProps) {
  
  // Solo un 'admin' puede editar o borrar
  const canModify = userRole === 'admin';

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[700px]"> {/* Ancho mínimo */}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 ...">Donor Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 ...">Contact Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 ...">Contact Phone</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end ...">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {donors.map((donor) => (
                <TableRow key={donor._id}>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {donor.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {donor.contact_name || 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {donor.contact_phone || 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-end">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onEdit(donor)}
                        disabled={!canModify} // <-- Seguridad de UI
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onDelete(donor)}
                        disabled={!canModify} // <-- Seguridad de UI
                      >
                        <TrashBinIcon className="w-4 h-4" />
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