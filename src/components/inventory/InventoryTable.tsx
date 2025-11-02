"use client";

import React from 'react';
import Image from 'next/image';
import { IProduct } from '@/types/product'; // Importamos nuestro nuevo tipo
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon } from '@/icons'; // Importamos iconos

// Definimos las props que recibirá este componente
interface InventoryTableProps {
  products: IProduct[];
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
}

export default function InventoryTable({
  products,
  onEdit,
  onDelete,
}: InventoryTableProps) {
  
  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Función para obtener el color del badge
  const getStatusBadgeColor = (status: IProduct['status']): "success" | "warning" | "error" => {
    switch (status) {
      case 'disponible':
        return 'success';
      case 'borrador':
        return 'warning';
      case 'agotado':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]"> {/* Ancho mínimo para la tabla */}
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start ...">Producto</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start ...">Estado</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start ...">Stock</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start ...">Precio</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start ...">Categoría</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start ...">Caducidad</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end ...">Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 overflow-hidden rounded-md">
                        <Image
                          width={48}
                          height={48}
                          src={product.image_url || "/images/product/product-01.jpg"} // Fallback
                          alt={product.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "https://placehold.co/48x48/EAD5C9/000?text=Img";
                          }}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {product.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {product.brand || 'Sin marca'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={getStatusBadgeColor(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.quantity_available} {product.unit}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.category || 'N/A'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDate(product.expiry_date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-end">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                        <PencilIcon className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onDelete(product)}>
                        <TrashBinIcon className="w-4 h-4" />
                        {/* Eliminar */}
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
