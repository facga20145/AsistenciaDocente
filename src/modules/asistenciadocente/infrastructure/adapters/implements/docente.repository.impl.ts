import { Injectable } from '@nestjs/common';
import { DocenteEntity } from '../../../domain/entities/docente.entity';
import { DocenteRepositoryPort } from '../ports/docente.repository.port';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaDocenteRepository implements DocenteRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: { nombres: string; apellidos: string; dni?: string; correo: string }): Promise<DocenteEntity> {
    const docente = await this.prisma.docente.create({ data });
    return new DocenteEntity(docente);
  }

  async listar(): Promise<DocenteEntity[]> {
    const docentes = await this.prisma.docente.findMany({ orderBy: { apellidos: 'asc' } });
    return docentes.map((d) => new DocenteEntity(d));
  }

  async buscarPorId(id: number): Promise<DocenteEntity | null> {
    const docente = await this.prisma.docente.findUnique({ where: { id } });
    return docente ? new DocenteEntity(docente) : null;
  }

  async actualizar(id: number, data: { nombres?: string; apellidos?: string; dni?: string; correo?: string; estadoActivo?: boolean }): Promise<DocenteEntity> {
    const docente = await this.prisma.docente.update({ where: { id }, data });
    return new DocenteEntity(docente);
  }

  async eliminar(id: number): Promise<void> {
    await this.prisma.docente.delete({ where: { id } });
  }

  async existeDni(dni: string, excludingId?: number): Promise<boolean> {
    const where: any = { dni };
    if (excludingId) {
      where.id = { not: excludingId };
    }
    const count = await this.prisma.docente.count({ where });
    return count > 0;
  }
}
