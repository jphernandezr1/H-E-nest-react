/* eslint-disable prettier/prettier */
import { PerfilEntity } from '../perfil/perfil.entity';
import { ForoEntity } from '../foro/foro.entity';
import { Column, Entity, ManyToOne,  PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class PublicacionEntity {
 
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  texto: string;

  @Column()
  numMegusta: number;

  @ManyToOne(() => PerfilEntity, publicador => publicador.publicacion)
  publicador: PerfilEntity;

  @ManyToMany(() => PerfilEntity, likes => likes.likes)
  @JoinTable()
  likes: PerfilEntity[];

  @ManyToOne(() => ForoEntity, foro => foro.publicaciones)
  foro: ForoEntity;
} 

