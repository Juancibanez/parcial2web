import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from './actividad.entity';
import { CreateActividadDto } from './dto/create-actividad.dto'; // Import the DTO

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
  ) {}

  async crearActividad(data: CreateActividadDto): Promise<Actividad> {
    const nuevaActividad = this.actividadRepository.create({
      ...data,
      estado: 0,
    });

    return this.actividadRepository.save(nuevaActividad);
  }

  async cambiarEstado(id: number, nuevoEstado: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: { id },
      relations: ['inscritos'],
    });

    if (!actividad) throw new NotFoundException('Actividad no encontrada');

    if (
      nuevoEstado === 1 &&
      actividad.inscritos.length / actividad.cupoMaximo < 0.8
    ) {
      throw new BadRequestException(
        'Solo se puede cerrar si al menos el 80% del cupo está lleno',
      );
    }

    if (
      nuevoEstado === 2 &&
      actividad.inscritos.length < actividad.cupoMaximo
    ) {
      throw new BadRequestException(
        'Solo se puede finalizar si no hay cupos disponibles',
      );
    }

    if (![0, 1, 2].includes(nuevoEstado)) {
      throw new BadRequestException('Estado no válido');
    }

    actividad.estado = nuevoEstado;
    return this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    return this.actividadRepository.find({ where: { fecha } });
  }
}
