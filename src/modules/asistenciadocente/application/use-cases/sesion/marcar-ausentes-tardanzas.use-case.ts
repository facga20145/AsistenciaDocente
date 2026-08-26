import { Injectable, Inject } from '@nestjs/common';
import { SesionClaseRepositoryPort } from '../../../infrastructure/adapters/ports/sesion-clase.repository.port';

@Injectable()
export class MarcarAusentesTardanzasUseCase {
  constructor(
    @Inject(SesionClaseRepositoryPort)
    private readonly sesionRepo: SesionClaseRepositoryPort,
  ) {}

  async execute(): Promise<{ tardanzas: number; ausentes: number }> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ahora = new Date();
    const margenTardanza = new Date(ahora);
    margenTardanza.setMinutes(margenTardanza.getMinutes() - 15);

    const sesionesVencidas = await this.sesionRepo.listarProgramadasVencidas(hoy, ahora);

    let tardanzas = 0;
    let ausentes = 0;

    for (const sesion of sesionesVencidas) {
      const horaInicio = new Date(sesion.horaInicioProgramada);
      if (horaInicio > margenTardanza) {
        await this.sesionRepo.actualizarEstado(sesion.id, 'TARDANZA');
        tardanzas++;
      } else {
        await this.sesionRepo.actualizarEstado(sesion.id, 'AUSENTE');
        ausentes++;
      }
    }

    return { tardanzas, ausentes };
  }
}
