import { BikeEntitySchema } from '@cpt/server/data-access';
import { Bike } from '@cpt/shared/domain';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ServerFeatureBikeService {
  private readonly logger = new Logger(ServerFeatureBikeService.name);

  constructor(
    @InjectRepository(BikeEntitySchema)
    private bikeRepository: Repository<Bike>
  ) {}

  async getAll(userId: string): Promise<Bike[]> {
    return await this.bikeRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getOne(userId: string, id: string): Promise<Bike> {
    const bikes = await this.bikeRepository.findOneBy({
      id,
      user: { id: userId },
    });

    if (!bikes) {
      throw new NotFoundException(`Bike could not be found!`);
    }
    return bikes;
  }

  async create(
    userId: string,
    bike: Pick<Bike, 'manufacturer' | 'model' | 'date'>
  ): Promise<Bike> {
    const existing = await this.bikeRepository.findOneBy({
      manufacturer: bike.manufacturer,
      model: bike.model,
      user: { id: userId },
    });

    this.logger.debug(`Creating new bike, exists already: ${!!existing}`);

    if (existing) {
      throw new BadRequestException(
        `Bike with title '${bike.manufacturer}' already exists!`
      );
    }
    this.logger.debug(
      `Saving new bike\n${JSON.stringify(
        { ...bike, user_id: userId },
        null,
        2
      )}`
    );
    const newBike = await this.bikeRepository.save({
      ...bike,
      user: {
        id: userId,
      },
    });
    const saved = await this.bikeRepository.findOneByOrFail({
      id: newBike.id,
      user: {
        id: userId,
      },
    });
    return saved;
  }

  async update(
    userId: string,
    id: string,
    data: Partial<Omit<Bike, 'id'>>
  ): Promise<Bike> {
    const bike = await this.bikeRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!bike) {
      throw new NotFoundException(`Bike could not be found!`);
    }

    await this.bikeRepository.save({
      id,
      ...data,
      user: {
        id: userId,
      },
    });

    // re-query the database so that the updated record is returned
    const updated = await this.bikeRepository.findOneOrFail({
      where: { id, user: { id: userId } },
    });
    return updated;
  }

  async upsert(userId: string, bikeId: string, data: Bike): Promise<Bike> {
    // look for any bike with the given UUID
    const existingBike = await this.bikeRepository.findOne({
      where: { id: bikeId },
      select: {
        user: {
          id: true,
        },
      },
      relations: ['user'],
    });

    // bike with requested UUID exists, but belongs to another user
    if (existingBike && existingBike.user?.id !== userId) {
      // 404 isn't the right exception, as by definition any UPSERT operation
      // should create an entity when it's missing
      throw new BadRequestException(`Invalid UUID`);
    }

    // this.logger.debug(`UPSERT found bike: ${JSON.stringify(existingTodo, null, 2)}`);
    this.logger.debug(
      `Upserting bike ${data.id.split('-')[0]} for user ${userId.split('-')[0]}`
    );

    await this.bikeRepository.save({
      ...data,
      user: { id: userId },
    });

    // re-query the database so that the updated record is returned
    const updated = await this.bikeRepository.findOneOrFail({
      where: { id: data.id, user: { id: userId } },
    });

    return updated;
  }

  async delete(userId: string, id: string): Promise<void> {
    const bike = await this.bikeRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!bike) {
      throw new NotFoundException(`Bike could not be found!`);
    }
    await this.bikeRepository.remove(bike);
    return;
  }
}
