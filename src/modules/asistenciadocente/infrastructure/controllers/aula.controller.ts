import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrearAulaUseCase } from '../../application/use-cases/aula/crear-aula.use-case';
import { ListarAulasUseCase } from '../../application/use-cases/aula/listar-aulas.use-case';
import { CrearAulaDto } from '../../application/dtos/aula/crear-aula.dto';

@ApiTags('Aulas')
@Controller('aulas')
export class AulaController {
  constructor(
    private readonly crearAulaUC: CrearAulaUseCase,
    private readonly listarAulasUC: ListarAulasUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo aula', description: 'El nombre del aula debe ser único.' })
  crear(@Body() dto: CrearAulaDto) {
    return this.crearAulaUC.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las aulas' })
  listar() {
    return this.listarAulasUC.execute();
  }
}
