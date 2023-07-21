import { LoginPayload, TokenResponse } from '@cpt/shared/domain';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto implements LoginPayload {
  @ApiProperty({
    type: String,
    example: `wallace@thefullstack.engineer`,
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Password1!',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class LoginResponseDto implements TokenResponse {
  @ApiProperty({
    type: String,
    readOnly: true,
  })
  @IsString()
  access_token!: string;
}
