import { BikeEntitySchema } from '@cpt/server/data-access';
import { MockType, repositoryMockFactory } from '@cpt/server/util/testing';
import { Bike } from '@cpt/shared/domain';
import { createMockBike, createMockUser } from '@cpt/shared/util-testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randUuid, seed } from '@ngneat/falso';
import { Repository } from 'typeorm';
import { ServerFeatureBikeService } from './server-feature-bike.service';

const mockUser = createMockUser();

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

  beforeEach(() => {
    seed(Math.random().toString());
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of bike items for a specific user', async () => {
    const bikes = Array.from({ length: 5 }).map(() =>
      createMockBike(mockUser.id)
    );
    repoMock.find?.mockReturnValue(bikes);
    expect((await service.getAll(mockUser.id)).length).toBe(bikes.length);
    expect(repoMock.find).toHaveBeenCalled();
  });

  it('should return an a single bike by ID', async () => {
    const bikes = Array.from({ length: 5 }).map(() =>
      createMockBike(mockUser.id)
    );
    repoMock.findOneBy?.mockReturnValue(bikes[0]);
    expect(await service.getOne(mockUser.id, bikes[0].id)).toStrictEqual(
      bikes[0]
    );
    expect(repoMock.findOneBy).toHaveBeenCalledWith({
      id: bikes[0].id,
      user: { id: mockUser.id },
    });
  });

  it('should throw an exception when a bike ID is not found', async () => {
    repoMock.findOneBy?.mockReturnValue(undefined);
    try {
      await service.getOne(mockUser.id, 'foo');
    } catch (err) {
      expect(err instanceof NotFoundException).toBe(true);
      expect(repoMock.findOneBy).toHaveBeenCalledWith({
        id: 'foo',
        user: { id: mockUser.id },
      });
    }
  });

  it('should create a bike', async () => {
    const bike = createMockBike(mockUser.id);
    repoMock.findOneBy?.mockReturnValue(null);
    repoMock.findOneByOrFail?.mockReturnValue(bike);
    repoMock.save?.mockReturnValue(bike);
    expect(await service.create(mockUser.id, bike)).toStrictEqual(bike);
    expect(repoMock.save).toHaveBeenCalledWith({
      ...bike,
      user: {
        id: mockUser.id,
      },
    });
  });

  // it('should catch an error if a duplicate manufacturer is detected', async () => {
  //   const bike = createMockBike(mockUser.id);
  //   repoMock.save?.mockImplementation(() => {
  //     const err = new QueryFailedError('unique constraint failed', [], {});
  //     err.message =
  //       'ERROR SQLITE_CONSTRAINT: UNIQUE constraint failed: bike.manufacturer';
  //     throw err;
  //   });
  //   try {
  //     await service.create(mockUser.id, bike);
  //   } catch (err) {
  //     expect(err).toBeInstanceOf(BadRequestException);
  //   }
  // });

  it('should update a bike', async () => {
    const bike = createMockBike(mockUser.id);
    const newTitle = 'foo';
    repoMock.findOneOrFail?.mockReturnValue({
      ...bike,
      manufacturer: newTitle,
    });
    const res = await service.update(mockUser.id, bike.id, {
      manufacturer: newTitle,
    });
    expect(res.manufacturer).toBe(newTitle);
    expect(repoMock.save).toHaveBeenCalledWith({
      user: { id: mockUser.id },
      id: bike.id,
      manufacturer: newTitle,
    });
    expect(repoMock.findOneOrFail).toHaveBeenCalled();
  });

  it("should not update a bike that doesn't exist", async () => {
    repoMock.findOneBy?.mockReturnValue(null);
    try {
      await service.update(mockUser.id, '', {});
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should upsert a new bike', async () => {
    const bike = createMockBike(mockUser.id);
    const newTitle = 'foo';
    repoMock.findOne?.mockReturnValue(null);
    repoMock.findOneOrFail?.mockReturnValue({
      ...bike,
      manufacturer: newTitle,
    });
    const res = await service.upsert(mockUser.id, bike.id, bike);
    expect(res.manufacturer).toBe(newTitle);
    expect(repoMock.save).toHaveBeenCalledWith({
      ...bike,
      user: { id: mockUser.id },
    });
    expect(repoMock.findOneOrFail).toHaveBeenCalled();
  });

  it('should not upsert a bike of another user', async () => {
    const bike = createMockBike(mockUser.id);
    const altBike = createMockBike(randUuid());
    repoMock.findOne?.mockReturnValue(altBike);
    try {
      await service.upsert(mockUser.id, altBike.id, altBike);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should not allow ID to change during an upsert', async () => {
    const bike = createMockBike(mockUser.id);
    repoMock.findOne?.mockReturnValue(bike);
    try {
      await service.upsert(mockUser.id, bike.id, { ...bike, id: randUuid() });
    } catch (err) {
      console.log(err);
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should delete a bike', async () => {
    const bike = createMockBike(mockUser.id);
    repoMock.findOneBy?.mockReturnValue(bike);
    repoMock.remove?.mockReturnValue(bike);
    expect(await service.delete(mockUser.id, bike.id)).toBeUndefined();
    expect(repoMock.remove).toHaveBeenCalledWith(bike);
  });

  it("should not delete a bike that doesn't exist", async () => {
    repoMock.findOneBy?.mockReturnValue(null);
    try {
      await service.delete(mockUser.id, '');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
