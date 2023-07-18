import { ServerDataAccessBikeModule } from '@cpt/server/data-access-bike';
import { Module } from '@nestjs/common';
import { ServerFeatureBikeController } from './server-feature-bike.controller';
import { ServerFeatureBikeService } from './server-feature-bike.service';

@Module({
  controllers: [ServerFeatureBikeController],
  providers: [ServerFeatureBikeService],
  exports: [ServerFeatureBikeService],
  imports: [ServerDataAccessBikeModule],
})
export class ServerFeatureBikeModule {}
