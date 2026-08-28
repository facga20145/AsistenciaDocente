import { Injectable, Inject } from '@nestjs/common';
import { HorarioResponseDto } from '../../dtos/horario/horario-response.dto';
import { HorarioRepositoryPort } from '../../../infrastructure/adapters/ports/horario.repository.port';
import { ActualizarHorarioDto } from '../../dtos/horario/actualizar-horario.dto';
import { NotFoundError } from '../../../../../common/errors/not-found.error';
import { ConflictError } from '../../../../../common/errors/conflict.error';
import { BusinessError } from '../../../../../common/errors/business.error';
import { compararHoras, parseHora } from '../../utils/datetime.util';

@Injectable()
export class ActualizarHorarioUseCase {
  constructor(
    @Inject(HorarioRepositoryPort)
    private readonly horarioRepo: HorarioRepositoryPort,
  ) {}

  async execute(id: number, dto: ActualizarHorarioDto): Promise<HorarioResponseDto> {
    const existente = await this.horarioRepo.buscarPorId(id);
    if (!existente) {
      throw new NotFoundError(`Horario con id ${id} no encontrado`);
    }

    const docenteId = dto.docenteId ?? existente.docenteId;
    const aulaId = dto.aulaId ?? existente.aulaId;
    const diaSemana = dto.diaSemana ?? existente.diaSemana;
    const horaInicio = dto.horaInicio ? parseHora(dto.horaInicio) : existente.horaInicio;
    const horaFin = dto.horaFin ? parseHora(dto.horaFin) : existente.horaFin;

    if (compararHoras(horaFin, horaInicio) <= 0) {
      throw new BusinessError('La hora de fin debe ser posterior a la hora de inicio');
    }

    if (dto.horaInicio || dto.horaFin || dto.docenteId || dto.diaSemana) {
      const cruceDocente = await this.horarioRepo.existeCruceDocente(
        docenteId,
        diaSemana,
        horaInicio,
        horaFin,
        id,
      );
      if (cruceDocente) {
        throw new ConflictError('El docente tiene un horario solapado en este día y rango de horas');
      }
    }

    if (dto.horaInicio || dto.horaFin || dto.aulaId || dto.diaSemana) {
      const cruceAula = await this.horarioRepo.existeCruceAula(
        aulaId,
        diaSemana,
        horaInicio,
        horaFin,
        id,
      );
      if (cruceAula) {
        throw new ConflictError('El aula tiene un horario solapado en este día y rango de horas');
      }
    }

    const data: any = {};
    if (dto.docenteId !== undefined) data.docenteId = dto.docenteId;
    if (dto.cursoId !== undefined) data.cursoId = dto.cursoId;
    if (dto.aulaId !== undefined) data.aulaId = dto.aulaId;
    if (dto.diaSemana !== undefined) data.diaSemana = dto.diaSemana;
    if (dto.horaInicio !== undefined) data.horaInicio = parseHora(dto.horaInicio);
    if (dto.horaFin !== undefined) data.horaFin = parseHora(dto.horaFin);
    if (dto.activo !== undefined) data.activo = dto.activo;

    return HorarioResponseDto.fromEntity(await this.horarioRepo.actualizar(id, data));
  }
}
