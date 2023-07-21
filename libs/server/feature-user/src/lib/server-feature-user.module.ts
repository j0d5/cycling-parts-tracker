import { ServerDataAccessBikeModule } from '@cpt/server/data-access';
import { Module } from '@nestjs/common';
import { ServerFeatureUserController } from './server-feature-user.controller';
import { ServerFeatureUserService } from './server-feature-user.service';

@Module({
  imports: [ServerDataAccessBikeModule],
  controllers: [ServerFeatureUserController],
  providers: [ServerFeatureUserService],
  exports: [ServerFeatureUserService],
})
export class ServerFeatureUserModule {}
