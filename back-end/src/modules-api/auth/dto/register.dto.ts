import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @IsOptional()
  @IsString()
  avatar?: string;
}
