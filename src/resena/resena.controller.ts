import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ResenaService } from './resena.service';
import { ResenaDto } from './resena.dto';
import { Resena } from './resena.entity';
import { plainToInstance } from 'class-transformer';

@Controller('resenas')
@UseInterceptors(BusinessErrorsInterceptor)
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @Post(':estudianteId/actividad/:actividadId')
  async agregarResena(
    @Param('estudianteId') estudianteId: number,
    @Param('actividadId') actividadId: number,
    @Body() resenaDto: ResenaDto,
  ) {
    const resena: Resena = plainToInstance(Resena, resenaDto);
    return await this.resenaService.agregarResena(
      estudianteId,
      actividadId,
      resena,
    );
  }
}
