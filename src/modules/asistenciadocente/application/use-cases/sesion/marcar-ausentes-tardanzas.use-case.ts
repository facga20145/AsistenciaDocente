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
    const ahoraMs = this.msDesdeMedianoche(ahora);

    const sesionesVencidas = await this.sesionRepo.listarProgramadasVencidas(hoy, ahora);

    let tardanzas = 0;
    let ausentes = 0;

    for (const sesion of sesionesVencidas) {
      const inicioMs = this.msDesdeMedianoche(sesion.horaInicioProgramada);
      const finMs = this.msDesdeMedianoche(sesion.horaFinProgramada);

      // La clase completa ya pasó sin iniciarse → AUSENTE
      if (ahoraMs >= finMs) {
        await this.sesionRepo.actualizarEstado(sesion.id, 'AUSENTE');
        ausentes++;
      } else {
        // Todavía está dentro del rango de la clase → TARDANZA (aún puede iniciar)
        await this.sesionRepo.actualizarEstado(sesion.id, 'TARDANZA');
        tardanzas++;
      }
    }

    return { tardanzas, ausentes };
  }

  private msDesdeMedianoche(fecha: Date): number {
    return fecha.getHours() * 3_600_000 + fecha.getMinutes() * 60_000 + fecha.getSeconds() * 1_000;
  }
}