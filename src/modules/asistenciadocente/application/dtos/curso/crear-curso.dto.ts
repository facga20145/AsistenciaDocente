import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearCursoDto {
  @ApiProperty({ example: 'Matemáticas' })
  @IsString()
  @MinLength(2)
  nombre: string;
}
