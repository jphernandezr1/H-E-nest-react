/* eslint-disable prettier/prettier */
import { IngredienteEntity } from '../ingrediente/ingrediente.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CantidadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cantidad: number;

    @Column()
    unidad: string;

    @ManyToOne(() => IngredienteEntity)
    ingrediente: IngredienteEntity;

    @ManyToOne(() => RecetaEntity)
    receta: RecetaEntity;
    
}
