import { Bike } from '@cpt/shared/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

const testData: Bike[] = [
  {
    id: '0',
    manufacturer: 'Propain',
    model: 'Tyee',
    date: '17.07.2023',
    archived: false,
  },
];

@Injectable()
export class ServerFeatureBikeService {
  private bikes$ = new BehaviorSubject<Bike[]>(testData);

  getAll(): Bike[] {
    return this.bikes$.value;
  }

  getOne(id: string): Bike {
    const bikes = this.bikes$.value.find((td) => td.id === id);
    if (!bikes) {
      throw new NotFoundException(`Bike could not be found!`);
    }
    return bikes;
  }

  create(bike: Pick<Bike, 'manufacturer' | 'model' | 'date'>): Bike {
    const current = this.bikes$.value;

    const newBike: Bike = {
      ...bike,
      id: `bike-${Math.floor(Math.random() * 10000)}`,
      archived: false,
    };

    this.bikes$.next([...current, newBike]);

    return newBike;
  }
}
