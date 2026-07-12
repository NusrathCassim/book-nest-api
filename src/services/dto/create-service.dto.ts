// src/services/dto/create-service.dto.ts
import { IsString, MinLength, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  duration!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}