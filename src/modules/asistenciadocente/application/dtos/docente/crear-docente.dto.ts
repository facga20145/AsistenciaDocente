import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearDocenteDto {
  @ApiProperty({ example: 'Juan Carlos' })
  @IsString()
  @MinLength(2)
  nombres: string;

  @ApiProperty({ example: 'Pérez López' })
  @IsString()
  @MinLength(2)
  apellidos: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MinLength(8)
  dni: string;

  @ApiPropertyOptional({ example: 'juan.perez@institucion.edu.pe' })
  @IsOptional()
  @IsEmail()
  correo?: string;
}
