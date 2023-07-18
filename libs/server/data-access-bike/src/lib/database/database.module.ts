import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeEntitySchema } from './schemas/bike.entity-schema';

@Module({
  imports: [TypeOrmModule.forFeature([BikeEntitySchema])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
