import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from './resena.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';

@Injectable()
export class ResenaService {
  constructor(
    @InjectRepository(Resena)
    private resenaRepository: Repository<Resena>,

    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,

    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
  ) {}

  async agregarResena(
    estudianteId: number,
    actividadId: number,
    data: { comentario: string; calificacion: number; fecha: string }
  ): Promise<Resena> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });

    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');

    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });

    if (!actividad) throw new NotFoundException('Actividad no encontrada');

    if (actividad.estado !== 2) {
      throw new BadRequestException('Solo se pueden reseñar actividades finalizadas');
    }

    const estaInscrito = actividad.estudiantes.some(e => e.id === estudiante.id);
    if (!estaInscrito) {
      throw new BadRequestException('El estudiante no estuvo inscrito en esta actividad');
    }

    const nuevaResena = this.resenaRepository.create({
      ...data,
      estudiante,
      actividad,
    });

    return await this.resenaRepository.save(nuevaResena);
  }
}