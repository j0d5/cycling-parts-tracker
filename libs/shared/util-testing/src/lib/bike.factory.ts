import { Bike } from '@cpt/shared/domain';
import { randBoolean, randPastDate, randProduct } from '@ngneat/falso';

export const createMockBike = (data?: Partial<Bike>): Bike => {
  const { id, title, description } = randProduct();

  return {
    id,
    manufacturer: title,
    model: description,
    archived: randBoolean(),
    date: randPastDate(),
    ...data,
  };
};
