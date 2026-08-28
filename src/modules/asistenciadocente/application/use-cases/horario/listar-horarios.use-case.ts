import { Injectable, Inject } from '@nestjs/common';
import { HorarioResponseDto } from '../../dtos/horario/horario-response.dto';
import { HorarioRepositoryPort } from '../../../infrastructure/adapters/ports/horario.repository.port';

@Injectable()
export class ListarHorariosUseCase {
  constructor(
    @Inject(HorarioRepositoryPort)
    private readonly horarioRepo: HorarioRepositoryPort,
  ) {}

  async execute(): Promise<HorarioResponseDto[]> {
    const horarios = await this.horarioRepo.listar();
    return horarios.map((h) => HorarioResponseDto.fromEntity(h));
  }
}
