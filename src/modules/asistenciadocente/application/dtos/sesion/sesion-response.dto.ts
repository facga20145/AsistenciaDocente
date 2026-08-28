import { ApiProperty } from '@nestjs/swagger';
import { EstadoSesion } from '@prisma/client';
import {
  calcularMinutosTrabajados,
  formatFecha,
  formatFechaHora,
  formatHora,
} from '../../utils/datetime.util';

export class SesionClaseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  horarioId: number;

  @ApiProperty({ example: '28/08/2026', description: 'Formato dd/mm/yyyy' })
  fecha: string;

  @ApiProperty({ example: '09:00', description: 'Formato HH:mm' })
  horaInicioProgramada: string;

  @ApiProperty({ example: '11:00', description: 'Formato HH:mm' })
  horaFinProgramada: string;

  @ApiProperty({ enum: EstadoSesion, example: EstadoSesion.PROGRAMADA })
  estado: EstadoSesion;

  @ApiProperty({ example: null, nullable: true, description: 'Formato dd/mm/yyyy HH:mm:ss' })
  horaEntradaReal: string | null;

  @ApiProperty({ example: null, nullable: true, description: 'Formato dd/mm/yyyy HH:mm:ss' })
  horaSalidaReal: string | null;

  @ApiProperty({
    example: 120,
    nullable: true,
    description: 'Minutos entre horaEntradaReal y horaSalidaReal (para reportes)',
  })
  minutosTrabajados: number | null;

  @ApiProperty({
    example: { id: 1, nombres: 'Juan Carlos', apellidos: 'Pérez López' },
  })
  docente: {
    id: number;
    nombres: string;
    apellidos: string;
  };

  @ApiProperty({
    example: { id: 1, nombre: 'Matemáticas' },
  })
  curso: {
    id: number;
    nombre: string;
  };

  @ApiProperty({
    example: { id: 1, nombre: 'Aula 101' },
  })
  aula: {
    id: number;
    nombre: string;
  };

  static fromEntity(sesion: any): SesionClaseResponseDto {
    const dto = new SesionClaseResponseDto();
    dto.id = sesion.id;
    dto.horarioId = sesion.horarioId;
    dto.fecha = formatFecha(sesion.fecha);
    dto.horaInicioProgramada = formatHora(sesion.horaInicioProgramada);
    dto.horaFinProgramada = formatHora(sesion.horaFinProgramada);
    dto.estado = sesion.estado;
    dto.horaEntradaReal = sesion.horaEntradaReal
      ? formatFechaHora(sesion.horaEntradaReal)
      : null;
    dto.horaSalidaReal = sesion.horaSalidaReal
      ? formatFechaHora(sesion.horaSalidaReal)
      : null;
    dto.minutosTrabajados = calcularMinutosTrabajados(
      sesion.horaEntradaReal,
      sesion.horaSalidaReal,
    );
    if (sesion.horario) {
      dto.docente = {
        id: sesion.horario.docente.id,
        nombres: sesion.horario.docente.nombres,
        apellidos: sesion.horario.docente.apellidos,
      };
      dto.curso = {
        id: sesion.horario.curso.id,
        nombre: sesion.horario.curso.nombre,
      };
      dto.aula = {
        id: sesion.horario.aula.id,
        nombre: sesion.horario.aula.nombre,
      };
    }
    return dto;
  }
}
