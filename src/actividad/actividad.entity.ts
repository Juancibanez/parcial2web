import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Resena } from '../resena/resena.entity';

@Entity()
export class Actividad {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  titulo: string;

  @Column()
  fecha: string;

  @Column()
  cupoMaximo: number;

  @Column({ default: 0 })
  estado: number;

  @ManyToMany(() => Estudiante, (estudiante) => estudiante.actividades)
  inscritos: Estudiante[];

  @OneToMany(() => Resena, (resena) => resena.actividad)
  resenas: Resena[];
}
