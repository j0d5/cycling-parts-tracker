import { Test } from '@nestjs/testing';
import { ServerFeatureBikeService } from './server-feature-bike.service';

describe('ServerFeatureBikeService', () => {
  let service: ServerFeatureBikeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatureBikeService],
    }).compile();

    service = module.get(ServerFeatureBikeService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
