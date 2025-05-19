import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from './estudiante.dto';
import { Estudiante } from './estudiante.entity';
import { plainToInstance } from 'class-transformer';

@Controller('estudiantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async crearEstudiante(@Body() estudianteDto: EstudianteDto) {
    const estudiante: Estudiante = plainToInstance(Estudiante, estudianteDto);
    return await this.estudianteService.crearEstudiante(estudiante);
  }

  @Get(':estudianteId')
  async findEstudianteById(@Param('estudianteId') estudianteId: number) {
    return await this.estudianteService.findEstudianteById(estudianteId);
  }

  @Post(':estudianteId/inscribir/:actividadId')
  async inscribirEstudiante(
    @Param('estudianteId') estudianteId: number,
    @Param('actividadId') actividadId: number,
  ) {
    return await this.estudianteService.inscribirseActividad(
      estudianteId,
      actividadId,
    );
  }
}
