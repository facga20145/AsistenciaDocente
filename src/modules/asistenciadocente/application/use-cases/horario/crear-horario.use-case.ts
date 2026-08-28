import { Injectable, Inject } from '@nestjs/common';
import { HorarioResponseDto } from '../../dtos/horario/horario-response.dto';
import { HorarioRepositoryPort } from '../../../infrastructure/adapters/ports/horario.repository.port';
import { CrearHorarioDto } from '../../dtos/horario/crear-horario.dto';
import { ConflictError } from '../../../../../common/errors/conflict.error';
import { BusinessError } from '../../../../../common/errors/business.error';
import { compararHoras, parseHora } from '../../utils/datetime.util';

@Injectable()
export class CrearHorarioUseCase {
  constructor(
    @Inject(HorarioRepositoryPort)
    private readonly horarioRepo: HorarioRepositoryPort,
  ) {}

  async execute(dto: CrearHorarioDto): Promise<HorarioResponseDto> {
    const horaInicio = parseHora(dto.horaInicio);
    const horaFin = parseHora(dto.horaFin);

    if (compararHoras(horaFin, horaInicio) <= 0) {
      throw new BusinessError('La hora de fin debe ser posterior a la hora de inicio');
    }

    const cruceDocente = await this.horarioRepo.existeCruceDocente(
      dto.docenteId,
      dto.diaSemana,
      horaInicio,
      horaFin,
    );
    if (cruceDocente) {
      throw new ConflictError('El docente tiene un horario solapado en este día y rango de horas');
    }

    const cruceAula = await this.horarioRepo.existeCruceAula(
      dto.aulaId,
      dto.diaSemana,
      horaInicio,
      horaFin,
    );
    if (cruceAula) {
      throw new ConflictError('El aula tiene un horario solapado en este día y rango de horas');
    }

    return HorarioResponseDto.fromEntity(
      await this.horarioRepo.crear({
        docenteId: dto.docenteId,
        cursoId: dto.cursoId,
        aulaId: dto.aulaId,
        diaSemana: dto.diaSemana,
        horaInicio,
        horaFin,
      }),
    );
  }
}
