import { Injectable } from '@nestjs/common';
import { DiaSemana } from '@prisma/client';
import { HorarioEntity } from '../../../domain/entities/horario.entity';
import { HorarioRepositoryPort } from '../ports/horario.repository.port';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaHorarioRepository implements HorarioRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: {
    docenteId: number;
    cursoId: number;
    aulaId: number;
    diaSemana: DiaSemana;
    horaInicio: Date;
    horaFin: Date;
  }): Promise<HorarioEntity> {
    const horario = await this.prisma.horario.create({
      data,
      include: { docente: true, curso: true, aula: true },
    });
    return new HorarioEntity(horario);
  }

  async listar(): Promise<HorarioEntity[]> {
    const horarios = await this.prisma.horario.findMany({
      include: { docente: true, curso: true, aula: true },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
    return horarios.map((h) => new HorarioEntity(h));
  }

  async buscarPorId(id: number): Promise<HorarioEntity | null> {
    const horario = await this.prisma.horario.findUnique({
      where: { id },
      include: { docente: true, curso: true, aula: true },
    });
    return horario ? new HorarioEntity(horario) : null;
  }

  async actualizar(id: number, data: {
    docenteId?: number;
    cursoId?: number;
    aulaId?: number;
    diaSemana?: DiaSemana;
    horaInicio?: Date;
    horaFin?: Date;
    activo?: boolean;
  }): Promise<HorarioEntity> {
    const horario = await this.prisma.horario.update({
      where: { id },
      data,
      include: { docente: true, curso: true, aula: true },
    });
    return new HorarioEntity(horario);
  }

  async eliminar(id: number): Promise<void> {
    await this.prisma.horario.delete({ where: { id } });
  }

  async existeCruceDocente(
    docenteId: number,
    diaSemana: DiaSemana,
    horaInicio: Date,
    horaFin: Date,
    excludingId?: number,
  ): Promise<boolean> {
    const where: any = {
      docenteId,
      diaSemana,
      activo: true,
      id: excludingId ? { not: excludingId } : undefined,
      OR: [
        {
          horaInicio: { lt: horaFin },
          horaFin: { gt: horaInicio },
        },
      ],
    };
    const count = await this.prisma.horario.count({ where });
    return count > 0;
  }

  async existeCruceAula(
    aulaId: number,
    diaSemana: DiaSemana,
    horaInicio: Date,
    horaFin: Date,
    excludingId?: number,
  ): Promise<boolean> {
    const where: any = {
      aulaId,
      diaSemana,
      activo: true,
      id: excludingId ? { not: excludingId } : undefined,
      OR: [
        {
          horaInicio: { lt: horaFin },
          horaFin: { gt: horaInicio },
        },
      ],
    };
    const count = await this.prisma.horario.count({ where });
    return count > 0;
  }

  async listarActivosPorDia(diaSemana: DiaSemana): Promise<HorarioEntity[]> {
    const horarios = await this.prisma.horario.findMany({
      where: { diaSemana, activo: true },
      include: { docente: true, curso: true, aula: true },
    });
    return horarios.map((h) => new HorarioEntity(h));
  }
}
