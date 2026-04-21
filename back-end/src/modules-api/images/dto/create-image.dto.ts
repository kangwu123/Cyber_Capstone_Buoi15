import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  image_name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
