import { Injectable, Inject } from '@nestjs/common';
import { DocenteEntity } from '../../../domain/entities/docente.entity';
import { DocenteRepositoryPort } from '../../../infrastructure/adapters/ports/docente.repository.port';
import { CrearDocenteDto } from '../../dtos/docente/crear-docente.dto';
import { ConflictError } from '../../../../../common/errors/conflict.error';

@Injectable()
export class CrearDocenteUseCase {
  constructor(
    @Inject(DocenteRepositoryPort)
    private readonly docenteRepo: DocenteRepositoryPort,
  ) {}

  async execute(dto: CrearDocenteDto): Promise<DocenteEntity> {
    if (dto.dni) {
      const existe = await this.docenteRepo.existeDni(dto.dni);
      if (existe) {
        throw new ConflictError(`Ya existe un docente con DNI ${dto.dni}`);
      }
    }
    return this.docenteRepo.crear(dto);
  }
}
