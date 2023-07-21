import { User } from '@cpt/shared/domain';
import { EntitySchema } from 'typeorm';

export const UserEntitySchema = new EntitySchema<User>({
  name: 'user',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      type: String,
      nullable: false,
      unique: true,
    },
    password: {
      type: String,
      nullable: false,
    },
  },
  relations: {
    bikes: {
      // _one_ user has _many_ bike items
      type: 'one-to-many',
      // name of the database table we're associating with
      target: 'bike',
      // if a user is removed, it's bike items should be
      // removed as well
      cascade: true,
      // name of the property on the bike side that relates
      // back to this user
      inverseSide: 'user',
    },
  },
});
