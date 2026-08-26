import { Injectable, Inject } from '@nestjs/common';
import { AulaEntity } from '../../../domain/entities/aula.entity';
import { AulaRepositoryPort } from '../../../infrastructure/adapters/ports/aula.repository.port';
import { CrearAulaDto } from '../../dtos/aula/crear-aula.dto';
import { ConflictError } from '../../../../../common/errors/conflict.error';

@Injectable()
export class CrearAulaUseCase {
  constructor(
    @Inject(AulaRepositoryPort)
    private readonly aulaRepo: AulaRepositoryPort,
  ) {}

  async execute(dto: CrearAulaDto): Promise<AulaEntity> {
    const existe = await this.aulaRepo.existeNombre(dto.nombre);
    if (existe) {
      throw new ConflictError(`Ya existe un aula con el nombre "${dto.nombre}"`);
    }
    return this.aulaRepo.crear(dto);
  }
}
