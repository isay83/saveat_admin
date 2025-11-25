"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { PencilIcon } from "@/icons";

// Interfaz para los datos del formulario del modal
interface AddressFormData {
  country: string;
  city: string;
  postalCode: string;
  employeeId: string; // Mapeado a TAX ID
}

export default function UserAddressCard() {
  const { user, token, updateUser } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<AddressFormData>({
    country: '',
    city: '',
    postalCode: '',
    employeeId: '',
  });
   const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Efecto para cargar datos en el formulario cuando el modal se abre o user cambia
   useEffect(() => {
    if (user) {
      setFormData({
        country: user.country || '',
        city: user.city || '', // El modelo solo tiene city, no state
        postalCode: user.postalCode || '',
        employeeId: user.employeeId || '', // Mapeamos employeeId a TAX ID
      });
    }
  }, [user, isOpen]);

  // Manejador para cambios en inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   // Manejador para guardar cambios
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    const dataToUpdate = { ...formData };

    try {
      const apiUrl = 'http://localhost:5000/api/v1/admins/profile';
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToUpdate),
      });

      const updatedAdminData = await response.json();

      if (!response.ok) {
        throw new Error(updatedAdminData.message || 'Error al actualizar perfil');
      }

      // Actualizar contexto global
      updateUser(dataToUpdate);

      closeModal();

    } catch (error) {
      console.error("Error saving profile:", error);
      if (error instanceof Error) {
        setSaveError(error.message);
      } else {
        setSaveError('Ocurrió un error inesperado al guardar.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Función para abrir el modal y resetear errores
  const openEditModal = () => {
    setSaveError(null);
    // Los datos se cargarán por el useEffect
    openModal();
  }


  if (!user) {
    return <div>Cargando dirección...</div>;
  }

  return (
    <>
      {/* --- Tarjeta Principal (Mostrar Datos) --- */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Dirección y Datos Fiscales
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">País</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.country || '-'}</p>
              </div>
              <div>
                 {/* Combinamos Ciudad/Estado ya que solo tenemos 'city' */}
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Ciudad</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.city || '-'}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Código Postal</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.postalCode || '-'}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">ID Empleado / TAX ID</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.employeeId || '-'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={openEditModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
             <PencilIcon className="w-5 h-5" />
            Edit
          </button>
        </div>
      </div>

       {/* --- Modal Específico para Editar Dirección y TAX ID --- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
         <form onSubmit={handleSave} className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
           <div className="px-2 pr-14">
             <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
               Editar Dirección y Datos Fiscales
             </h4>
             <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
               Actualiza tu ubicación y ID fiscal.
             </p>
           </div>
           <div className="custom-scrollbar h-auto max-h-[60vh] overflow-y-auto px-2 pb-3">
             <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
               <div>
                 <Label htmlFor="countryInput">País</Label>
                 <Input
                   id="countryInput"
                   name="country"
                   type="text"
                   value={formData.country}
                   onChange={handleChange}
                 />
               </div>
               <div>
                 <Label htmlFor="cityInput">Ciudad</Label>
                 <Input
                   id="cityInput"
                   name="city" // Asegúrate que el 'name' coincida
                   type="text"
                   value={formData.city}
                   onChange={handleChange}
                 />
               </div>
               <div>
                 <Label htmlFor="postalCodeInput">Código Postal</Label>
                 <Input
                   id="postalCodeInput"
                   name="postalCode"
                   type="text"
                   value={formData.postalCode}
                   onChange={handleChange}
                 />
               </div>
               <div>
                 <Label htmlFor="employeeIdInput">ID Empleado / TAX ID (No editable)</Label>
                 <Input
                   id="employeeIdInput"
                   name="employeeId" // Asegúrate que el 'name' coincida
                   type="text"
                   value={formData.employeeId}
                   onChange={handleChange}
                   disabled={true}
                   className="capitalize bg-gray-100 dark:bg-gray-800"
                 />
               </div>
             </div>
           </div>
            {saveError && <p className="mt-4 px-2 text-sm text-center text-error-500">{saveError}</p>}
           <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
             <Button size="sm" variant="outline" onClick={closeModal} type="button" disabled={isSaving}>
               Cancelar
             </Button>
             <Button size="sm" type="submit" disabled={isSaving}>
               {isSaving ? 'Guardando...' : 'Guardar Cambios'}
             </Button>
           </div>
         </form>
       </Modal>
    </>
  );
}
