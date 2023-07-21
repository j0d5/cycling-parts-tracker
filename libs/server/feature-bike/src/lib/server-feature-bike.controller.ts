import { Bike } from '@cpt/shared/domain';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  BikeDto,
  CreateBikeDto,
  UpdateBikeDto,
  UpsertBikeDto,
} from './dtos/bike.dto';
import { ServerFeatureBikeService } from './server-feature-bike.service';

@Controller({ path: 'bikes', version: '1' })
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
  @ApiOkResponse({
    type: BikeDto,
  })
  @ApiOperation({
    summary: 'Returns a single bike if it exists',
    tags: ['bikes'],
  })
  getOne(@Param('id') id: string): Promise<Bike> {
    return this.serverFeatureBikeService.getOne(id);
  }

  @Post('')
  @ApiCreatedResponse({
    type: BikeDto,
  })
  @ApiOperation({
    summary: 'Creates a new bike and returns the saved object',
    tags: ['bikes'],
  })
  create(@Body() data: CreateBikeDto): Promise<Bike> {
    return this.serverFeatureBikeService.create(data);
  }

  @Put(':id')
  @ApiOkResponse({
    type: BikeDto,
  })
  @ApiCreatedResponse({
    type: BikeDto,
  })
  @ApiOperation({
    summary: 'Replaces all values for a single bike',
    tags: ['bikes'],
  })
  async upsertOne(@Body() data: UpsertBikeDto): Promise<Bike> {
    return this.serverFeatureBikeService.upsert(data);
  }

  @Patch(':id')
  @ApiOkResponse({
    type: BikeDto,
  })
  @ApiOperation({
    summary: 'Partially updates a single bike',
    tags: ['bikes'],
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateBikeDto
  ): Promise<Bike> {
    return this.serverFeatureBikeService.update(id, data);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    type: undefined,
  })
  @ApiOperation({
    summary: 'Deletes a specific bike item',
    tags: ['bikes'],
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.serverFeatureBikeService.delete(id);
  }
}
