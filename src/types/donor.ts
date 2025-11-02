type ObjectId = string;

export interface IDonor {
    _id: ObjectId;
    name: string;
    contact_name?: string;
    contact_phone?: string;
    createdAt: string;
    updatedAt: string;
}
