import { randPassword, randUser } from '@ngneat/falso';

export const createMockUser = (data?: Partial<User>): User => {
  const { id, email } = randUser();
  const password = randPassword();
  return {
    id,
    email,
    password,
    todos: [],
    ...data,
  };
};
