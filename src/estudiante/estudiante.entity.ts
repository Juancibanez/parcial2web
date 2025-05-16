import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Actividad } from '../actividad/actividad.entity';
import { Resena } from '../resena/resena.entity';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  programa: string;

  @Column()
  semestre: number;

  @ManyToMany(() => Actividad, actividad => actividad.estudiantes)
  @JoinTable()
  actividades: Actividad[];

  @OneToMany(() => Resena, resena => resena.estudiante)
  resenas: Resena[];
}
