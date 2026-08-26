import { Injectable, Inject } from '@nestjs/common';
import { AulaEntity } from '../../../domain/entities/aula.entity';
import { AulaRepositoryPort } from '../../../infrastructure/adapters/ports/aula.repository.port';

@Injectable()
export class ListarAulasUseCase {
  constructor(
    @Inject(AulaRepositoryPort)
    private readonly aulaRepo: AulaRepositoryPort,
  ) {}

  async execute(): Promise<AulaEntity[]> {
    return this.aulaRepo.listar();
  }
}
