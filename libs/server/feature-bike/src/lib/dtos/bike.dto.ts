import { Bike } from '@cpt/shared/domain';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateBikeDto
  implements Pick<Bike, 'manufacturer' | 'model' | 'date'>
{
  @IsString()
  @IsNotEmpty()
  manufacturer!: string;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;
}
