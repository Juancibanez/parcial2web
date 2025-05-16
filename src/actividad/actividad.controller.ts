import { Body, Controller, Post } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { CreateActividadDto } from './dto/create-actividad.dto';

@Controller('actividad')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  async crearActividad(@Body() data: CreateActividadDto) {
    return this.actividadService.crearActividad(data);
  }
}
