export interface Bike {
  id: string;
  manufacturer: string;
  model: string;
  date: Date;
  archived: boolean;
}

export type CreateBike = Pick<Bike, 'manufacturer' | 'model' | 'date'>;
export type UpdateBike = Partial<Omit<Bike, 'id'>>;
export type UpsertBike = Bike;
