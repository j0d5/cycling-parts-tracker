import { Bike } from '@cpt/shared/domain';
import { EntitySchema } from 'typeorm';

export const BikeEntitySchema = new EntitySchema<Bike>({
  name: 'bike',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    manufacturer: {
      type: String,
      nullable: false,
    },
    model: {
      type: String,
      nullable: false,
    },
    date: {
      type: Date,
      nullable: true,
    },
    archived: {
      type: 'boolean',
      default: false,
      nullable: false,
    },
  },
});
