import { Module } from '@nestjs/common';

import { ServerFeatureBikeModule } from '@cpt/server/feature-bike';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ServerFeatureBikeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
