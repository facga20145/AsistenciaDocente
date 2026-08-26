import { EstadoSesion } from '@prisma/client';

export class SesionClaseEntity {
  id: number;
  horarioId: number;
  fecha: Date;
  horaInicioProgramada: Date;
  horaFinProgramada: Date;
  estado: EstadoSesion;
  horaEntradaReal: Date | null;
  horaSalidaReal: Date | null;
  createdAt: Date;
  updatedAt: Date;

  horario?: any;

  constructor(partial: Partial<SesionClaseEntity>) {
    Object.assign(this, partial);
  }
}
