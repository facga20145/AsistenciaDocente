import { DiaSemana } from '@prisma/client';
import { HorarioEntity } from '../../../domain/entities/horario.entity';

export abstract class HorarioRepositoryPort {
  abstract crear(data: {
    docenteId: number;
    cursoId: number;
    aulaId: number;
    diaSemana: DiaSemana;
    horaInicio: Date;
    horaFin: Date;
  }): Promise<HorarioEntity>;
  abstract listar(): Promise<HorarioEntity[]>;
  abstract buscarPorId(id: number): Promise<HorarioEntity | null>;
  abstract actualizar(id: number, data: {
    docenteId?: number;
    cursoId?: number;
    aulaId?: number;
    diaSemana?: DiaSemana;
    horaInicio?: Date;
    horaFin?: Date;
    activo?: boolean;
  }): Promise<HorarioEntity>;
  abstract eliminar(id: number): Promise<void>;
  abstract existeCruceDocente(
    docenteId: number,
    diaSemana: DiaSemana,
    horaInicio: Date,
    horaFin: Date,
    excludingId?: number,
  ): Promise<boolean>;
  abstract existeCruceAula(
    aulaId: number,
    diaSemana: DiaSemana,
    horaInicio: Date,
    horaFin: Date,
    excludingId?: number,
  ): Promise<boolean>;
  abstract listarActivosPorDia(diaSemana: DiaSemana): Promise<HorarioEntity[]>;
}
