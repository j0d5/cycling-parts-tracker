import { UserEntitySchema } from '@cpt/server/data-access';
import { MockType, repositoryMockFactory } from '@cpt/server/util/testing';
import { PublicUserData, User } from '@cpt/shared/domain';
import { createMockUser } from '@cpt/shared/util-testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randEmail } from '@ngneat/falso';
import { QueryFailedError, Repository } from 'typeorm';
import { ServerFeatureUserService } from './server-feature-user.service';

describe('ServerFeatureUserService', () => {
  let service: ServerFeatureUserService;
  let repoMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatureUserService,
        {
          provide: getRepositoryToken(UserEntitySchema),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(ServerFeatureUserService);
    repoMock = module.get(getRepositoryToken(UserEntitySchema));
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
    expect(repoMock).toBeTruthy();
  });

  it('should be able to create a user', async () => {
    const user = createMockUser();
    const publicUser: PublicUserData = {
      id: user.id,
      email: user.email,
      bikes: [],
    };
    repoMock.findOne?.mockReturnValue(null);
    repoMock.save?.mockReturnValue(publicUser);
    const newUser = await service.create({
      email: user.email,
      password: user.password,
    });
    expect(newUser).toStrictEqual(publicUser);
    expect(repoMock.save).toHaveBeenCalled();
  });

  it('should throw an error if the email already exists', async () => {
    const user = createMockUser();
    repoMock.save?.mockImplementation(() => {
      const err = new QueryFailedError('unique constraint failed', [], '');
      err.message = `ERROR SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email`;
      throw err;
    });
    try {
      await service.create({ email: user.email, password: user.password });
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should successfully find a user', async () => {
    const user = createMockUser();
    const publicUser: PublicUserData = {
      id: user.id,
      email: user.email,
      bikes: [],
    };
    repoMock.findOneBy?.mockReturnValue(publicUser);
    expect(await service.getOne(user.id)).toStrictEqual(publicUser);
    expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: user.id });
  });

  it('should throw if a user could not be found', async () => {
    repoMock.findOneBy?.mockImplementation(() => null);
    try {
      await service.getOne('foo');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should find a user by email', async () => {
    const user = createMockUser();
    const publicUser: PublicUserData = {
      id: user.id,
      email: user.email,
      bikes: [],
    };
    repoMock.findOneBy?.mockReturnValue(publicUser);
    expect(await service.getOneByEmail(user.email)).toStrictEqual(publicUser);
    expect(repoMock.findOneBy).toHaveBeenCalledWith({ email: user.email });
  });

  it('should throw if a user could not be found by email', async () => {
    repoMock.findOneBy?.mockImplementation(() => null);
    try {
      await service.getOneByEmail('foo');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should update a user if it exists', async () => {
    const user = createMockUser();
    const newEmail = randEmail();
    repoMock.findOneBy?.mockReturnValue(user);
    repoMock.save?.mockReturnValue({ ...user, email: newEmail });
    const res = await service.updateUser(user.id, { email: newEmail });
    expect(res).toStrictEqual({ ...user, email: newEmail });
  });

  it('should throw if a user could not be found during update', async () => {
    repoMock.findOneBy?.mockImplementation(() => null);
    try {
      await service.updateUser('', {});
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should delete a user if it exists', async () => {
    const user = createMockUser();
    repoMock.findOneBy?.mockReturnValue(user);
    const res = await service.deleteUser(user.id);
    expect(res).toBeNull();
  });

  it('should throw if a user could not be found during delete', async () => {
    repoMock.findOneBy?.mockImplementation(() => null);
    try {
      await service.deleteUser('');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
