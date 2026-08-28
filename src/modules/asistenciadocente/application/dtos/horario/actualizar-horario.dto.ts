import { IsInt, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DiaSemana } from '@prisma/client';
import { IsHora } from '../../../../../common/validators/is-hora.decorator';

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

  @ApiPropertyOptional({ example: '09:00', description: 'Formato HH:mm' })
  @IsOptional()
  @IsHora()
  horaInicio?: string;

  @ApiPropertyOptional({ example: '11:00', description: 'Formato HH:mm' })
  @IsOptional()
  @IsHora()
  horaFin?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
