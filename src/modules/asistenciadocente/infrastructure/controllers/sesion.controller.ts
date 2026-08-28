import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GenerarSesionesDelDiaUseCase } from '../../application/use-cases/sesion/generar-sesiones-del-dia.use-case';
import { IniciarClaseUseCase } from '../../application/use-cases/sesion/iniciar-clase.use-case';
import { FinalizarClaseUseCase } from '../../application/use-cases/sesion/finalizar-clase.use-case';
import { ListarSesionesHoyUseCase } from '../../application/use-cases/sesion/listar-sesiones-hoy.use-case';
import { MarcarAusentesTardanzasUseCase } from '../../application/use-cases/sesion/marcar-ausentes-tardanzas.use-case';
import { SesionClaseResponseDto } from '../../application/dtos/sesion/sesion-response.dto';

@ApiTags('Sesiones de Clase')
@Controller('sesiones')
export class SesionController {
  constructor(
    private readonly generarSesionesUC: GenerarSesionesDelDiaUseCase,
    private readonly iniciarClaseUC: IniciarClaseUseCase,
    private readonly finalizarClaseUC: FinalizarClaseUseCase,
    private readonly listarSesionesHoyUC: ListarSesionesHoyUseCase,
    private readonly marcarAusentesTardanzasUC: MarcarAusentesTardanzasUseCase,
  ) {}

  @Post('generar-del-dia')
  @ApiOperation({
    summary: 'Generar sesiones del día',
    description: 'Crea las instancias de sesiones_clase a partir de los horarios activos para el día actual. Idempotente: no duplica sesiones existentes.',
  })
  generarDelDia() {
    return this.generarSesionesUC
      .execute()
      .then((sesiones) => sesiones.map((s) => SesionClaseResponseDto.fromEntity(s)));
  }

  @Get('hoy')
  @ApiOperation({
    summary: 'Listar sesiones de hoy',
    description: 'Devuelve todas las sesiones del día actual con info de docente, curso y aula. Para la vista pública (polling cada 10-15s).',
  })
  listarHoy() {
    return this.listarSesionesHoyUC.execute();
  }

  @Post(':id/iniciar')
  @ApiOperation({
    summary: 'Iniciar clase',
    description:
      'Marca la sesión como INICIADA y registra horaEntradaReal = NOW(). Permite iniciar desde PROGRAMADA, TARDANZA o AUSENTE (llegada tardía manual).',
  })
  async iniciar(@Param('id', ParseIntPipe) id: number) {
    const sesion = await this.iniciarClaseUC.execute(id);
    return SesionClaseResponseDto.fromEntity(sesion);
  }

  @Post(':id/finalizar')
  @ApiOperation({
    summary: 'Finalizar clase',
    description: 'Marca la sesión como FINALIZADA y registra horaSalidaReal = NOW(). Solo permite finalizar desde estado INICIADA.',
  })
  async finalizar(@Param('id', ParseIntPipe) id: number) {
    const sesion = await this.finalizarClaseUC.execute(id);
    return SesionClaseResponseDto.fromEntity(sesion);
  }

  @Post('marcar-ausentes-tardanzas')
  @ApiOperation({
    summary: 'Marcar ausentes y tardanzas',
    description: 'Revisa sesiones en estado PROGRAMADA cuya hora de inicio ya pasó. Marca como TARDANZA (si aún puede iniciar) o AUSENTE (si ya pasó la clase completa).',
  })
  marcarAusentesTardanzas() {
    return this.marcarAusentesTardanzasUC.execute();
  }
}
