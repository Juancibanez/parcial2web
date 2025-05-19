import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from './resena.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

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
    data: { comentario: string; calificacion: number; fecha: string },
  ): Promise<Resena> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });

    if (!estudiante)
      throw new BusinessLogicException(
        'Estudiante no encontrado',
        BusinessError.NOT_FOUND,
      );

    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['inscritos'],
    });

    if (!actividad)
      throw new BusinessLogicException(
        'Actividad no encontrada',
        BusinessError.NOT_FOUND,
      );

    if (actividad.estado !== 2) {
      throw new BusinessLogicException(
        'La actividad no ha sido finalizada',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const estaInscrito = actividad.inscritos.some(
      (e) => e.id === estudiante.id,
    );
    if (!estaInscrito) {
      throw new BusinessLogicException(
        'El estudiante no está inscrito en la actividad',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const nuevaResena = this.resenaRepository.create({
      ...data,
      estudiante,
      actividad,
    });

    return await this.resenaRepository.save(nuevaResena);
  }
}
