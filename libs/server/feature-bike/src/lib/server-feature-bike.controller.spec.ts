import { Test } from '@nestjs/testing';
import { ServerFeatureBikeController } from './server-feature-bike.controller';
import { ServerFeatureBikeService } from './server-feature-bike.service';

describe('ServerFeatureBikeController', () => {
  let controller: ServerFeatureBikeController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServerFeatureBikeService],
      controllers: [ServerFeatureBikeController],
    }).compile();

    controller = module.get(ServerFeatureBikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
