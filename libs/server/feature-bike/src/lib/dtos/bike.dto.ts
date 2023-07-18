import { Bike, UpdateBike, UpsertBike } from '@cpt/shared/domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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
    type: String,
    example: `10.10.2023`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  date!: string;

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
    type: String,
    example: `10.10.2023`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  date!: string;
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
    type: String,
    example: `10.10.2023`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  date!: string;

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
    type: String,
    example: `10.10.2023`,
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({
    type: Boolean,
    readOnly: true,
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  archived!: boolean;
}
