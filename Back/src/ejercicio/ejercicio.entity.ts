/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EjercicioEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 tipo: string;
 
 @Column()
 duracion: number;
 
 @Column()
 numRepeiciones: number;
 
 @Column()
 infoAdicional: string;

}
