import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    examples: ['teste123'],
    minLength: 6,
    maxLength: 50,
  })
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}
