import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrearDocenteUseCase } from '../../application/use-cases/docente/crear-docente.use-case';
import { ListarDocentesUseCase } from '../../application/use-cases/docente/listar-docentes.use-case';
import { CrearDocenteDto } from '../../application/dtos/docente/crear-docente.dto';
import { ActualizarDocenteDto } from '../../application/dtos/docente/actualizar-docente.dto';

@ApiTags('Docentes')
@Controller('docentes')
export class DocenteController {
  constructor(
    private readonly crearDocenteUC: CrearDocenteUseCase,
    private readonly listarDocentesUC: ListarDocentesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo docente', description: 'Registra un docente. El DNI debe ser único.' })
  crear(@Body() dto: CrearDocenteDto) {
    return this.crearDocenteUC.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los docentes' })
  listar() {
    return this.listarDocentesUC.execute();
  }
}
