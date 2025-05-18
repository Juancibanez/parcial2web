import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';

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
      throw new BadRequestException('El correo es obligatorio');
    }
    if (!this.isEmailValid(estudianteData.correo)) {
      throw new BadRequestException('Correo inválido');
    }
    if (
      estudianteData.semestre == null ||
      estudianteData.semestre < 1 ||
      estudianteData.semestre > 10
    ) {
      throw new BadRequestException('Semestre debe estar entre 1 y 10');
    }

    const estudiante = this.estudianteRepository.create(estudianteData);
    return this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['actividades'],
    });

    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return estudiante;
  }

  async inscribirseActividad(
    estudianteId: number,
    actividadId: number,
  ): Promise<string> {
    const estudiante = await this.findEstudianteById(estudianteId);
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });

    if (!actividad) throw new NotFoundException('Actividad no encontrada');
    if (actividad.estado !== 0) {
      throw new BadRequestException('Actividad no disponible');
    }

    if (actividad.inscritos.length >= actividad.cupoMaximo) {
      throw new BadRequestException('No hay cupos disponibles');
    }
    if (actividad.inscritos.some((e) => e.id === estudiante.id)) {
      throw new BadRequestException('Estudiante ya inscrito');
    }

    actividad.inscritos.push(estudiante);
    await this.actividadRepository.save(actividad);

    return 'Inscripción exitosa';
  }

  private isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
