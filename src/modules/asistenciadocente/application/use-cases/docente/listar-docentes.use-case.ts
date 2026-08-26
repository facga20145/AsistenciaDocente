import { Injectable, Inject } from '@nestjs/common';
import { DocenteEntity } from '../../../domain/entities/docente.entity';
import { DocenteRepositoryPort } from '../../../infrastructure/adapters/ports/docente.repository.port';

@Injectable()
export class ListarDocentesUseCase {
  constructor(
    @Inject(DocenteRepositoryPort)
    private readonly docenteRepo: DocenteRepositoryPort,
  ) {}

  async execute(): Promise<DocenteEntity[]> {
    return this.docenteRepo.listar();
  }
}
