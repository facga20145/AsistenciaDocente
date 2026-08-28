import { Injectable, Inject } from '@nestjs/common';
import { SesionClaseEntity } from '../../../domain/entities/sesion-clase.entity';
import { SesionClaseRepositoryPort } from '../../../infrastructure/adapters/ports/sesion-clase.repository.port';
import { NotFoundError } from '../../../../../common/errors/not-found.error';
import { BusinessError } from '../../../../../common/errors/business.error';
import { claseAunEnHorario } from '../../utils/datetime.util';

@Injectable()
export class IniciarClaseUseCase {
  constructor(
    @Inject(SesionClaseRepositoryPort)
    private readonly sesionRepo: SesionClaseRepositoryPort,
  ) {}

  async execute(id: number): Promise<SesionClaseEntity> {
    const sesion = await this.sesionRepo.buscarPorId(id);
    if (!sesion) {
      throw new NotFoundError(`Sesión con id ${id} no encontrada`);
    }

    if (
      sesion.estado !== 'PROGRAMADA' &&
      sesion.estado !== 'TARDANZA' &&
      sesion.estado !== 'AUSENTE'
    ) {
      throw new BusinessError(
        `No se puede iniciar una sesión en estado "${sesion.estado}". Solo se permite iniciar desde PROGRAMADA, TARDANZA o AUSENTE.`,
      );
    }

    if (!claseAunEnHorario(sesion.horaFinProgramada)) {
      throw new BusinessError(
        'La clase ya terminó. No se puede registrar entrada.',
      );
    }

    return this.sesionRepo.actualizarEstado(id, 'INICIADA', new Date());
  }
}
