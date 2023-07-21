import { BikeEntitySchema } from '@cpt/server/data-access-bike';
import { Bike, CreateBike } from '@cpt/shared/domain';
import { createMockBike } from '@cpt/shared/util-testing';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ServerFeatureBikeService } from './server-feature-bike.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findOneBy: jest.fn(() => ({})),
    save: jest.fn((entity) => entity),
    findOneOrFail: jest.fn(() => ({})),
    delete: jest.fn(() => null),
    find: jest.fn((entities) => entities),
  })
);

describe('ServerFeatureBikeService', () => {
  let service: ServerFeatureBikeService;
  let repoMock: MockType<Repository<Bike>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServerFeatureBikeService,
        {
          provide: getRepositoryToken(BikeEntitySchema),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(ServerFeatureBikeService);
    repoMock = module.get(getRepositoryToken(BikeEntitySchema));
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
  it('should return an array of to-do items', async () => {
    const bikes = Array.from({ length: 5 }).map(() => createMockBike());
    repoMock.find?.mockReturnValue(bikes);
    expect((await service.getAll()).length).toBe(bikes.length);
    expect(repoMock.find).toHaveBeenCalled();
  });

  it('should return an a single bike by ID', async () => {
    const bikes = Array.from({ length: 5 }).map(() => createMockBike());
    repoMock.findOneBy?.mockReturnValue(bikes[0]);
    expect(await service.getOne(bikes[0].id)).toStrictEqual(bikes[0]);
    expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: bikes[0].id });
  });

  it('should throw an exception when a bike ID is not found', async () => {
    repoMock.findOneBy?.mockReturnValue(undefined);
    try {
      await service.getOne('foo');
    } catch (err) {
      expect(err instanceof NotFoundException).toBe(true);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: 'foo' });
    }
  });

  it('should create a bike', async () => {
    const bike = createMockBike();
    repoMock.save?.mockReturnValue(bike);
    expect(await service.create(bike)).toStrictEqual(bike);
    expect(repoMock.save).toHaveBeenCalledWith(bike);
  });

  it('should catch an error if a duplicate manufacturer is detected', async () => {
    const bike = createMockBike();
    repoMock.save?.mockImplementation((bike: CreateBike) => {
      const err = new QueryFailedError('unique constraint failed', [], {});
      err.message =
        'ERROR SQLITE_CONSTRAINT: UNIQUE constraint failed: bike.manufacturer';
      throw err;
    });
    try {
      await service.create(bike);
    } catch (err) {
      expect(err).toBeInstanceOf(QueryFailedError);
    }
  });

  it('should update a bike', async () => {
    const bike = createMockBike();
    const newTitle = 'foo';
    repoMock.findOneOrFail?.mockReturnValue({
      ...bike,
      manufacturer: newTitle,
    });
    const res = await service.update(bike.id, { manufacturer: newTitle });
    expect(res.manufacturer).toBe(newTitle);
    expect(repoMock.save).toHaveBeenCalledWith({
      id: bike.id,
      manufacturer: newTitle,
    });
    expect(repoMock.findOneOrFail).toHaveBeenCalled();
  });

  it('should upsert a bike', async () => {
    const bike = createMockBike();
    const newTitle = 'foo';
    repoMock.findOneOrFail?.mockReturnValue({
      ...bike,
      manufacturer: newTitle,
    });
    const res = await service.upsert(bike);
    expect(res.manufacturer).toBe(newTitle);
    expect(repoMock.save).toHaveBeenCalledWith(bike);
    expect(repoMock.findOneOrFail).toHaveBeenCalled();
  });

  it('should delete a bike', async () => {
    repoMock.delete?.mockReturnValue('foo');
    expect(await service.delete('foo')).toBeUndefined();
    expect(repoMock.delete).toHaveBeenCalledWith({ id: 'foo' });
  });
});
