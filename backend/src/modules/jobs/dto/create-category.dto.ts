import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Blockchain Development' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  label: string;
}
