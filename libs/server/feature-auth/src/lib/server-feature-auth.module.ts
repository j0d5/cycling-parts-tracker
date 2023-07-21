import { ServerDataAccessBikeModule } from '@cpt/server/data-access';
import { ServerFeatureUserModule } from '@cpt/server/feature-user';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategyService } from './jwt-strategy.service';
import { ServerFeatureAuthController } from './server-feature-auth.controller';
import { ServerFeatureAuthService } from './server-feature-auth.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => ServerFeatureUserModule),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            config.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '600s',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    ServerDataAccessBikeModule,
  ],
  controllers: [ServerFeatureAuthController],
  providers: [ServerFeatureAuthService, JwtStrategyService],
  exports: [ServerFeatureAuthService],
})
export class ServerFeatureAuthModule {}
