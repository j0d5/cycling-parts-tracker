import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [],
  providers: [],
  exports: [DatabaseModule],
  imports: [DatabaseModule],
})
export class ServerDataAccessBikeModule {}
