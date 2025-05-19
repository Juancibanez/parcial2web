import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Actividad } from './actividad.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessLogicException } from 'src/shared/errors/business-errors';

describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepository: Repository<Actividad>;
  let estudianteRepository: Repository<Estudiante>;
  let actividad: Actividad;

  const seedDatabase = async () => {
    actividadRepository.clear();
    estudianteRepository.clear();

    actividad = actividadRepository.create({
      titulo: faker.lorem.sentence(),
      fecha: '2025-05-18',
      cupoMaximo: 5,
      estado: 0,
      inscritos: [],
    });

    actividad = await actividadRepository.save(actividad);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    actividadRepository = module.get<Repository<Actividad>>(
      getRepositoryToken(Actividad),
    );
    estudianteRepository = module.get<Repository<Estudiante>>(
      getRepositoryToken(Estudiante),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearActividad', () => {
    it('debería crear una actividad válida', async () => {
      const nueva = {
        titulo: 'Taller de pruebas',
        fecha: '2025-06-01',
        cupoMaximo: 10,
      } as Actividad;

      const resultado = await service.crearActividad(nueva);
      expect(resultado).toHaveProperty('id');
      expect(resultado.titulo).toBe('Taller de pruebas');
    });
  });

  describe('cambiarEstado', () => {
    it('debería cambiar a estado 1 si al menos 80% del cupo está lleno', async () => {
      const estudiantes = Array(4)
        .fill(null)
        .map(() =>
          estudianteRepository.create({
            cedula: faker.number.int(),
            nombre: faker.person.fullName(),
            correo: faker.internet.email(),
            programa: 'Ing. Sistemas',
            semestre: 5,
          }),
        );

      await estudianteRepository.save(estudiantes);
      actividad.inscritos = estudiantes;
      await actividadRepository.save(actividad);

      const result = await service.cambiarEstado(actividad.id, 1);
      expect(result.estado).toBe(1);
    });

    it('debería lanzar excepción si menos del 80% del cupo está lleno al cerrar', async () => {
      await expect(service.cambiarEstado(actividad.id, 1)).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('debería cambiar a estado 2 si el cupo está lleno', async () => {
      const estudiantes = Array(5)
        .fill(null)
        .map(() =>
          estudianteRepository.create({
            cedula: faker.number.int(),
            nombre: faker.person.fullName(),
            correo: faker.internet.email(),
            programa: 'Ing. Sistemas',
            semestre: 6,
          }),
        );

      await estudianteRepository.save(estudiantes);
      actividad.inscritos = estudiantes;
      await actividadRepository.save(actividad);

      const result = await service.cambiarEstado(actividad.id, 2);
      expect(result.estado).toBe(2);
    });

    it('debería lanzar excepción si aún hay cupos disponibles al finalizar', async () => {
      const estudiantes = Array(4)
        .fill(null)
        .map(() =>
          estudianteRepository.create({
            cedula: faker.number.int(),
            nombre: faker.person.fullName(),
            correo: faker.internet.email(),
            programa: 'Ing. Sistemas',
            semestre: 6,
          }),
        );

      await estudianteRepository.save(estudiantes);
      actividad.inscritos = estudiantes;
      await actividadRepository.save(actividad);

      await expect(service.cambiarEstado(actividad.id, 2)).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('debería lanzar excepción si el estado es inválido', async () => {
      await expect(service.cambiarEstado(actividad.id, 5)).rejects.toThrow(
        BusinessLogicException,
      );
    });

    it('debería lanzar excepción si la actividad no existe', async () => {
      await expect(service.cambiarEstado(9999, 1)).rejects.toThrow(
        BusinessLogicException,
      );
    });
  });

  describe('findAllActividadesByDate', () => {
    it('debería retornar actividades en una fecha válida', async () => {
      const actividades = await service.findAllActividadesByDate('2025-05-18');
      expect(actividades.length).toBeGreaterThan(0);
      expect(actividades[0].fecha).toBe('2025-05-18');
    });

    it('debería retornar lista vacía si no hay actividades en la fecha', async () => {
      const actividades = await service.findAllActividadesByDate('2024-01-01');
      expect(actividades).toHaveLength(0);
    });
  });
});
