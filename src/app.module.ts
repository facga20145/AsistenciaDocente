import { Module } from '@nestjs/common';
import { AsistenciadocenteModule } from './modules/asistenciadocente/infrastructure/config/asistenciadocente.module';

@Module({
  imports: [AsistenciadocenteModule],
})
export class AppModule {}
