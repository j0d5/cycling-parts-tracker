import { BikeEntitySchema } from '@cpt/server/data-access';
import { createMockBike } from '@cpt/shared/util-testing';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerFeatureBikeController } from './server-feature-bike.controller';
import { ServerFeatureBikeService } from './server-feature-bike.service';
import { repositoryMockFactory } from './server-feature-bike.service.spec';

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
    expect(service).toBeTruthy();
  });

  it('should return an array of bike items', async () => {
    // before anything else, this "spy" waits for service.getAll()
    // to be called, and returns a Promise that resolves to an
    // array of 5 to-do items
    jest.spyOn(service, 'getAll').mockReturnValue(
      new Promise((res) => {
        res(Array.from({ length: 5 }).map(() => createMockBike()));
      })
    );

    // call the method that is run when the GET request is made
    // and store the result
    const res = await controller.getAll();

    // finally, set our expectations for the above code:
    // - make sure the JSON payload returned by the controller
    //   is in fact an array
    // - ensure the length of the array matches the length
    //   that was assigned in the spy above
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(5);
  });

  it('should return a single bike by ID', async () => {
    const bike = createMockBike();
    jest.spyOn(service, 'getOne').mockReturnValue(Promise.resolve(bike));
    expect(await controller.getOne(bike.id)).toStrictEqual(bike);
  });

  it('should be able to create a new bike', async () => {
    const bike = createMockBike();
    jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(bike));
    const res = await controller.create({ ...bike });
    expect(res).toStrictEqual(bike);
  });

  it('should allow upserting a new bike', async () => {
    const bike = createMockBike();
    jest.spyOn(service, 'upsert').mockReturnValue(Promise.resolve(bike));
    const res = await controller.upsertOne(bike);
    expect(res).toStrictEqual(bike);
  });

  it('should allow updates to a single bike', async () => {
    const bike = createMockBike();
    const newTitle = 'newTitle';
    jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve({ ...bike, manufacturer: newTitle }));
    const updated = await controller.update(bike.id, {
      manufacturer: newTitle,
    });
    expect(updated.manufacturer).toBe(newTitle);
  });

  it('should delete a bike', async () => {
    jest.spyOn(service, 'delete').mockReturnValue(Promise.resolve());
    expect(await controller.delete('')).toBe(undefined);
  });
});
