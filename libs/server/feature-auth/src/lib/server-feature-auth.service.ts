import { ServerFeatureUserService } from '@cpt/server/feature-user';
import {
  AccessTokenPayload,
  PublicUserData,
  TokenResponse,
} from '@cpt/shared/domain';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ServerFeatureAuthService {
  private readonly logger = new Logger(ServerFeatureAuthService.name);

  constructor(
    @Inject(forwardRef(() => ServerFeatureUserService))
    private userService: ServerFeatureUserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<PublicUserData | null> {
    const user = await this.userService.getOneByEmail(email);
    // console.dir(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.debug(`User '${email}' authenticated successfully`);
      console.log(`User '${email}' authenticated successfully`);
      const { password, ...publicUserData } = user;
      return publicUserData;
    }
    return null;
  }

  async generateAccessToken(user: PublicUserData): Promise<TokenResponse> {
    const payload: AccessTokenPayload = {
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
