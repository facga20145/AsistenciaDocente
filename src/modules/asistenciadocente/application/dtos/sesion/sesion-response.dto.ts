import { ApiProperty } from '@nestjs/swagger';
import { EstadoSesion } from '@prisma/client';

export class SesionClaseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  horarioId: number;

  @ApiProperty({ example: '2026-08-26' })
  fecha: Date;

  @ApiProperty({ example: '08:00:00' })
  horaInicioProgramada: string;

  @ApiProperty({ example: '10:00:00' })
  horaFinProgramada: string;

  @ApiProperty({ enum: EstadoSesion, example: EstadoSesion.PROGRAMADA })
  estado: EstadoSesion;

  @ApiProperty({ example: null, nullable: true })
  horaEntradaReal: Date | null;

  @ApiProperty({ example: null, nullable: true })
  horaSalidaReal: Date | null;

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
    dto.fecha = sesion.fecha;
    dto.horaInicioProgramada = sesion.horaInicioProgramada;
    dto.horaFinProgramada = sesion.horaFinProgramada;
    dto.estado = sesion.estado;
    dto.horaEntradaReal = sesion.horaEntradaReal;
    dto.horaSalidaReal = sesion.horaSalidaReal;
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
