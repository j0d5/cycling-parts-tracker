import { Bike } from '@cpt/shared/domain';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateBikeDto } from './dtos/bike.dto';
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

  @Post('')
  create(@Body() data: CreateBikeDto): Bike {
    return this.serverFeatureBikeService.create(data);
  }
}
