import { IsString, IsEmail, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ActualizarDocenteDto {
  @ApiPropertyOptional({ example: 'Juan Carlos' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombres?: string;

  @ApiPropertyOptional({ example: 'Pérez López' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  apellidos?: string;

  @ApiPropertyOptional({ example: '87654321' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  dni?: string;

  @ApiPropertyOptional({ example: 'juan.actualizado@institucion.edu.pe' })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  estadoActivo?: boolean;
}
