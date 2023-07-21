import { AccessTokenPayload, PublicUserData } from '@cpt/shared/domain';
import { createMockUser } from '@cpt/shared/util-testing';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { JwtStrategyService } from './jwt-strategy.service';

describe('JwtStrategyService', () => {
  let service: JwtStrategyService;
  let mockUser: PublicUserData;

  beforeAll(() => {
    process.env['JWT_SECRET'] = randPassword();
    mockUser = createMockUser();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [JwtStrategyService],
    }).compile();

    service = module.get<JwtStrategyService>(JwtStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an access token payload object', async () => {
    const tokenPayload: AccessTokenPayload = {
      sub: mockUser.id,
      email: mockUser.email,
    };
    const respData = await service.validate(tokenPayload);
    expect(respData).toStrictEqual({
      userId: mockUser.id,
      email: mockUser.email,
    });
  });
});
