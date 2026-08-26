import { IsInt, IsEnum, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DiaSemana } from '@prisma/client';

export class ActualizarHorarioDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  docenteId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  cursoId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  aulaId?: number;

  @ApiPropertyOptional({ enum: DiaSemana })
  @IsOptional()
  @IsEnum(DiaSemana)
  diaSemana?: DiaSemana;

  @ApiPropertyOptional({ example: '1970-01-01T08:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  horaInicio?: string;

  @ApiPropertyOptional({ example: '1970-01-01T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  horaFin?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
