import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resena } from './resena.entity';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resena, Estudiante, Actividad])],
  controllers: [ResenaController],
  providers: [ResenaService],
})
export class ResenaModule {}
