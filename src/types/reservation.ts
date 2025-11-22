type ObjectId = string;

// Tipo para el usuario poblado (como lo definiste en el backend)
interface PopulatedUser {
    _id: ObjectId;
    first_name: string;
    last_name: string;
    email: string;
}

// Tipo para el producto poblado (como lo definiste en el backend)
interface PopulatedProduct {
    _id: ObjectId;
    name: string;
    image_url?: string;
}

// La interfaz principal de la reserva que recibe el frontend
export interface IReservation {
    _id: ObjectId;
    user_id: PopulatedUser; // El objeto de usuario completo
    product_id: PopulatedProduct; // El objeto de producto completo
    product_name: string;
    quantity_reserved: number;
    unit: string;
    total_price: number;
    status: 'pendiente' | 'recogido' | 'cancelado' | 'expirado';
    payment_method?: 'card' | 'cash'; // Opcional por si hay datos viejos
    is_paid: boolean;
    pickup_deadline: string; // la API lo enviará como string ISO
    picked_up_at?: string;
    createdAt: string;
}
