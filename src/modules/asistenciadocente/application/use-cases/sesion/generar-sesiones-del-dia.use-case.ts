import { Injectable, Inject } from '@nestjs/common';
import { DiaSemana } from '@prisma/client';
import { SesionClaseEntity } from '../../../domain/entities/sesion-clase.entity';
import { SesionClaseRepositoryPort } from '../../../infrastructure/adapters/ports/sesion-clase.repository.port';
import { HorarioRepositoryPort } from '../../../infrastructure/adapters/ports/horario.repository.port';

@Injectable()
export class GenerarSesionesDelDiaUseCase {
  constructor(
    @Inject(SesionClaseRepositoryPort)
    private readonly sesionRepo: SesionClaseRepositoryPort,
    @Inject(HorarioRepositoryPort)
    private readonly horarioRepo: HorarioRepositoryPort,
  ) {}

  async execute(fecha?: Date): Promise<SesionClaseEntity[]> {
    const hoy = fecha || new Date();
    const diaSemana = this.obtenerDiaSemana(hoy);

    const horarios = await this.horarioRepo.listarActivosPorDia(diaSemana);
    const sesionesCreadas: SesionClaseEntity[] = [];

    for (const horario of horarios) {
      const yaExiste = await this.sesionRepo.existeSesionParaHorarioYFecha(horario.id, hoy);
      if (!yaExiste) {
        const sesion = await this.sesionRepo.crear({
          horarioId: horario.id,
          fecha: hoy,
          horaInicioProgramada: horario.horaInicio,
          horaFinProgramada: horario.horaFin,
        });
        sesionesCreadas.push(sesion);
      }
    }

    return sesionesCreadas;
  }

  private obtenerDiaSemana(fecha: Date): DiaSemana {
    const dias: DiaSemana[] = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    return dias[fecha.getDay()];
  }
}
