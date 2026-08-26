import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GenerarSesionesDelDiaUseCase } from '../../application/use-cases/sesion/generar-sesiones-del-dia.use-case';
import { MarcarAusentesTardanzasUseCase } from '../../application/use-cases/sesion/marcar-ausentes-tardanzas.use-case';

@Injectable()
export class SesionesScheduler {
  private readonly logger = new Logger(SesionesScheduler.name);

  constructor(
    private readonly generarSesionesUC: GenerarSesionesDelDiaUseCase,
    private readonly marcarAusentesTardanzasUC: MarcarAusentesTardanzasUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generarSesionesDelDia() {
    this.logger.log('Ejecutando generación automática de sesiones del día...');
    try {
      const sesiones = await this.generarSesionesUC.execute();
      this.logger.log(`Sesiones generadas: ${sesiones.length}`);
    } catch (error) {
      this.logger.error('Error al generar sesiones del día', error);
    }
  }

  @Cron('0 */30 7-22 * * 1-6')
  async marcarAusentesTardanzas() {
    this.logger.log('Verificando tardanzas y ausentes...');
    try {
      const resultado = await this.marcarAusentesTardanzasUC.execute();
      this.logger.log(`Tardanzas: ${resultado.tardanzas}, Ausentes: ${resultado.ausentes}`);
    } catch (error) {
      this.logger.error('Error al marcar ausentes/tardanzas', error);
    }
  }
}
