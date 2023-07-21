import { Bike } from './bike.interface';

export interface User {
  /** Randomly generated primary key (UUID) by the database */
  id: string;

  /**
   * We'll just use an email as a user identifier
   * instead of worrying about a username, or a
   * formal first/last name.
   */
  email: string;

  /**
   * This is **NOT** the user's actual password! Instead,
   * this property will contain a hash of the password
   * specified when the user signed up. An API should
   * never be storing the actual password, encrypted or
   * not.
   */
  password: string;

  /**
   * A single user will be associated with zero, one, or more
   * to-do items, which means this field should never be
   * `undefined`. The object will always contain an array,
   * even if empty.
   */
  bikes: Bike[];
}

export type CreateUser = Pick<User, 'email' | 'password'>;
export type UpdateUser = Partial<Omit<User, 'id'>>;
export type UpsertUser = User;

/**
 * this was added so that we can consistently know which User properties
 * will be exposed in API payloads
 */
export type PublicUserData = Omit<User, 'password'>;
