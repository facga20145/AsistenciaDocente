import { Injectable, Inject } from '@nestjs/common';
import { CursoEntity } from '../../../domain/entities/curso.entity';
import { CursoRepositoryPort } from '../../../infrastructure/adapters/ports/curso.repository.port';

@Injectable()
export class ListarCursosUseCase {
  constructor(
    @Inject(CursoRepositoryPort)
    private readonly cursoRepo: CursoRepositoryPort,
  ) {}

  async execute(): Promise<CursoEntity[]> {
    return this.cursoRepo.listar();
  }
}
