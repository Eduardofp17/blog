import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedefinePasswordDto {
  @ApiProperty({
    description: 'The user password',
    example: 'password123',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}
