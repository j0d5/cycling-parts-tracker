import { BikeEntitySchema } from '@cpt/server/data-access-bike';
import { Bike } from '@cpt/shared/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServerFeatureBikeService {
  constructor(
    @InjectRepository(BikeEntitySchema)
    private bikeRepository: Repository<Bike>
  ) {}

  async getAll(): Promise<Bike[]> {
    return await this.bikeRepository.find();
  }

  async getOne(id: string): Promise<Bike> {
    const bikes = await this.bikeRepository.findOneBy({ id });

    if (!bikes) {
      throw new NotFoundException(`Bike could not be found!`);
    }
    return bikes;
  }

  async create(
    bike: Pick<Bike, 'manufacturer' | 'model' | 'date'>
  ): Promise<Bike> {
    return await this.bikeRepository.save({ ...bike });
  }
}
