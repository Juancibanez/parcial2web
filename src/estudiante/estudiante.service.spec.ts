import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';

describe('EstudianteService', () => {
  let service: EstudianteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
  });

  it('definido', () => {
    expect(service).toBeDefined();
  });
});
