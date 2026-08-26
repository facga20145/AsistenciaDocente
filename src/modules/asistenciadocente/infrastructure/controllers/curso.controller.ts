import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrearCursoUseCase } from '../../application/use-cases/curso/crear-curso.use-case';
import { ListarCursosUseCase } from '../../application/use-cases/curso/listar-cursos.use-case';
import { CrearCursoDto } from '../../application/dtos/curso/crear-curso.dto';

@ApiTags('Cursos')
@Controller('cursos')
export class CursoController {
  constructor(
    private readonly crearCursoUC: CrearCursoUseCase,
    private readonly listarCursosUC: ListarCursosUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo curso' })
  crear(@Body() dto: CrearCursoDto) {
    return this.crearCursoUC.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los cursos' })
  listar() {
    return this.listarCursosUC.execute();
  }
}
