import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The content in portuguese writed in markdown',
    example: '# Estou muito feliz por escrever meu primeiro post.',
  })
  @IsNotEmpty()
  @IsString()
  contentPt: string;

  @ApiProperty({
    description: 'The content in english writed in markdown',
    example: '# I am so happy for write my first post.',
  })
  @IsNotEmpty()
  @IsString()
  contentEn: string;
}
