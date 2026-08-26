import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearAulaDto {
  @ApiProperty({ example: 'Aula 101' })
  @IsString()
  @MinLength(1)
  nombre: string;
}
