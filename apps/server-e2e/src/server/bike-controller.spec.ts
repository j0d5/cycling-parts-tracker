import { BikeEntitySchema } from '@cpt/server/data-access-bike';
import {
  ServerFeatureBikeController,
  ServerFeatureBikeService,
} from '@cpt/server/feature-bike';
import { Bike } from '@cpt/shared/domain';
import { createMockBike } from '@cpt/shared/util-testing';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

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

describe('ServerFeatureBikeController E2E', () => {
  const bikeUrl = `/bikes`;
  let app: INestApplication;
  let repoMock: MockType<Repository<Bike>>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      providers: [
        ServerFeatureBikeService,
        {
          provide: getRepositoryToken(BikeEntitySchema),
          useFactory: repositoryMockFactory,
        },
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
          }),
        },
      ],
      controllers: [ServerFeatureBikeController],
    }).compile();

    app = moduleRef.createNestApplication();
    repoMock = moduleRef.get(getRepositoryToken(BikeEntitySchema));

    await app.init();
  });

  describe('GET /bikes', () => {
    it('should return an array of bike items', () => {
      return request
        .default(app.getHttpServer())
        .get(bikeUrl)
        .expect(HttpStatus.OK);
    });
  });

  describe('POST /bikes', () => {
    it('should create a bike item', () => {
      const { id, archived, manufacturer, model, date } = createMockBike();
      jest
        .spyOn(repoMock, 'save')
        .mockReturnValue(
          Promise.resolve({ id, archived, manufacturer, model, date })
        );
      return request
        .default(app.getHttpServer())
        .post(bikeUrl)
        .send({ manufacturer, model, date })
        .expect((resp) => {
          const newBike = resp.body as Bike;
          expect(newBike.manufacturer).toEqual(manufacturer);
          expect(newBike.model).toEqual(model);
          expect(newBike.date).toEqual(date.toISOString());
          expect(typeof newBike.archived).toEqual('boolean');
          expect(typeof newBike.id).toEqual('string');
        })
        .expect(HttpStatus.CREATED);
    });

    it('should prevent adding a bike with an ID', () => {
      const { id, manufacturer, model, date } = createMockBike();
      return request
        .default(app.getHttpServer())
        .post(bikeUrl)
        .send({ id, manufacturer, model, date })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property id must not exist'
            )
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should prevent adding a bike item with a archived status', () => {
      const { id, ...bike } = createMockBike();
      return request
        .default(app.getHttpServer())
        .post(bikeUrl)
        .send(bike)
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property should must not exist'
            )
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for manufacturer', () => {
      return request
        .default(app.getHttpServer())
        .post(bikeUrl)
        .send({ manufacturer: 123 })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'manufacturer must be a string'
            )
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for model', () => {
      return request
        .default(app.getHttpServer())
        .post(bikeUrl)
        .send({ model: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'model must be a string')
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce a required manufacturer', () => {
      return request
        .default(app.getHttpServer())
        .post(bikeUrl)
        .send({ model: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'manufacturer should not be empty'
            )
          );
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
