import { Injectable, Inject } from '@nestjs/common';
import { HorarioRepositoryPort } from '../../../infrastructure/adapters/ports/horario.repository.port';
import { NotFoundError } from '../../../../../common/errors/not-found.error';

@Injectable()
export class EliminarHorarioUseCase {
  constructor(
    @Inject(HorarioRepositoryPort)
    private readonly horarioRepo: HorarioRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const existente = await this.horarioRepo.buscarPorId(id);
    if (!existente) {
      throw new NotFoundError(`Horario con id ${id} no encontrado`);
    }
    await this.horarioRepo.eliminar(id);
  }
}
