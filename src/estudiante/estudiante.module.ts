import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './estudiante.entity';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { Actividad } from '../actividad/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Actividad])],
  controllers: [EstudianteController],
  providers: [EstudianteService],
})
export class EstudianteModule {}
