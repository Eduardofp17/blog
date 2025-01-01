import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  contentPt?: string;

  @IsString()
  @IsOptional()
  contentEn?: string;
}
