import { Logger, Module } from '@nestjs/common';

import { ServerFeatureAuthModule } from '@cpt/server/feature-auth';
import { ServerFeatureBikeModule } from '@cpt/server/feature-bike';
import { ServerFeatureHealthModule } from '@cpt/server/feature-health';
import { DatabaseExceptionFilter, JwtAuthGuard } from '@cpt/server/util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_PATH: joi.string().default('tmp/db.sqlite'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const env = config.get('ENVIRONMENT') ?? 'development';
        const dbType = config.getOrThrow('DATABASE_TYPE');
        const dbName = config.getOrThrow('DATABASE_NAME');
        Logger.debug(`Detected environment: ${env}`);
        Logger.debug(`Attempting connection to ${dbType} database '${dbName}'`);
        return {
          type: dbType,
          host: config.get('DATABASE_HOST'),
          username: config.get('DATABASE_USERNAME'),
          password: config.get('DATABASE_PASSWORD'),
          port: config.get('DATABASE_PORT'),
          database: dbName,
          synchronize: true,
          logging: true,
          autoLoadEntities: true,
        } as TypeOrmModuleAsyncOptions; // HERES THE PROBLEM
      },
      inject: [ConfigService],
    }),
    ServerFeatureBikeModule,
    ServerFeatureHealthModule,
    ServerFeatureAuthModule,
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
})
export class AppModule {}
