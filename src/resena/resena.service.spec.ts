import { Test, TestingModule } from '@nestjs/testing';
import { ResenaService } from './resena.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Resena } from './resena.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('ResenaService', () => {
  let service: ResenaService;
  let resenaRepository: Repository<Resena>;
  let estudianteRepository: Repository<Estudiante>;
  let actividadRepository: Repository<Actividad>;

  let estudiante: Estudiante;
  let actividad: Actividad;

  const seedDatabase = async () => {
    await resenaRepository.clear();
    await estudianteRepository.clear();
    await actividadRepository.clear();

    estudiante = estudianteRepository.create({
      cedula: faker.number.int(),
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: 'Ingeniería',
      semestre: 6,
      actividades: [],
    });
    estudiante = await estudianteRepository.save(estudiante);

    actividad = actividadRepository.create({
      titulo: faker.lorem.words(3),
      fecha: '2025-05-18',
      cupoMaximo: 10,
      estado: 2,
      inscritos: [estudiante],
    });
    actividad = await actividadRepository.save(actividad);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ResenaService],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
    resenaRepository = module.get<Repository<Resena>>(
      getRepositoryToken(Resena),
    );
    estudianteRepository = module.get<Repository<Estudiante>>(
      getRepositoryToken(Estudiante),
    );
    actividadRepository = module.get<Repository<Actividad>>(
      getRepositoryToken(Actividad),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('agregarResena', () => {
    it('debería crear una reseña válida', async () => {
      const reseñaData = {
        comentario: faker.lorem.sentence(),
        calificacion: 4,
        fecha: '2025-05-18',
      };

      const result = await service.agregarResena(
        estudiante.id,
        actividad.id,
        reseñaData,
      );

      expect(result).toHaveProperty('id');
      expect(result.comentario).toBe(reseñaData.comentario);
      expect(result.calificacion).toBe(reseñaData.calificacion);
      expect(result.estudiante.id).toBe(estudiante.id);
      expect(result.actividad.id).toBe(actividad.id);
    });

    it('debería lanzar excepción si el estudiante no existe', async () => {
      await expect(
        service.agregarResena(9999, actividad.id, {
          comentario: 'No importa',
          calificacion: 5,
          fecha: '2025-05-18',
        }),
      ).rejects.toHaveProperty('message', 'Estudiante no encontrado');
    });

    it('debería lanzar excepción si la actividad no existe', async () => {
      await expect(
        service.agregarResena(estudiante.id, 9999, {
          comentario: 'Comentario',
          calificacion: 3,
          fecha: '2025-05-18',
        }),
      ).rejects.toHaveProperty('message', 'Actividad no encontrada');
    });

    it('debería lanzar excepción si la actividad no está finalizada', async () => {
      actividad.estado = 1;
      await actividadRepository.save(actividad);

      await expect(
        service.agregarResena(estudiante.id, actividad.id, {
          comentario: 'No finalizada',
          calificacion: 4,
          fecha: '2025-05-18',
        }),
      ).rejects.toHaveProperty('message', 'La actividad no ha sido finalizada');
    });

    it('debería lanzar excepción si el estudiante no está inscrito en la actividad', async () => {
      const otroEstudiante = await estudianteRepository.save(
        estudianteRepository.create({
          cedula: faker.number.int(),
          nombre: faker.person.fullName(),
          correo: faker.internet.email(),
          programa: 'Derecho',
          semestre: 4,
          actividades: [],
        }),
      );

      await expect(
        service.agregarResena(otroEstudiante.id, actividad.id, {
          comentario: 'No inscrito',
          calificacion: 5,
          fecha: '2025-05-18',
        }),
      ).rejects.toHaveProperty(
        'message',
        'El estudiante no está inscrito en la actividad',
      );
    });
  });
});
