import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Estudiante } from './estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<Estudiante>;
  let actividadRepository: Repository<Actividad>;
  let actividad: Actividad;

  const seedDatabase = async () => {
    actividadRepository.clear();
    estudianteRepository.clear();

    actividad = actividadRepository.create({
      titulo: 'Conferencia IA',
      fecha: '2025-05-20',
      cupoMaximo: 2,
      estado: 0,
      inscritos: [],
    });

    actividad = await actividadRepository.save(actividad);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
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

  describe('crearEstudiante', () => {
    it('debería crear un estudiante válido', async () => {
      const estudiante = {
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: 'test@example.com',
        programa: 'Ingeniería',
        semestre: 4,
      } as Estudiante;

      const result = await service.crearEstudiante(estudiante);
      expect(result).toHaveProperty('id');
      expect(result.correo).toBe('test@example.com');
    });

    it('debería fallar si no tiene correo', async () => {
      const estudiante = {
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        programa: 'Ingeniería',
        semestre: 4,
      } as Estudiante;

      await expect(service.crearEstudiante(estudiante)).rejects.toHaveProperty(
        'message',
        'El correo es obligatorio',
      );
    });

    it('debería fallar si el correo es inválido', async () => {
      const estudiante = {
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: 'correo-invalido',
        programa: 'Ingeniería',
        semestre: 4,
      } as Estudiante;

      await expect(service.crearEstudiante(estudiante)).rejects.toHaveProperty(
        'message',
        'El correo no es válido',
      );
    });

    it('debería fallar si el semestre no está en el rango', async () => {
      const estudiante = {
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: 'valid@example.com',
        programa: 'Ingeniería',
        semestre: 11,
      } as Estudiante;

      await expect(service.crearEstudiante(estudiante)).rejects.toHaveProperty(
        'message',
        'El semestre debe estar entre 1 y 10',
      );
    });
  });

  describe('inscribirseActividad', () => {
    it('debería inscribir a un estudiante en una actividad válida', async () => {
      const estudiante = estudianteRepository.create({
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: 'inscrito@example.com',
        programa: 'Ingeniería',
        semestre: 5,
      });
      await estudianteRepository.save(estudiante);

      const result = await service.inscribirseActividad(
        estudiante.id,
        actividad.id,
      );
      expect(result).toHaveProperty('message', 'Inscripción exitosa');
    });

    it('debería fallar si la actividad no existe', async () => {
      const estudiante = await estudianteRepository.save({
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: 'user@uni.com',
        programa: 'Ingeniería',
        semestre: 5,
      });

      await expect(
        service.inscribirseActividad(estudiante.id, 9999),
      ).rejects.toHaveProperty('message', 'Actividad no encontrada');
    });

    it('debería fallar si la actividad no está disponible', async () => {
      actividad.estado = 2;
      await actividadRepository.save(actividad);

      const estudiante = await estudianteRepository.save({
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: 'user2@uni.com',
        programa: 'Ingeniería',
        semestre: 5,
      });

      await expect(
        service.inscribirseActividad(estudiante.id, actividad.id),
      ).rejects.toHaveProperty('message', 'Actividad no disponible');
    });

    it('debería fallar si no hay cupos disponibles', async () => {
      const estudiantes = Array(2)
        .fill(null)
        .map(() =>
          estudianteRepository.create({
            cedula: faker.number.int(),
            nombre: faker.person.fullName(),
            correo: faker.internet.email(),
            programa: 'Ingeniería',
            semestre: 3,
          }),
        );

      await estudianteRepository.save(estudiantes);
      actividad.inscritos = estudiantes;
      await actividadRepository.save(actividad);

      const nuevo = await estudianteRepository.save({
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: 'extra@uni.com',
        programa: 'Ingeniería',
        semestre: 4,
      });

      await expect(
        service.inscribirseActividad(nuevo.id, actividad.id),
      ).rejects.toHaveProperty('message', 'No hay cupos disponibles');
    });

    it('debería fallar si el estudiante ya está inscrito', async () => {
      const estudiante = await estudianteRepository.save({
        cedula: faker.number.int(),
        nombre: faker.person.fullName(),
        correo: 'duplicado@uni.com',
        programa: 'Ingeniería',
        semestre: 2,
      });

      actividad.inscritos = [estudiante];
      await actividadRepository.save(actividad);

      await expect(
        service.inscribirseActividad(estudiante.id, actividad.id),
      ).rejects.toHaveProperty(
        'message',
        'El estudiante ya está inscrito en esta actividad',
      );
    });
  });
});
