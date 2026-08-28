import { Injectable } from '@nestjs/common';
import { EstadoSesion } from '@prisma/client';
import { SesionClaseEntity } from '../../../domain/entities/sesion-clase.entity';
import { SesionClaseRepositoryPort } from '../ports/sesion-clase.repository.port';
import { PrismaService } from '../../config/prisma.service';
import {
  msDesdeMedianocheLocal,
  msDesdeMedianochePrismaTime,
} from '../../../application/utils/datetime.util';

@Injectable()
export class PrismaSesionClaseRepository implements SesionClaseRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: {
    horarioId: number;
    fecha: Date;
    horaInicioProgramada: Date;
    horaFinProgramada: Date;
  }): Promise<SesionClaseEntity> {
    const sesion = await this.prisma.sesionClase.create({
      data,
      include: { horario: { include: { docente: true, curso: true, aula: true } } },
    });
    return new SesionClaseEntity(sesion);
  }

  async listarPorFecha(fecha: Date): Promise<SesionClaseEntity[]> {
    const sesiones = await this.prisma.sesionClase.findMany({
      where: { fecha },
      include: { horario: { include: { docente: true, curso: true, aula: true } } },
      orderBy: { horaInicioProgramada: 'asc' },
    });
    return sesiones.map((s) => new SesionClaseEntity(s));
  }

  async buscarPorId(id: number): Promise<SesionClaseEntity | null> {
    const sesion = await this.prisma.sesionClase.findUnique({
      where: { id },
      include: { horario: { include: { docente: true, curso: true, aula: true } } },
    });
    return sesion ? new SesionClaseEntity(sesion) : null;
  }

  async existeSesionParaHorarioYFecha(horarioId: number, fecha: Date): Promise<boolean> {
    const count = await this.prisma.sesionClase.count({
      where: { horarioId, fecha },
    });
    return count > 0;
  }

  async actualizarEstado(
    id: number,
    estado: EstadoSesion,
    horaEntradaReal?: Date,
    horaSalidaReal?: Date,
  ): Promise<SesionClaseEntity> {
    const data: any = { estado };
    if (horaEntradaReal !== undefined) data.horaEntradaReal = horaEntradaReal;
    if (horaSalidaReal !== undefined) data.horaSalidaReal = horaSalidaReal;

    const sesion = await this.prisma.sesionClase.update({
      where: { id },
      data,
      include: { horario: { include: { docente: true, curso: true, aula: true } } },
    });
    return new SesionClaseEntity(sesion);
  }

  async listarSinIniciarConInicioPasado(
    fecha: Date,
    horaLimite: Date,
  ): Promise<SesionClaseEntity[]> {
    const limiteMs = msDesdeMedianocheLocal(horaLimite);

    const sesiones = await this.prisma.sesionClase.findMany({
      where: {
        fecha,
        estado: { in: ['PROGRAMADA', 'TARDANZA'] },
      },
      include: { horario: { include: { docente: true, curso: true, aula: true } } },
    });

    return sesiones
      .filter(
        (s) => msDesdeMedianochePrismaTime(s.horaInicioProgramada) < limiteMs,
      )
      .map((s) => new SesionClaseEntity(s));
  }
}
