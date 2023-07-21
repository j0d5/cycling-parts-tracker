import { UserEntitySchema } from '@cpt/server/data-access';
import { CreateUser, UpdateUser, User } from '@cpt/shared/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class ServerFeatureUserService {
  constructor(
    @InjectRepository(UserEntitySchema)
    private userRepository: Repository<User>
  ) {}

  async getOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      /**
       * We could use `findOneOrFail()` from TypeORM, but
       * instead of a TypeORM exception I prefer to throw
       * native NestJS exceptions when possible
       */
      throw new NotFoundException(`User could not be found`);
    }
    return user;
  }

  async getOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    return user;
  }

  /**
   * TODO - make number of rounds configurable via ConfigService!
   */
  async create(user: CreateUser): Promise<User> {
    const { email, password } = user;
    // set the payload password to a _hash_ of the originally
    // supplied password!
    user.password = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.save({ email, password });
    return newUser;
  }

  async updateUser(id: string, data: UpdateUser): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    const updated = await this.userRepository.save({ id, ...data });
    return updated;
  }

  async deleteUser(id: string): Promise<null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User could not be found`);
    }
    await this.userRepository.remove(user);
    return null;
  }
}
