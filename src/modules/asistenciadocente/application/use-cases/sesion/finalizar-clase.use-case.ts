import { Injectable, Inject } from '@nestjs/common';
import { SesionClaseEntity } from '../../../domain/entities/sesion-clase.entity';
import { SesionClaseRepositoryPort } from '../../../infrastructure/adapters/ports/sesion-clase.repository.port';
import { NotFoundError } from '../../../../../common/errors/not-found.error';
import { BusinessError } from '../../../../../common/errors/business.error';

@Injectable()
export class FinalizarClaseUseCase {
  constructor(
    @Inject(SesionClaseRepositoryPort)
    private readonly sesionRepo: SesionClaseRepositoryPort,
  ) {}

  async execute(id: number): Promise<SesionClaseEntity> {
    const sesion = await this.sesionRepo.buscarPorId(id);
    if (!sesion) {
      throw new NotFoundError(`Sesión con id ${id} no encontrada`);
    }

    if (sesion.estado !== 'INICIADA') {
      throw new BusinessError(
        `No se puede finalizar una sesión en estado "${sesion.estado}". Solo se permite finalizar desde estado INICIADA.`,
      );
    }

    return this.sesionRepo.actualizarEstado(id, 'FINALIZADA', undefined, new Date());
  }
}
