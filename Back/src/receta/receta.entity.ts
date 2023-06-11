/* eslint-disable prettier/prettier */
import { Column, Entity,  PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecetaEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;
    
    @Column()
    descripcion: string;
    
    @Column({default: 0})
    calTotales: number;
    
    @Column()
    especificaciones: string;
    
    @Column()
    infoAdicional: string;

    @Column({default: 0})
    likes: number;

    constructor(nombre: string, descripcion: string, especificaciones: string, infoAdicional: string) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.calTotales = 0;
        this.especificaciones = especificaciones;
        this.infoAdicional = infoAdicional;
        this.likes = 0;
    }
}
