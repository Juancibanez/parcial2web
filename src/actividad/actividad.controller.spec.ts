import { Test, TestingModule } from '@nestjs/testing';
import { ActividadController } from './actividad.controller';

describe('ActividadController', () => {
  let controller: ActividadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActividadController],
    }).compile();

    controller = module.get<ActividadController>(ActividadController);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });
});
