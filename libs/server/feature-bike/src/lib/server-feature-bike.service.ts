import { Bike } from '@cpt/shared/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

const testData: Bike[] = [
  {
    id: '1',
    title: 'Propain',
    description: 'Tyee',
    date: new Date('17.07.2023'),
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
}
