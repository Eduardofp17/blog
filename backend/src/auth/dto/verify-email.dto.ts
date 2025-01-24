import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificationCodeDto {
  @ApiProperty({
    description: 'The verification code sent to the user',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}
