"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import apiService from '@/lib/apiService';
import { IProduct } from '@/types/product';
import { IDonor } from '@/types/donor';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import Image from 'next/image';
import { ChevronDownIcon } from '@/icons';

// Props que el modal recibirá
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para recargar la tabla
  product: IProduct | null; // null si es "Crear", objeto si es "Editar"
}

// Estado inicial para un formulario vacío
const initialFormData = {
  name: '',
  brand: '',
  category: '',
  quantity_available: 0,
  unit: 'piezas',
  price: 0,
  donor_id: '',
  status: 'borrador',
  expiry_date: '',
  pickup_window_hours: 24,
  description: '',
  image_url: '',
};

export default function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [donors, setDonors] = useState<IDonor[]>([]);
  const [isLoadingDonors, setIsLoadingDonors] = useState(false);
  
  // Estados para la subida de imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Estados generales del modal
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!product; // True si estamos editando (product no es null)

  // Cargar donantes y poblar el formulario cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      // 1. Cargar lista de donantes para el dropdown
      const fetchDonors = async () => {
        setIsLoadingDonors(true);
        try {
          const response = await apiService.get('/donors');
          setDonors(response.data);
        } catch (err) {
          console.error("Error al cargar donantes", err);
          setError("No se pudo cargar la lista de donantes.");
        } finally {
          setIsLoadingDonors(false);
        }
      };
      fetchDonors();

      // 2. Poblar el formulario si estamos en modo "Editar"
      if (isEditMode) {
        setFormData({
          name: product.name,
          brand: product.brand || '',
          category: product.category || '',
          quantity_available: product.quantity_available,
          unit: product.unit,
          price: product.price,
          donor_id: product.donor_id,
          status: product.status,
          expiry_date: product.expiry_date.split('T')[0], // Formato YYYY-MM-DD
          pickup_window_hours: product.pickup_window_hours,
          description: product.description || '',
          image_url: product.image_url || '',
        });
        setPreviewImage(product.image_url || null);
      } else {
        // Modo "Crear": reseteamos el formulario
        setFormData(initialFormData);
        setPreviewImage(null);
      }
      
      // Limpiar estados
      setSelectedFile(null);
      setUploadError(null);
      setError(null);
      setIsSaving(false);
    }
  }, [isOpen, product, isEditMode]);

  // Manejadores de cambios en el formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (e.target.type === 'number' || e.target.type === 'range') ? parseFloat(value) : value,
    }));
  };

  // --- NUEVA FUNCIÓN: Un manejador para los <Select> y <TextArea> ---
  // Esta función acepta el nombre del campo y el valor (string) directamente
  const handleValueChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Manejador para el archivo de imagen
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setUploadError(null);
    }
  };

  // Lógica de subida a Cloudinary (reutilizada de UserMetaCard)
  const uploadToCloudinary = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadError(null);
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', 'saveat_preset_cloudinary'); // <-- REEMPLAZA
    cloudinaryFormData.append('folder', 'saveat_folder_products'); // <-- Tu nueva carpeta

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/isay83/image/upload`, // <-- Tu Cloud Name
        cloudinaryFormData
      );
      setIsUploading(false);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      setIsUploading(false);
      setUploadError('Error al subir la imagen.');
      throw error;
    }
  };

  // Manejador para enviar el formulario (Crear o Editar)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      let imageUrl = product?.image_url || ''; // Empezamos con la imagen existente (si hay)

      // 1. Si se seleccionó un nuevo archivo, subirlo
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }

      // 2. Preparar los datos finales
      const finalData = { ...formData, image_url: imageUrl };

      // 3. Decidir si llamar a POST (Crear) o PUT (Editar)
      if (isEditMode) {
        // Modo Editar
        await apiService.put(`/products/${product._id}`, finalData);
      } else {
        // Modo Crear
        await apiService.post('/products', finalData);
      }

      // 4. Éxito
      onSuccess(); // Recarga la tabla en la página de inventario
      onClose(); // Cierra el modal

    } catch (error) {
      console.error("Error al guardar producto:", error);
      setError("Error al guardar. Revisa los campos e inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <form onSubmit={handleSubmit} className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        
        {/* --- Encabezado del Modal --- */}
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? 'Editar Producto' : 'Añadir Nuevo Producto'}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {isEditMode ? 'Modifica los detalles del producto.' : 'Rellena los campos para añadir una nueva donación.'}
          </p>
        </div>

        {/* --- Cuerpo del Formulario con Scroll --- */}
        <div className="custom-scrollbar h-auto max-h-[60vh] overflow-y-auto px-2 pb-3">
          
          {/* --- Campos Principales --- */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" name="brand" type="text" value={formData.brand} onChange={handleInputChange} placeholder="Ej. Bimbo, Lala" />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" type="text" value={formData.category} onChange={handleInputChange} placeholder="Ej. Panadería, Lácteos" />
            </div>
          </div>

          {/* --- Stock y Precio --- */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3 mt-5">
            <div>
              <Label htmlFor="quantity_available">Cantidad (Stock)</Label>
              <Input id="quantity_available" name="quantity_available" type="number" min="0" step="1" value={formData.quantity_available} onChange={handleInputChange} required />
            </div>
             <div>
              <Label htmlFor="unit">Unidad</Label>
              <Input id="unit" name="unit" type="text" value={formData.unit} onChange={handleInputChange} placeholder="Ej. piezas, kg, litros" required />
            </div>
            <div>
              <Label htmlFor="price">Precio (MXN)</Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleInputChange} required />
            </div>
          </div>

          {/* --- Donante y Estado --- */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-5">
            <div>
              <Label htmlFor="donor_id">Donante</Label>
              <div className="relative">
                <Select
                  id="donor_id"
                //   name="donor_id"
                  className="dark:bg-dark-900"
                  value={formData.donor_id}
                  // Usamos una función flecha para pasar el 'name' y 'value'
                  onValueChange={(value) => handleValueChange('donor_id', value)}
                //   disabled={isLoadingDonors}
                //   required
                  // En lugar de 'children', le pasamos 'options' como prop
                  options={isLoadingDonors 
                    ? [{ value: '', label: 'Cargando donantes...' }] 
                    : [
                        // { value: '', label: 'Selecciona un donante' },
                        ...donors.map(d => ({ value: d._id, label: d.name }))
                      ]
                  }
                  defaultValue={isLoadingDonors ? '' : formData.donor_id}
                />
                 <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon/>
                </span>
              </div>
            </div>
             <div>
              <Label htmlFor="status">Estado</Label>
              <div className="relative">
                <Select
                  id="status"
                //   name="status"
                  className="dark:bg-dark-900"
                  value={formData.status}
                  // Usamos una función flecha
                  onValueChange={(value) => handleValueChange('status', value)}
                //   required
                  // Definimos las opciones directamente
                  options={[
                    { value: 'disponible', label: 'Disponible (Público)' },
                    { value: 'borrador', label: 'Borrador (Oculto)' },
                    { value: 'agotado', label: 'Agotado' },
                  ]}
                  defaultValue={formData.status}
                />
                 <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon/>
                </span>
              </div>
            </div>
          </div>

          {/* --- Fechas y Tiempos --- */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-5">
            <div>
              <Label htmlFor="expiry_date">Fecha de Caducidad</Label>
              <Input id="expiry_date" name="expiry_date" type="date" value={formData.expiry_date} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="pickup_window_hours">Ventana de Recogida (Horas)</Label>
              <Input id="pickup_window_hours" name="pickup_window_hours" type="number" min="1" value={formData.pickup_window_hours} onChange={handleInputChange} required />
            </div>
          </div>

          {/* --- Descripción --- */}
          <div className="mt-5">
            <Label htmlFor="description">Descripción (Opcional)</Label>
            <TextArea
              id="description"
              name="description"
              rows={3}
              placeholder="Añade detalles sobre el producto..."
              value={formData.description}
              // Usamos una función flecha
              onChange={(value) => handleValueChange('description', value)}
            />
          </div>

          {/* --- Carga de Imagen --- */}
          <div className="mt-5">
            <Label htmlFor="productImageInput">Imagen del Producto</Label>
            <div className="flex items-center gap-4 mt-1.5">
                <Image
                    width={64}
                    height={64}
                    src={previewImage || "https://placehold.co/64x64/EAD5C9/000?text=Img"}
                    alt="Preview"
                    className="object-cover w-16 h-16 rounded-md border border-gray-200 dark:border-gray-700"
                />
                <input
                    id="productImageInput"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-500/10 dark:file:text-brand-400 dark:hover:file:bg-brand-500/20"
                />
            </div>
            {isUploading && <p className="mt-2 text-sm text-blue-500">Subiendo imagen...</p>}
            {uploadError && <p className="mt-2 text-sm text-error-500">{uploadError}</p>}
          </div>

        </div> {/* Fin del div con scroll */}

        {/* --- Pie de Página del Modal (Botones) --- */}
        {error && <p className="mt-4 px-2 text-sm text-center text-error-500">{error}</p>}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose} type="button" disabled={isSaving || isUploading}>
            Cancelar
          </Button>
          <Button size="sm" type="submit" disabled={isSaving || isUploading}>
            {isSaving ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Guardar Cambios' : 'Crear Producto')}
          </Button>
        </div>

      </form>
    </Modal>
  );
}
