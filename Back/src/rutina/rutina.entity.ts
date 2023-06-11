/* eslint-disable prettier/prettier */
import { EjercicioEntity } from '../ejercicio/ejercicio.entity';
import { RecetaEntity } from '../receta/receta.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class RutinaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  infoAdicional: string;

  @ManyToMany(() => EjercicioEntity)
  @JoinTable()
  ejercicios: EjercicioEntity[];

  @ManyToMany(() => RecetaEntity)
  @JoinTable()
  recetas: RecetaEntity[];
}
