/* eslint-disable prettier/prettier */
import { PerfilEntity } from '../perfil/perfil.entity';
import { Column, Entity,  ManyToOne,  PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MetricasEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    unidad: string;

    @Column()
    valor: number;

    @ManyToOne(()=>PerfilEntity, perfil => perfil.metricas)
    perfil: PerfilEntity;
}
