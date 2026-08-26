import { Injectable, Inject } from '@nestjs/common';
import { CursoEntity } from '../../../domain/entities/curso.entity';
import { CursoRepositoryPort } from '../../../infrastructure/adapters/ports/curso.repository.port';
import { CrearCursoDto } from '../../dtos/curso/crear-curso.dto';

@Injectable()
export class CrearCursoUseCase {
  constructor(
    @Inject(CursoRepositoryPort)
    private readonly cursoRepo: CursoRepositoryPort,
  ) {}

  async execute(dto: CrearCursoDto): Promise<CursoEntity> {
    return this.cursoRepo.crear(dto);
  }
}
