export interface INotification {
    _id: string;
    title: string;
    message: string;
    type: 'reservation' | 'system' | 'alert';
    createdAt: string;
    is_read: boolean;
}