import { User } from './user.interface';

export interface Bike {
  id: string;
  manufacturer: string;
  model: string;
  date: Date;
  archived: boolean;

  user?: User;
  user_id?: string;
}

export type CreateBike = Pick<Bike, 'manufacturer' | 'model' | 'date'>;
export type UpdateBike = Partial<Omit<Bike, 'id'>>;
export type UpsertBike = Bike;
