/* eslint-disable prettier/prettier */
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ForoEntity {

  @PrimaryGeneratedColumn('uuid')
   id: string;
   @Column()
   titulo: string;
   @Column()
   numPublicaciones: number;
   
   @OneToMany(() => PublicacionEntity, (publicacion) => publicacion.foro)
   publicaciones: PublicacionEntity[];

}
