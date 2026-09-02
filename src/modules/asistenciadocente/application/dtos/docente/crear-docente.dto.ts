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

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiProperty({ example: 'juan.perez@institucion.edu.pe' })
  @IsEmail()
  correo: string;
}
