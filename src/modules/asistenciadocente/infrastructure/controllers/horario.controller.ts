import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CrearHorarioUseCase } from '../../application/use-cases/horario/crear-horario.use-case';
import { ListarHorariosUseCase } from '../../application/use-cases/horario/listar-horarios.use-case';
import { ActualizarHorarioUseCase } from '../../application/use-cases/horario/actualizar-horario.use-case';
import { EliminarHorarioUseCase } from '../../application/use-cases/horario/eliminar-horario.use-case';
import { CrearHorarioDto } from '../../application/dtos/horario/crear-horario.dto';
import { ActualizarHorarioDto } from '../../application/dtos/horario/actualizar-horario.dto';

@ApiTags('Horarios')
@Controller('horarios')
export class HorarioController {
  constructor(
    private readonly crearHorarioUC: CrearHorarioUseCase,
    private readonly listarHorariosUC: ListarHorariosUseCase,
    private readonly actualizarHorarioUC: ActualizarHorarioUseCase,
    private readonly eliminarHorarioUC: EliminarHorarioUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un horario',
    description: 'Valida que no exista cruce de horario para el mismo docente ni para el mismo aula en el día y rango de horas.',
  })
  crear(@Body() dto: CrearHorarioDto) {
    return this.crearHorarioUC.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los horarios' })
  listar() {
    return this.listarHorariosUC.execute();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un horario', description: 'Revalida cruces de horario al modificar campos relevantes.' })
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarHorarioDto) {
    return this.actualizarHorarioUC.execute(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un horario' })
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.eliminarHorarioUC.execute(id);
  }
}
