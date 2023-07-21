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
  relations: {
    user: {
      type: 'many-to-one',
      target: 'user',
      // column name in this table where the foreign key
      // of the associated table is referenced
      joinColumn: {
        name: 'user_id',
      },
      inverseSide: 'bikes',
    },
  },
  // adds a constraint to the table that ensures each
  // userID + title combination is unique
  uniques: [
    {
      name: 'UNIQUE_MANUFACTURER_USER',
      columns: ['manufacturer', 'user.id'],
    },
  ],
});
