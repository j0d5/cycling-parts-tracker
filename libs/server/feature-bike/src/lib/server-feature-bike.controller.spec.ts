import { BikeEntitySchema } from '@cpt/server/data-access';
import { repositoryMockFactory } from '@cpt/server/util/testing';
import { createMockBike, createMockUser } from '@cpt/shared/util-testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerFeatureBikeController } from './server-feature-bike.controller';
import { ServerFeatureBikeService } from './server-feature-bike.service';

const mockUser = createMockUser();

describe('ServerFeatureBikeController', () => {
  let controller: ServerFeatureBikeController;
  let service: ServerFeatureBikeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatureBikeService,
        {
          provide: getRepositoryToken(BikeEntitySchema),
          useFactory: repositoryMockFactory,
        },
      ],
      controllers: [ServerFeatureBikeController],
    }).compile();

    controller = module.get(ServerFeatureBikeController);
    service = module.get(ServerFeatureBikeService);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should return an array of to-do items', async () => {
    jest
      .spyOn(service, 'getAll')
      .mockReturnValue(
        Promise.resolve(
          Array.from({ length: 5 }).map(() => createMockBike(mockUser.id))
        )
      );

    const res = await controller.getAll(mockUser.id);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(5);
  });

  it('should return a single bike by ID', async () => {
    const bike = createMockBike(mockUser.id);
    jest.spyOn(service, 'getOne').mockReturnValue(Promise.resolve(bike));
    expect(await controller.getOne(mockUser.id, bike.id)).toStrictEqual(bike);
  });

  it('should be able to create a new bike', async () => {
    const bike = createMockBike(mockUser.id);
    jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(bike));
    const res = await controller.create(mockUser.id, { ...bike });
    expect(res).toStrictEqual(bike);
  });

  it('should allow upserting a new bike', async () => {
    const bike = createMockBike(mockUser.id);
    jest.spyOn(service, 'upsert').mockReturnValue(Promise.resolve(bike));
    const res = await controller.upsertOne(mockUser.id, bike.id, bike);
    expect(res).toStrictEqual(bike);
  });

  it('should allow updates to a single bike', async () => {
    const bike = createMockBike(mockUser.id);
    const newTitle = 'newTitle';
    jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve({ ...bike, manufacturer: newTitle }));
    const updated = await controller.update(mockUser.id, bike.id, {
      manufacturer: newTitle,
    });
    expect(updated.manufacturer).toBe(newTitle);
  });

  it('should delete a bike', async () => {
    jest.spyOn(service, 'delete').mockReturnValue(Promise.resolve());
    expect(await controller.delete(mockUser.id, '')).toBe(undefined);
  });
});
