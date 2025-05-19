import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadDto } from './actividad.dto';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Actividad } from './actividad.entity';

@Controller('actividades')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  async crearActividad(@Body() actividadDto: ActividadDto) {
    const actividad: Actividad = plainToInstance(Actividad, actividadDto);
    return this.actividadService.crearActividad(actividad);
  }

  @Put(':actividadId/cambiarEstado')
  async cambiarEstado(
    @Param('actividadId') actividadId: number,
    @Body('nuevoEstado') nuevoEstado: number,
  ) {
    return this.actividadService.cambiarEstado(actividadId, nuevoEstado);
  }

  @Get(':fecha')
  async findAllActividadesByDate(@Param('fecha') fecha: string) {
    return this.actividadService.findAllActividadesByDate(fecha);
  }
}
