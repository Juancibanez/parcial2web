import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,

    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
  ) {}

  async crearEstudiante(
    estudianteData: Partial<Estudiante>,
  ): Promise<Estudiante> {
    if (!estudianteData.correo) {
      throw new BusinessLogicException(
        'El correo es obligatorio',
        BusinessError.BAD_REQUEST,
      );
    }
    if (!this.isEmailValid(estudianteData.correo)) {
      throw new BusinessLogicException(
        'El correo no es válido',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    if (
      estudianteData.semestre == null ||
      estudianteData.semestre < 1 ||
      estudianteData.semestre > 10
    ) {
      throw new BusinessLogicException(
        'El semestre debe estar entre 1 y 10',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const estudiante = this.estudianteRepository.create(estudianteData);
    return this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['actividades'],
    });

    if (!estudiante)
      throw new BusinessLogicException(
        'Estudiante no encontrado',
        BusinessError.NOT_FOUND,
      );
    return estudiante;
  }

  async inscribirseActividad(estudianteId: number, actividadId: number) {
    const estudiante = await this.findEstudianteById(estudianteId);
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['inscritos'],
    });

    if (!actividad)
      throw new BusinessLogicException(
        'Actividad no encontrada',
        BusinessError.NOT_FOUND,
      );

    if (actividad.estado !== 0) {
      throw new BusinessLogicException(
        'Actividad no disponible',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (actividad.inscritos.length >= actividad.cupoMaximo) {
      throw new BusinessLogicException(
        'No hay cupos disponibles',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (actividad.inscritos.some((e) => e.id === estudiante.id)) {
      throw new BusinessLogicException(
        'El estudiante ya está inscrito en esta actividad',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    actividad.inscritos.push(estudiante);
    await this.actividadRepository.save(actividad);

    return { message: 'Inscripción exitosa' };
  }

  private isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
