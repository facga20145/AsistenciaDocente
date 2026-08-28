import { IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiaSemana } from '@prisma/client';
import { IsHora } from '../../../../../common/validators/is-hora.decorator';

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

  @ApiProperty({ example: '09:00', description: 'Hora de inicio (HH:mm)' })
  @IsHora()
  horaInicio: string;

  @ApiProperty({ example: '11:00', description: 'Hora de fin (HH:mm)' })
  @IsHora()
  horaFin: string;
}
