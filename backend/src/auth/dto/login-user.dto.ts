import {
  IsNotEmpty,
  IsString,
  Length,
  ValidateIf,
  IsEmail,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email or the username of the user',
    examples: ['Eduardofp17', 'user@example.com'],
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.emailOrUsername && !o.emailOrUsername.includes('@'))
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers',
  })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  @ValidateIf((o) => o.emailOrUsername && o.emailOrUsername.includes('@'))
  @IsEmail()
  emailOrUsername: string;

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
