import { Injectable, Inject } from '@nestjs/common';
import { HorarioEntity } from '../../../domain/entities/horario.entity';
import { HorarioRepositoryPort } from '../../../infrastructure/adapters/ports/horario.repository.port';

@Injectable()
export class ListarHorariosUseCase {
  constructor(
    @Inject(HorarioRepositoryPort)
    private readonly horarioRepo: HorarioRepositoryPort,
  ) {}

  async execute(): Promise<HorarioEntity[]> {
    return this.horarioRepo.listar();
  }
}
