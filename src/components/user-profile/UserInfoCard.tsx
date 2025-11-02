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
interface InfoFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export default function UserInfoCard() {
  const { user, token, updateUser } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<InfoFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

   // Efecto para cargar datos en el formulario cuando el modal se abre o user cambia
   useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, isOpen]); // Depende de 'user' y 'isOpen'

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

    // Quitamos 'role' porque no se puede editar aquí
    const dataToUpdate: Partial<InfoFormData> = { ...formData };

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

      // Actualizar contexto global (solo los campos que cambiaron)
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
    return <div>Cargando información...</div>;
  }

  return (
    <>
      {/* --- Tarjeta Principal (Mostrar Datos) --- */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Información Personal
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nombre</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.first_name}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Apellido</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.last_name}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.email}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user.phone || '-'}</p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Rol</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={openEditModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* --- Modal Específico para Editar Información Personal --- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <form onSubmit={handleSave} className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Información Personal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Actualiza tus datos de contacto.
            </p>
          </div>
          <div className="custom-scrollbar h-auto max-h-[60vh] overflow-y-auto px-2 pb-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="firstNameInput">Nombre</Label>
                <Input
                  id="firstNameInput"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="lastNameInput">Apellido</Label>
                <Input
                  id="lastNameInput"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="emailInput">Email</Label>
                <Input
                  id="emailInput"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label htmlFor="phoneInput">Teléfono</Label>
                <Input
                  id="phoneInput"
                  name="phone"
                  type="tel"
                  placeholder="+00 000 000 00"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
               {/* Campo Rol (Solo lectura) */}
               <div className="col-span-2">
                 <Label>Rol (No editable)</Label>
                 <Input type="text" value={user?.role} disabled className="capitalize bg-gray-100 dark:bg-gray-800"/>
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
