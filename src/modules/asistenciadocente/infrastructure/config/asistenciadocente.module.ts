import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from './prisma.service';
import { SesionesScheduler } from './sesiones.scheduler';

// Controllers
import { DocenteController } from '../controllers/docente.controller';
import { CursoController } from '../controllers/curso.controller';
import { AulaController } from '../controllers/aula.controller';
import { HorarioController } from '../controllers/horario.controller';
import { SesionController } from '../controllers/sesion.controller';

// Repository Ports
import { DocenteRepositoryPort } from '../adapters/ports/docente.repository.port';
import { CursoRepositoryPort } from '../adapters/ports/curso.repository.port';
import { AulaRepositoryPort } from '../adapters/ports/aula.repository.port';
import { HorarioRepositoryPort } from '../adapters/ports/horario.repository.port';
import { SesionClaseRepositoryPort } from '../adapters/ports/sesion-clase.repository.port';

// Repository Implementations
import { PrismaDocenteRepository } from '../adapters/implements/docente.repository.impl';
import { PrismaCursoRepository } from '../adapters/implements/curso.repository.impl';
import { PrismaAulaRepository } from '../adapters/implements/aula.repository.impl';
import { PrismaHorarioRepository } from '../adapters/implements/horario.repository.impl';
import { PrismaSesionClaseRepository } from '../adapters/implements/sesion-clase.repository.impl';

// Use Cases - Docentes
import { CrearDocenteUseCase } from '../../application/use-cases/docente/crear-docente.use-case';
import { ListarDocentesUseCase } from '../../application/use-cases/docente/listar-docentes.use-case';

// Use Cases - Cursos
import { CrearCursoUseCase } from '../../application/use-cases/curso/crear-curso.use-case';
import { ListarCursosUseCase } from '../../application/use-cases/curso/listar-cursos.use-case';

// Use Cases - Aulas
import { CrearAulaUseCase } from '../../application/use-cases/aula/crear-aula.use-case';
import { ListarAulasUseCase } from '../../application/use-cases/aula/listar-aulas.use-case';

// Use Cases - Horarios
import { CrearHorarioUseCase } from '../../application/use-cases/horario/crear-horario.use-case';
import { ListarHorariosUseCase } from '../../application/use-cases/horario/listar-horarios.use-case';
import { ActualizarHorarioUseCase } from '../../application/use-cases/horario/actualizar-horario.use-case';
import { EliminarHorarioUseCase } from '../../application/use-cases/horario/eliminar-horario.use-case';

// Use Cases - Sesiones
import { GenerarSesionesDelDiaUseCase } from '../../application/use-cases/sesion/generar-sesiones-del-dia.use-case';
import { IniciarClaseUseCase } from '../../application/use-cases/sesion/iniciar-clase.use-case';
import { FinalizarClaseUseCase } from '../../application/use-cases/sesion/finalizar-clase.use-case';
import { ListarSesionesHoyUseCase } from '../../application/use-cases/sesion/listar-sesiones-hoy.use-case';
import { MarcarAusentesTardanzasUseCase } from '../../application/use-cases/sesion/marcar-ausentes-tardanzas.use-case';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    DocenteController,
    CursoController,
    AulaController,
    HorarioController,
    SesionController,
  ],
  providers: [
    PrismaService,
    // Repository bindings
    { provide: DocenteRepositoryPort, useClass: PrismaDocenteRepository },
    { provide: CursoRepositoryPort, useClass: PrismaCursoRepository },
    { provide: AulaRepositoryPort, useClass: PrismaAulaRepository },
    { provide: HorarioRepositoryPort, useClass: PrismaHorarioRepository },
    { provide: SesionClaseRepositoryPort, useClass: PrismaSesionClaseRepository },
    // Use Cases
    CrearDocenteUseCase,
    ListarDocentesUseCase,
    CrearCursoUseCase,
    ListarCursosUseCase,
    CrearAulaUseCase,
    ListarAulasUseCase,
    CrearHorarioUseCase,
    ListarHorariosUseCase,
    ActualizarHorarioUseCase,
    EliminarHorarioUseCase,
    GenerarSesionesDelDiaUseCase,
    IniciarClaseUseCase,
    FinalizarClaseUseCase,
    ListarSesionesHoyUseCase,
    MarcarAusentesTardanzasUseCase,
    SesionesScheduler,
  ],
  exports: [PrismaService],
})
export class AsistenciadocenteModule {}
