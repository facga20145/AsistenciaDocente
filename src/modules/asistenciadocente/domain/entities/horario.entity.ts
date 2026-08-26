import { DiaSemana } from '@prisma/client';

export class HorarioEntity {
  id: number;
  docenteId: number;
  cursoId: number;
  aulaId: number;
  diaSemana: DiaSemana;
  horaInicio: Date;
  horaFin: Date;
  activo: boolean;
  createdAt: Date;

  docente?: any;
  curso?: any;
  aula?: any;

  constructor(partial: Partial<HorarioEntity>) {
    Object.assign(this, partial);
  }
}
