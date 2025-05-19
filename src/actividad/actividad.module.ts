import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './actividad.entity';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Resena } from 'src/resena/resena.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad, Estudiante, Resena])],
  controllers: [ActividadController],
  providers: [ActividadService],
})
export class ActividadModule {}
