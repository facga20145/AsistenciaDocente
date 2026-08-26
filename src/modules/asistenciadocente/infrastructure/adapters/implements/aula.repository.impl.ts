import { Injectable } from '@nestjs/common';
import { AulaEntity } from '../../../domain/entities/aula.entity';
import { AulaRepositoryPort } from '../ports/aula.repository.port';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaAulaRepository implements AulaRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: { nombre: string }): Promise<AulaEntity> {
    const aula = await this.prisma.aula.create({ data });
    return new AulaEntity(aula);
  }

  async listar(): Promise<AulaEntity[]> {
    const aulas = await this.prisma.aula.findMany({ orderBy: { nombre: 'asc' } });
    return aulas.map((a) => new AulaEntity(a));
  }

  async buscarPorId(id: number): Promise<AulaEntity | null> {
    const aula = await this.prisma.aula.findUnique({ where: { id } });
    return aula ? new AulaEntity(aula) : null;
  }

  async actualizar(id: number, data: { nombre: string }): Promise<AulaEntity> {
    const aula = await this.prisma.aula.update({ where: { id }, data });
    return new AulaEntity(aula);
  }

  async eliminar(id: number): Promise<void> {
    await this.prisma.aula.delete({ where: { id } });
  }

  async existeNombre(nombre: string, excludingId?: number): Promise<boolean> {
    const where: any = { nombre };
    if (excludingId) {
      where.id = { not: excludingId };
    }
    const count = await this.prisma.aula.count({ where });
    return count > 0;
  }
}
