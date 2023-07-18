import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ServerFeatureHealthController } from './server-feature-health.controller';

@Module({
  controllers: [ServerFeatureHealthController],
  providers: [],
  exports: [],
  imports: [TerminusModule],
})
export class ServerFeatureHealthModule {}
