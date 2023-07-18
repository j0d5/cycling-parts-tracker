import { Module } from '@nestjs/common';

import { ServerFeatureBikeModule } from '@cpt/server/feature-bike';
import { ServerFeatureHealthModule } from '@cpt/server/feature-health';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DATABASE_PATH: joi.string().default('tmp/db.sqlite'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get('DATABASE_PATH'),
        synchronize: true,
        logging: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ServerFeatureBikeModule,
    ServerFeatureHealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
