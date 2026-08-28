import { ApiProperty } from '@nestjs/swagger';
import { DiaSemana } from '@prisma/client';
import { formatHora } from '../../utils/datetime.util';

export class HorarioResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: DiaSemana })
  diaSemana: DiaSemana;

  @ApiProperty({ example: '09:00', description: 'Formato HH:mm' })
  horaInicio: string;

  @ApiProperty({ example: '11:00', description: 'Formato HH:mm' })
  horaFin: string;

  @ApiProperty({ example: true })
  activo: boolean;

  @ApiProperty({ example: { id: 1, nombres: 'Juan', apellidos: 'Pérez' } })
  docente: { id: number; nombres: string; apellidos: string };

  @ApiProperty({ example: { id: 1, nombre: 'Matemáticas' } })
  curso: { id: number; nombre: string };

  @ApiProperty({ example: { id: 1, nombre: 'Aula 101' } })
  aula: { id: number; nombre: string };

  static fromEntity(horario: any): HorarioResponseDto {
    const dto = new HorarioResponseDto();
    dto.id = horario.id;
    dto.diaSemana = horario.diaSemana;
    dto.horaInicio = formatHora(horario.horaInicio);
    dto.horaFin = formatHora(horario.horaFin);
    dto.activo = horario.activo;
    dto.docente = {
      id: horario.docente.id,
      nombres: horario.docente.nombres,
      apellidos: horario.docente.apellidos,
    };
    dto.curso = { id: horario.curso.id, nombre: horario.curso.nombre };
    dto.aula = { id: horario.aula.id, nombre: horario.aula.nombre };
    return dto;
  }
}
