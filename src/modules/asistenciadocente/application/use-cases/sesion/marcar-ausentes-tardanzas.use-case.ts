import { Injectable, Inject } from '@nestjs/common';
import { SesionClaseRepositoryPort } from '../../../infrastructure/adapters/ports/sesion-clase.repository.port';
import {
  TOLERANCIA_TARDANZA_MS,
  hoyParaDb,
  msDesdeMedianocheLocal,
  msDesdeMedianochePrismaTime,
} from '../../utils/datetime.util';

@Injectable()
export class MarcarAusentesTardanzasUseCase {
  constructor(
    @Inject(SesionClaseRepositoryPort)
    private readonly sesionRepo: SesionClaseRepositoryPort,
  ) {}

  async execute(): Promise<{ tardanzas: number; ausentes: number }> {
    const hoy = hoyParaDb();
    const ahora = new Date();
    const ahoraMs = msDesdeMedianocheLocal(ahora);

    const sesiones = await this.sesionRepo.listarSinIniciarConInicioPasado(hoy, ahora);

    let tardanzas = 0;
    let ausentes = 0;

    for (const sesion of sesiones) {
      const inicioMs = msDesdeMedianochePrismaTime(sesion.horaInicioProgramada);
      const finMs = msDesdeMedianochePrismaTime(sesion.horaFinProgramada);
      const limiteAusenteMs = inicioMs + TOLERANCIA_TARDANZA_MS;

      // Pasó la hora de fin O superó 30 min de tolerancia sin iniciar → AUSENTE
      if (ahoraMs >= finMs || ahoraMs >= limiteAusenteMs) {
        if (sesion.estado !== 'AUSENTE') {
          await this.sesionRepo.actualizarEstado(sesion.id, 'AUSENTE');
          ausentes++;
        }
      } else if (sesion.estado === 'PROGRAMADA') {
        // Entre hora de inicio y los 30 min → TARDANZA (aún puede iniciar)
        await this.sesionRepo.actualizarEstado(sesion.id, 'TARDANZA');
        tardanzas++;
      }
    }

    return { tardanzas, ausentes };
  }
}
