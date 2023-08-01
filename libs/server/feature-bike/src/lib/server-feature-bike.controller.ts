import {
  BikeDto,
  CreateBikeDto,
  UpdateBikeDto,
  UpsertBikeDto,
} from '@cpt/server/data-access';
import { ReqUserId } from '@cpt/server/util';
import { Bike } from '@cpt/shared/domain';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ServerFeatureBikeService } from './server-feature-bike.service';

@Controller({ path: 'bikes', version: '1' })
@ApiTags('Bike')
@ApiBearerAuth()
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
  getAll(@ReqUserId() userId: string): Promise<Bike[]> {
    return this.serverFeatureBikeService.getAll(userId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: BikeDto,
  })
  @ApiOperation({
    summary: 'Returns a single bike if it exists',
    tags: ['bikes'],
  })
  getOne(@ReqUserId() userId: string, @Param('id') id: string): Promise<Bike> {
    return this.serverFeatureBikeService.getOne(userId, id);
  }

  @Post('')
  @ApiCreatedResponse({
    type: BikeDto,
  })
  @ApiOperation({
    summary: 'Creates a new bike and returns the saved object',
    tags: ['bikes'],
  })
  create(
    @ReqUserId() userId: string,
    @Body() data: CreateBikeDto
  ): Promise<Bike> {
    return this.serverFeatureBikeService.create(userId, data);
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
  async upsertOne(
    @ReqUserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpsertBikeDto
  ): Promise<Bike> {
    return this.serverFeatureBikeService.upsert(userId, id, data);
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
    @ReqUserId() userId: string,
    @Param('id') id: string,
    @Body() data: UpdateBikeDto
  ): Promise<Bike> {
    return this.serverFeatureBikeService.update(userId, id, data);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    type: undefined,
  })
  @ApiOperation({
    summary: 'Deletes a specific bike item',
    tags: ['bikes'],
  })
  @HttpCode(204)
  async delete(
    @ReqUserId() userId: string,
    @Param('id') id: string
  ): Promise<void> {
    return this.serverFeatureBikeService.delete(userId, id);
  }
}
