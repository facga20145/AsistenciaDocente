import { Injectable, Inject } from '@nestjs/common';
import { SesionClaseResponseDto } from '../../dtos/sesion/sesion-response.dto';
import { SesionClaseRepositoryPort } from '../../../infrastructure/adapters/ports/sesion-clase.repository.port';

@Injectable()
export class ListarSesionesHoyUseCase {
  constructor(
    @Inject(SesionClaseRepositoryPort)
    private readonly sesionRepo: SesionClaseRepositoryPort,
  ) {}

  async execute(): Promise<SesionClaseResponseDto[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const sesiones = await this.sesionRepo.listarPorFecha(hoy);
    return sesiones.map((s) => SesionClaseResponseDto.fromEntity(s));
  }
}
