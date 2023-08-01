import { BikeEntitySchema, UserEntitySchema } from '@cpt/server/data-access';
import { ServerFeatureAuthModule } from '@cpt/server/feature-auth';
import { ServerFeatureBikeModule } from '@cpt/server/feature-bike';
import { ServerFeatureHealthModule } from '@cpt/server/feature-health';
import { ServerFeatureUserModule } from '@cpt/server/feature-user';
import { DatabaseExceptionFilter, JwtAuthGuard } from '@cpt/server/util';
import { Bike, PublicUserData, TokenResponse, User } from '@cpt/shared/domain';
import { createMockBike } from '@cpt/shared/util-testing';

import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { randEmail, randPassword, randUuid } from '@ngneat/falso';
import Joi from 'joi';
import * as request from 'supertest';

import { Repository } from 'typeorm';

describe('ServerFeatureBikeController E2E', () => {
  const baseUrl = `/api/v1`;
  const bikeUrl = `/bikes`;
  const userUrl = `/users`;
  const authUrl = `/auth`;

  const USER_EMAIL = randEmail();
  const USER_UNHASHED_PASSWORD = `Password1!`;

  let app: INestApplication;
  let bikeRepo: Repository<Bike>;
  let userRepo: Repository<User>;
  let createdUser: PublicUserData;
  let access_token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ServerFeatureBikeModule,
        ServerFeatureAuthModule,
        ServerFeatureUserModule,
        ServerFeatureHealthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
          ignoreEnvVars: true,
          validationSchema: Joi.object({
            DATABASE_PATH: Joi.string().default(':memory:'),
            DATABASE_LOGGING_ENABLED: Joi.boolean().default(false),
            ENVIRONMENT: Joi.string().default('test'),
            NODE_ENV: Joi.string().default('test'),
            JWT_SECRET: Joi.string().default(randPassword({ size: 32 })),
          }),
        }),
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => {
            // make sure this is cast as a boolean
            const logging = !!config.get('DATABASE_LOGGING_ENABLED');
            const database = config.get('DATABASE_PATH');
            return {
              type: 'sqlite',
              database,
              logging,
              synchronize: true,
              autoLoadEntities: true,
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: APP_FILTER,
          useClass: DatabaseExceptionFilter,
        },
      ],
      controllers: [],
    })
      .setLogger(new Logger())
      .compile();

    app = moduleRef.createNestApplication();

    bikeRepo = moduleRef.get(getRepositoryToken(BikeEntitySchema));
    userRepo = moduleRef.get(getRepositoryToken(UserEntitySchema));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      })
    );

    app.setGlobalPrefix('/api');
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
    });

    /////////////////////////////////////////////
    // App Setup (main.ts-related stuff) goes
    // above this line!
    /////////////////////////////////////////////

    await app.init();

    /////////////////////////////////////////////
    // Create a user that can be used for the
    // whole test suite
    /////////////////////////////////////////////
    createdUser = await request
      .default(app.getHttpServer())
      .post(`${baseUrl}${userUrl}`)
      .set('Content-type', 'application/json')
      .send({ email: USER_EMAIL, password: USER_UNHASHED_PASSWORD })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
        return res.body as PublicUserData;
      });

    /////////////////////////////////////////////
    // Create a valid, signed access token to be
    // used with all API calls
    /////////////////////////////////////////////
    access_token = await request
      .default(app.getHttpServer())
      .post(`${baseUrl}${authUrl}/login`)
      .send({ email: USER_EMAIL, password: USER_UNHASHED_PASSWORD })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((resp) => (resp.body as TokenResponse).access_token);
  });

  // beforeEach(() => {
  //   seed(String(Math.random));
  // });

  describe('GET /bikes', () => {
    it('should return an array of bike items', () => {
      return request
        .default(app.getHttpServer())
        .get(`${baseUrl}${bikeUrl}`)
        .auth(access_token, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect((res) => {
          return Array.isArray(res.body);
        });
    });

    it('should not return an array of bike items without auth', () => {
      return request
        .default(app.getHttpServer())
        .get(`${baseUrl}${bikeUrl}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect('Content-Type', /json/);
    });
  });

  describe('POST /bikes', () => {
    it('should create a bike item', () => {
      const { manufacturer, model, date } = createMockBike(createdUser.id);
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${bikeUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer, model, date })
        .expect('Content-Type', /json/)
        .expect((resp) => {
          Logger.debug(`POST /bikes: ${JSON.stringify(resp.body, null, 2)}`);
          const newBike = resp.body as Bike;
          expect(newBike.manufacturer).toEqual(manufacturer);
          expect(newBike.model).toEqual(model);
          expect(typeof newBike.archived).toEqual('boolean');
          expect(typeof newBike.id).toEqual('string');
          // expect(typeof newBike.date).toEqual('Date');
        })
        .expect(HttpStatus.CREATED);
    });

    it('should prevent adding a tbike with an ID', () => {
      const { id, manufacturer, model } = createMockBike(createdUser.id);

      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${bikeUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ id, manufacturer, model })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property id should not exist'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    // it('should prevent adding a bike with an existing manufacturer', async () => {
    //   const newBike = createMockBike(createdUser.id);
    //   await bikeRepo.save({
    //     manufacturer: newBike.manufacturer,
    //     model: newBike.model,
    //     user: {
    //       id: createdUser.id,
    //     },
    //   });
    //   return request
    //     .default(app.getHttpServer())
    //     .post(`${baseUrl}${bikeUrl}`)
    //     .auth(access_token, { type: 'bearer' })
    //     .send({
    //       manufacturer: newBike.manufacturer,
    //       model: newBike.model,
    //     })
    //     .expect((resp) => {
    //       const { message } = resp.body;
    //       // this error does not come back in the form of an array of
    //       // errors since it's a database error, not a payload
    //       // validation error
    //       expect(message.includes('already exists')).toBe(true);
    //     })
    //     .expect('Content-Type', /json/)
    //     .expect(HttpStatus.BAD_REQUEST);
    // });

    it('should prevent adding a bike item with a archived status', () => {
      const { manufacturer, model, archived } = createMockBike(createdUser.id);
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${bikeUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({
          manufacturer,
          model,
          archived,
        })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property archived should not exist'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for manufacturer', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${bikeUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer: 123 })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'manufacturer must be a string'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for model', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${bikeUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ model: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'model must be a string')
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce a required manufacturer', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${bikeUrl}`)
        .auth(access_token, { type: 'bearer' })
        .send({ model: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'manufacturer should not be empty'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should require an access token to create', () => {
      return request
        .default(app.getHttpServer())
        .post(`${baseUrl}${bikeUrl}`)
        .send({ manufacturer: 'foo', model: 'bar' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PATCH /bikes', () => {
    it('should successfully patch a bike', async () => {
      const { manufacturer, model } = createMockBike(createdUser.id);
      const updatedTitle = 'fooo';
      const originalBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });

      const url = `${baseUrl}${bikeUrl}/${originalBike.id}`;
      return request
        .default(app.getHttpServer())
        .patch(url)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer: updatedTitle, archived: true })
        .expect('Content-Type', /json/)
        .expect((resp) => {
          const newBike = resp.body as Bike;
          expect(newBike.manufacturer).toEqual(updatedTitle);
          expect(newBike.model).toEqual(model);
          expect(newBike.archived).toEqual(true);
          expect(typeof newBike.archived).toEqual('boolean');
          expect(typeof newBike.id).toEqual('string');
        })
        .expect(HttpStatus.OK);
    });

    it('should return a 404 for a non-existent bike', async () => {
      const url = `${baseUrl}${bikeUrl}/${randUuid()}`;
      return request
        .default(app.getHttpServer())
        .patch(url)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer: 'foo' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return a 404 for a bike that doesn't belong to the user", async () => {
      const altUser = await userRepo.save({
        email: randEmail(),
        password: 'Password1!',
      });
      const altUserBike = await bikeRepo.save({
        manufacturer: 'foo',
        model: 'bar',
        user: {
          id: altUser.id,
        },
      });
      const url = `${baseUrl}${bikeUrl}/${altUserBike.id}`;
      return request
        .default(app.getHttpServer())
        .patch(url)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer: 'foo' })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should prevent updating a bike with an ID', async () => {
      const { id, manufacturer, model } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ id, manufacturer, model })

        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'property id should not exist'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for manufacturer', async () => {
      const { manufacturer, model } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer: 123 })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'manufacturer must be a string'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for model', async () => {
      const { manufacturer, model } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ model: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'model must be a string')
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce boolean for archived', async () => {
      const { manufacturer, model } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .patch(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ archived: 123 })

        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'archived must be a boolean value'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT /bikes', () => {
    it('should successfully put a bike', async () => {
      const { id, manufacturer, model, archived, date } = createMockBike(
        createdUser.id
      );

      const url = `${baseUrl}${bikeUrl}/${id}`;
      return request
        .default(app.getHttpServer())
        .put(url)
        .auth(access_token, { type: 'bearer' })
        .send({ id, manufacturer, model, archived, date })
        .expect('Content-Type', /json/)
        .expect((resp) => {
          const newBike = resp.body as Bike;
          expect(newBike.manufacturer).toEqual(manufacturer);
          expect(newBike.model).toEqual(model);
          expect(typeof newBike.archived).toEqual('boolean');
          expect(typeof newBike.id).toEqual('string');
        })
        .expect(HttpStatus.OK);
    });

    it("should return a 400 for a bike that doesn't belong to the user", async () => {
      // create new user
      const altUser = await userRepo.save({
        email: randEmail(),
        password: 'Password1!',
      });
      // create bike for that user so that the UUID is already taken
      const altUserBike = await bikeRepo.save({
        manufacturer: 'foo',
        model: 'bar',
        user: {
          id: altUser.id,
        },
      });

      // use ID from new user's bike
      const url = `${baseUrl}${bikeUrl}/${altUserBike.id}`;

      const payload = {
        id: altUserBike.id,
        manufacturer: 'foo',
        model: 'bar',
        archived: false,
      };

      return (
        request
          .default(app.getHttpServer())
          .put(url)
          // use the access token with our user ID instead of new user
          .auth(access_token, { type: 'bearer' })
          .send(payload)
          .expect('Content-Type', /json/)
          .expect(HttpStatus.BAD_REQUEST)
      );
    });

    it('should prevent updating the ID of a bike', async () => {
      const { manufacturer, model, archived, date } = createMockBike(
        createdUser.id
      );
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      const payload = { id: randUuid(), manufacturer, model, archived, date };

      return request
        .default(app.getHttpServer())
        .put(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .send(payload)

        .expect((resp) => {
          const { message } = resp.body;
          expect(message).toBe(`Entity is not unique`);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for manufacturer', async () => {
      const { manufacturer, model } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .put(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer: 123, model })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'manufacturer must be a string'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce strings for model', async () => {
      const { manufacturer, model } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .put(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer, model: false })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some((m) => m === 'model must be a string')
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should enforce boolean for archived', async () => {
      const { manufacturer, model } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .put(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .send({ manufacturer, model, archived: 123 })
        .expect((resp) => {
          const { message } = resp.body;
          expect(
            (message as string[]).some(
              (m) => m === 'archived must be a boolean value'
            )
          ).toBe(true);
        })
        .expect('Content-Type', /json/)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /bikes', () => {
    it('should delete a bike', async () => {
      const { manufacturer, model, date } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
        date,
      });
      return request
        .default(app.getHttpServer())
        .delete(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .auth(access_token, { type: 'bearer' })
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should not delete a bike of another user', async () => {
      // create new user
      const altUser = await userRepo.save({
        email: randEmail(),
        password: 'Password1!',
      });
      // create bike for that user
      const altUserBike = await bikeRepo.save({
        manufacturer: 'foo',
        model: 'bar',
        user: {
          id: altUser.id,
        },
      });
      // use ID from new user's bike
      const url = `${baseUrl}${bikeUrl}/${altUserBike.id}`;
      return request
        .default(app.getHttpServer())
        .delete(url)
        .auth(access_token, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should require authorization', async () => {
      const { manufacturer, model } = createMockBike(createdUser.id);
      const newBike = await bikeRepo.save({
        manufacturer,
        model,
        user: {
          id: createdUser.id,
        },
      });
      return request
        .default(app.getHttpServer())
        .delete(`${baseUrl}${bikeUrl}/${newBike.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await bikeRepo.query('DELETE FROM bike');
  });
});
