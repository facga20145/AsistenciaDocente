import { Injectable } from '@nestjs/common';
import { CursoEntity } from '../../../domain/entities/curso.entity';
import { CursoRepositoryPort } from '../ports/curso.repository.port';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class PrismaCursoRepository implements CursoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: { nombre: string }): Promise<CursoEntity> {
    const curso = await this.prisma.curso.create({ data });
    return new CursoEntity(curso);
  }

  async listar(): Promise<CursoEntity[]> {
    const cursos = await this.prisma.curso.findMany({ orderBy: { nombre: 'asc' } });
    return cursos.map((c) => new CursoEntity(c));
  }

  async buscarPorId(id: number): Promise<CursoEntity | null> {
    const curso = await this.prisma.curso.findUnique({ where: { id } });
    return curso ? new CursoEntity(curso) : null;
  }

  async actualizar(id: number, data: { nombre: string }): Promise<CursoEntity> {
    const curso = await this.prisma.curso.update({ where: { id }, data });
    return new CursoEntity(curso);
  }

  async eliminar(id: number): Promise<void> {
    await this.prisma.curso.delete({ where: { id } });
  }
}
