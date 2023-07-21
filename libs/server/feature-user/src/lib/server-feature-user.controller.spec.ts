import { UserEntitySchema } from '@cpt/server/data-access';
import { repositoryMockFactory } from '@cpt/server/util/testing';
import { PublicUserData } from '@cpt/shared/domain';
import { createMockUser } from '@cpt/shared/util-testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerFeatureUserController } from './server-feature-user.controller';
import { ServerFeatureUserService } from './server-feature-user.service';

describe('ServerFeatureUserController', () => {
  let controller: ServerFeatureUserController;
  let service: ServerFeatureUserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatureUserService,
        {
          provide: getRepositoryToken(UserEntitySchema),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [ServerFeatureUserController],
    }).compile();

    controller = module.get(ServerFeatureUserController);
    service = module.get(ServerFeatureUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should create a user', async () => {
    const user = createMockUser();
    const publicUser: PublicUserData = {
      id: user.id,
      email: user.email,
      bikes: [],
    };
    jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(user));
    const res = await controller.createUser({
      email: user.email,
      password: user.password,
    });
    expect(res).toStrictEqual(publicUser);
  });
});
