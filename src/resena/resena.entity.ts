import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Actividad } from '../actividad/actividad.entity';

@Entity()
export class Resena {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  contenido: string;

  @Column()
  calificacion: number;

  @ManyToOne(() => Estudiante, estudiante => estudiante.resenas)
  estudiante: Estudiante;

  @ManyToOne(() => Actividad, actividad => actividad.resenas)
  actividad: Actividad;
}
