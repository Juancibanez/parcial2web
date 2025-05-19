import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './estudiante.entity';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { Actividad } from '../actividad/actividad.entity';
import { Resena } from 'src/resena/resena.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Actividad, Resena])],
  controllers: [EstudianteController],
  providers: [EstudianteService],
})
export class EstudianteModule {}
