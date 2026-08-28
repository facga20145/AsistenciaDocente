import { Injectable, Inject } from '@nestjs/common';
import { SesionClaseResponseDto } from '../../dtos/sesion/sesion-response.dto';
import { SesionClaseRepositoryPort } from '../../../infrastructure/adapters/ports/sesion-clase.repository.port';
import { MarcarAusentesTardanzasUseCase } from './marcar-ausentes-tardanzas.use-case';
import { hoyParaDb } from '../../utils/datetime.util';

@Injectable()
export class ListarSesionesHoyUseCase {
  constructor(
    @Inject(SesionClaseRepositoryPort)
    private readonly sesionRepo: SesionClaseRepositoryPort,
    private readonly marcarAusentesTardanzasUC: MarcarAusentesTardanzasUseCase,
  ) {}

  async execute(): Promise<SesionClaseResponseDto[]> {
    await this.marcarAusentesTardanzasUC.execute();

    const hoy = hoyParaDb();
    const sesiones = await this.sesionRepo.listarPorFecha(hoy);
    return sesiones.map((s) => SesionClaseResponseDto.fromEntity(s));
  }
}
