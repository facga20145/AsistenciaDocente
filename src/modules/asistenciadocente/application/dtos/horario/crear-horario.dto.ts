import { IsInt, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiaSemana } from '@prisma/client';

export class CrearHorarioDto {
  @ApiProperty({ example: 1, description: 'ID del docente' })
  @IsInt()
  docenteId: number;

  @ApiProperty({ example: 1, description: 'ID del curso' })
  @IsInt()
  cursoId: number;

  @ApiProperty({ example: 1, description: 'ID del aula' })
  @IsInt()
  aulaId: number;

  @ApiProperty({ enum: DiaSemana, example: DiaSemana.LUNES })
  @IsEnum(DiaSemana)
  diaSemana: DiaSemana;

  @ApiProperty({ example: '1970-01-01T08:00:00.000Z', description: 'Hora de inicio (ISO Time)' })
  @IsDateString()
  horaInicio: string;

  @ApiProperty({ example: '1970-01-01T10:00:00.000Z', description: 'Hora de fin (ISO Time)' })
  @IsDateString()
  horaFin: string;
}
