"use client";

import React, { useState, useEffect } from 'react';
// import { Metadata } from 'next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import InventoryTable from '@/components/inventory/InventoryTable';
import apiService from '@/lib/apiService'; // ¡Importamos nuestro servicio de API!
import { IProduct } from '@/types/product';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import ProductModal from '@/components/inventory/ProductModal';
import DeleteProductModal from '@/components/inventory/DeleteProductModal';

// No podemos usar 'export const metadata' en un Client Component,
// pero lo dejaremos comentado para futura referencia.
// export const metadata: Metadata = {
//   title: "Inventario | saveat",
//   description: "Gestión de inventario de productos",
// };

export default function InventoryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Modales (Los dejaremos listos para el siguiente paso) ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Función para cargar los productos
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ¡Usamos nuestro apiService! Ya incluye el token.
      const response = await apiService.get('/products/admin');
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los productos. Asegúrate de que la API esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos cuando el componente se monta
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Handlers para los botones de la tabla ---
  const handleOpenCreateModal = () => {
    setSelectedProduct(null); // Nos aseguramos que no haya producto seleccionado
    setIsProductModalOpen(true);
    console.log("Abrir modal para CREAR producto");
  };

  const handleOpenEditModal = (product: IProduct) => {
    setSelectedProduct(product); // Guardamos el producto a editar
    setIsProductModalOpen(true);
    console.log("Abrir modal para EDITAR:", product.name);
  };

  const handleOpenDeleteModal = (product: IProduct) => {
    setSelectedProduct(product); // Guardamos el producto a eliminar
    setIsDeleteModalOpen(true);
    console.log("Abrir modal para ELIMINAR:", product.name);
  };

  // --- Renderizado ---
  return (
    <div>
      <PageBreadcrumb pageTitle="Gestión de Inventario" />

      <div className="flex justify-end mb-4">
        <Button size="md" variant="primary" onClick={handleOpenCreateModal} startIcon={<PlusIcon />}>
          Añadir Producto
        </Button>
      </div>

      <div className="space-y-6">
        {isLoading && <p className="text-center">Cargando productos...</p>}
        {error && <p className="text-center text-error-500">{error}</p>}
        {!isLoading && !error && (
          <InventoryTable
            products={products}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        )}
      </div>

        <ProductModal 
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          product={selectedProduct}
          onSuccess={fetchProducts} // Para recargar la tabla
        />
        <DeleteProductModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          product={selectedProduct}
          onSuccess={fetchProducts} // Para recargar la tabla
        />
    </div>
  );
}
