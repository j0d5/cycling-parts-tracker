import { Bike } from '@cpt/shared/domain';
import { Controller, Get, Param } from '@nestjs/common';
import { ServerFeatureBikeService } from './server-feature-bike.service';

@Controller('server-feature-bike')
export class ServerFeatureBikeController {
  constructor(private serverFeatureBikeService: ServerFeatureBikeService) {}

  @Get('')
  getAll(): Bike[] {
    return this.serverFeatureBikeService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Bike {
    return this.serverFeatureBikeService.getOne(id);
  }
}
