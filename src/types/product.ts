// Este 'Omit' es para evitar conflictos de tipo con el '_id' de Mongoose
type ObjectId = string;

// Esta interfaz debe coincidir con la que definimos en el backend
// y la que devuelve tu API.
export interface IProduct {
    _id: ObjectId;
    name: string;
    description?: string;
    image_url?: string;
    brand?: string;
    category?: string;
    quantity_available: number;
    quantity_total_received: number;
    unit: string;
    price: number;
    payment_link?: string;
    status: 'disponible' | 'borrador' | 'agotado';
    donor_id: ObjectId; // O podríamos anidar el objeto Donante aquí más tarde
    received_at: string; // la API lo convertirá a string (ISO)
    expiry_date: string; // la API lo convertirá a string (ISO)
    pickup_window_hours: number;
    createdAt: string;
    updatedAt: string;
}
