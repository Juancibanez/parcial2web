import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ResenaModule } from './resena/resena.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './actividad/actividad.entity';
import { Estudiante } from './estudiante/estudiante.entity';
import { Resena } from './resena/resena.entity';

@Module({
  imports: [
    EstudianteModule,
    ActividadModule,
    ResenaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial-db',
      entities: [Actividad, Estudiante, Resena],
      dropSchema: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
