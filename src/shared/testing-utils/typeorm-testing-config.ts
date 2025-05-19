import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from '../../actividad/actividad.entity';
import { Estudiante } from '../../estudiante/estudiante.entity';
import { Resena } from '../../resena/resena.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Actividad, Estudiante, Resena],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Actividad, Estudiante, Resena]),
];
