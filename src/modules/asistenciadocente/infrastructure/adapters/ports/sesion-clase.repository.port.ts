import { EstadoSesion } from '@prisma/client';
import { SesionClaseEntity } from '../../../domain/entities/sesion-clase.entity';

export abstract class SesionClaseRepositoryPort {
  abstract crear(data: {
    horarioId: number;
    fecha: Date;
    horaInicioProgramada: Date;
    horaFinProgramada: Date;
  }): Promise<SesionClaseEntity>;
  abstract listarPorFecha(fecha: Date): Promise<SesionClaseEntity[]>;
  abstract buscarPorId(id: number): Promise<SesionClaseEntity | null>;
  abstract existeSesionParaHorarioYFecha(horarioId: number, fecha: Date): Promise<boolean>;
  abstract actualizarEstado(
    id: number,
    estado: EstadoSesion,
    horaEntradaReal?: Date,
    horaSalidaReal?: Date,
  ): Promise<SesionClaseEntity>;
  abstract listarSinIniciarConInicioPasado(fecha: Date, horaLimite: Date): Promise<SesionClaseEntity[]>;
}
