export interface Service {
  id: string;
  name: string;
  description: string;
  price: number; // Stored as float
  cost: number;
  duration: number; // in minutes
  recurrenceDays: number;
  color: string;
  active: boolean;
}

export type ServiceFormData = Omit<Service, 'id'>;