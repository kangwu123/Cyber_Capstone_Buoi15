import { IsInt, IsNotEmpty } from 'class-validator';

export class SaveImageDto {
  @IsInt()
  @IsNotEmpty()
  image_id!: number;
}
