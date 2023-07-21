import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeEntitySchema } from './schemas/bike.entity-schema';
import { UserEntitySchema } from './schemas/user.entity-schema';

@Module({
  imports: [TypeOrmModule.forFeature([BikeEntitySchema, UserEntitySchema])],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
