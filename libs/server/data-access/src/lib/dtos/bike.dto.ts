import { Bike, UpdateBike, UpsertBike } from '@cpt/shared/domain';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * This DTO was added so that a class can be used as a return type in the
 * Swagger documentation. All properties are marked `readOnly` in the
 * ApiProperty decorator since this DTO will only be used for responses.
 *
 * @export
 * @class BikeDto
 * @typedef {BikeDto}
 * @implements {Bike}
 */
export class BikeDto implements Bike {
  @ApiProperty({
    type: String,
    readOnly: true,
    example: 'DCA76BCC-F6CD-4211-A9F5-CD4E24381EC8',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    type: String,
    example: `Propain`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  manufacturer!: string;

  @ApiProperty({
    type: String,
    example: `Tyee`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiProperty({
    type: Date,
    example: `2023-04-26T23:50:00.505Z`,
    readOnly: true,
  })
  @IsDateString()
  @IsNotEmpty()
  date!: Date;

  @ApiProperty({
    type: Boolean,
    readOnly: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  archived!: boolean;
}

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateBikeDto
  implements Pick<Bike, 'manufacturer' | 'model' | 'date'>
{
  @ApiProperty({
    type: String,
    example: `Propain`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  manufacturer!: string;

  @ApiProperty({
    type: String,
    example: `Tyee`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiProperty({
    type: Date,
    example: `2023-04-26T23:50:00.505Z`,
    readOnly: true,
  })
  @IsDateString()
  @IsNotEmpty()
  date!: Date;
}

export class UpsertBikeDto implements UpsertBike {
  @ApiProperty({
    type: String,
    readOnly: true,
    example: 'DCA76BCC-F6CD-4211-A9F5-CD4E24381EC8',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    type: String,
    example: `Propain`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  manufacturer!: string;

  @ApiProperty({
    type: String,
    example: `Tyee`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiProperty({
    type: Date,
    example: `2023-04-26T23:50:00.505Z`,
    readOnly: true,
  })
  @IsDateString()
  @IsNotEmpty()
  date!: Date;

  @ApiProperty({
    type: Boolean,
    readOnly: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  archived!: boolean;
}

export class UpdateBikeDto implements UpdateBike {
  @ApiProperty({
    type: String,
    example: `Propain`,
    readOnly: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({
    type: String,
    example: `Tyee`,
    readOnly: true,
    required: false,
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    type: Date,
    example: `2023-04-26T23:50:00.505Z`,
    readOnly: true,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiProperty({
    type: Boolean,
    readOnly: true,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  archived?: boolean;
}
