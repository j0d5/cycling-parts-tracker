import { CreateUserDto } from '@cpt/server/data-access';
import { SkipAuth } from '@cpt/server/util';
import { PublicUserData } from '@cpt/shared/domain';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
