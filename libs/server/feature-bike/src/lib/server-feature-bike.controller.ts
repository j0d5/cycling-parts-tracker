import { Bike } from '@cpt/shared/domain';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BikeDto, CreateBikeDto } from './dtos/bike.dto';
import { ServerFeatureBikeService } from './server-feature-bike.service';

@Controller({ path: 'bikes' })
export class ServerFeatureBikeController {
  constructor(private serverFeatureBikeService: ServerFeatureBikeService) {}

  @Get('')
  @ApiOkResponse({
    type: BikeDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Returns all bike items',
    tags: ['bikes'],
  })
  getAll(): Promise<Bike[]> {
    return this.serverFeatureBikeService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Bike> {
    return this.serverFeatureBikeService.getOne(id);
  }

  @Post('')
  create(@Body() data: CreateBikeDto): Promise<Bike> {
    return this.serverFeatureBikeService.create(data);
  }
}
