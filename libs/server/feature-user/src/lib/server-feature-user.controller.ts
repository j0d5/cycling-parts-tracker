import { CreateUserDto } from '@cpt/server/data-access';
import { ReqUserId, SkipAuth } from '@cpt/server/util';
import { PublicUserData } from '@cpt/shared/domain';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServerFeatureUserService } from './server-feature-user.service';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class ServerFeatureUserController {
  constructor(private serverFeatureUserService: ServerFeatureUserService) {}

  @Post('')
  @SkipAuth()
  async createUser(@Body() userData: CreateUserDto): Promise<PublicUserData> {
    const { id, email } = await this.serverFeatureUserService.create(userData);
    return {
      id,
      email,
      bikes: [],
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  async getUser(
    @ReqUserId() reqUserId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<PublicUserData> {
    if (reqUserId !== id) {
      throw new NotFoundException();
    }
    const { password, ...user } = await this.serverFeatureUserService.getOne(
      id
    );
    return user;
  }
}
