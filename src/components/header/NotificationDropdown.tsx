"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem"; // Usamos el componente
import apiService from "@/lib/apiService";
import { INotification } from "@/types/notification";
import { BoxIcon, InfoIcon } from "@/icons";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error("Error loading notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await apiService.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Justo ahora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            notifications.length === 0 ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[300px] sm:w-[360px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
          </h5>
          <span className="text-xs font-medium text-white bg-brand-500 px-2 py-0.5 rounded-full">
             {notifications.length} New
          </span>
        </div>

        <ul className="flex flex-col h-auto max-h-[350px] overflow-y-auto custom-scrollbar gap-1">
          {isLoading && <li className="p-4 text-center text-sm text-gray-500">Loading...</li>}
          
          {!isLoading && notifications.length === 0 && (
             <li className="p-8 text-center">
                <p className="text-sm text-gray-500">You have no new notifications.</p>
             </li>
          )}

          {notifications.map((notification) => (
            <li key={notification._id}>
              {/* Usamos DropdownItem aquí */}
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 relative group"
                tag="button" // Lo tratamos como botón, no link
              >
                <span className={`relative flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                    notification.type === 'reservation' ? 'bg-success-100 text-success-600' : 
                    notification.type === 'alert' ? 'bg-error-100 text-error-600' : 
                    'bg-blue-100 text-blue-600'
                }`}>
                  {notification.type === 'reservation' ? (
                     <BoxIcon className="w-5 h-5" />
                  ) : (
                     <InfoIcon className="w-5 h-5" />
                  )}
                </span>

                <div className="block w-full text-left"> {/* text-left para alinear el contenido */}
                  <span className="block mb-1 text-sm font-medium text-gray-800 dark:text-white/90">
                    {notification.title}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="mt-1 block text-xs text-gray-400">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>

                {/* Botón de eliminar (z-index alto para que funcione sobre el DropdownItem) */}
                <div 
                    onClick={(e) => handleDelete(e, notification._id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-error-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer z-10"
                    title="Eliminar notificación"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
              </DropdownItem>
            </li>
          ))}
        </ul>

        {notifications.length > 0 && (
            <Link
            href="/reservations"
            className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            onClick={closeDropdown}
            >
            View Reservations
            </Link>
        )}
      </Dropdown>
    </div>
  );
}