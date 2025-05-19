import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from './actividad.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
  ) {}

  async crearActividad(actividad: Actividad): Promise<Actividad> {
    const nuevaActividad = this.actividadRepository.create(actividad);

    return this.actividadRepository.save(nuevaActividad);
  }

  async cambiarEstado(id: number, nuevoEstado: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: { id },
      relations: ['inscritos'],
    });

    if (!actividad)
      throw new BusinessLogicException(
        'Actividad no encontrada',
        BusinessError.NOT_FOUND,
      );

    if (
      nuevoEstado === 1 &&
      actividad.inscritos.length / actividad.cupoMaximo < 0.8
    ) {
      throw new BusinessLogicException(
        'Solo se puede cerrar si al menos el 80% del cupo está lleno',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (
      nuevoEstado === 2 &&
      actividad.inscritos.length < actividad.cupoMaximo
    ) {
      throw new BusinessLogicException(
        'Solo se puede finalizar si no hay cupos disponibles',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (![0, 1, 2].includes(nuevoEstado)) {
      throw new BusinessLogicException(
        'Estado no válido',
        BusinessError.BAD_REQUEST,
      );
    }

    actividad.estado = nuevoEstado;
    return this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    return this.actividadRepository.find({ where: { fecha } });
  }
}
