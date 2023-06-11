import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CantidadEntity } from './cantidad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { IngredienteEntity } from '../ingrediente/ingrediente.entity';
import { RecetaEntity } from '../receta/receta.entity';


@Injectable()
export class CantidadService {
    constructor(
        @InjectRepository(CantidadEntity)
        private readonly cantidadRepository: Repository<CantidadEntity>,

        @InjectRepository(IngredienteEntity)
        private readonly ingredienteRepository: Repository<IngredienteEntity>,

        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>

    ) { }

    async findAll(): Promise<CantidadEntity[]> {
        return await this.cantidadRepository.find({ relations: ['ingrediente', 'receta'] });
    }
    async findOne(id: string): Promise<CantidadEntity> {
        const cantidad: CantidadEntity = await this.cantidadRepository.findOne({where: {id},  relations: ['ingrediente', 'receta'] });
        if (!cantidad) {
            throw new BusinessLogicException("Cantidad no encontrada", BusinessError.NOT_FOUND);
        }
        return cantidad;
    }

    async create(cantidad: CantidadEntity): Promise<CantidadEntity> {
        return await this.cantidadRepository.save(cantidad);
    }
        

    async addIngredienteToReceta(recetaId: string, ingredienteId: string, cantidadId: string): Promise<RecetaEntity> {
        const ingrediente: IngredienteEntity = await this.ingredienteRepository.findOne({where: {id: ingredienteId}});
        if (!ingrediente) {
            throw new BusinessLogicException("Ingrediente no encontrado", BusinessError.NOT_FOUND);
        }
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta) {
            throw new BusinessLogicException("Receta no encontrada", BusinessError.NOT_FOUND);
        }
        const cantidad: CantidadEntity = await this.cantidadRepository.findOne({where: {id: cantidadId}, relations: ['ingrediente', 'receta']});
        if (!cantidad) {
            throw new BusinessLogicException("Cantidad no encontrada", BusinessError.NOT_FOUND);
        }
        receta.calTotales = receta.calTotales + (cantidad.cantidad * ingrediente.calorias);
        const receta_res = await this.recetaRepository.save(receta);
        cantidad.ingrediente = ingrediente;
        cantidad.receta = receta;
        await this.cantidadRepository.save(cantidad)
        return receta_res;
    }
    

    async update(id: string, cantidad: CantidadEntity): Promise<CantidadEntity> {
        const persistedcantidad: CantidadEntity = await this.cantidadRepository.findOne({where: {id}, relations: ['ingrediente', 'receta']});
        if (!persistedcantidad) {
            throw new BusinessLogicException("Cantidad no encontrada", BusinessError.NOT_FOUND);
        }
        return await this.cantidadRepository.save({...persistedcantidad, ...cantidad});
    }

    async delete(id: string) {
        const persistedcantidad: CantidadEntity = await this.cantidadRepository.findOne({where: {id}, relations: ['ingrediente', 'receta']});
        if (!persistedcantidad) {
            throw new BusinessLogicException("Cantidad no encontrada", BusinessError.NOT_FOUND);
        }
       await this.cantidadRepository.remove(persistedcantidad);
    }

    async findIngrredienteByRecetaIdIngredienteId(recetaId: string, ingredienteId: string): Promise<IngredienteEntity> {
        const ingrediente: IngredienteEntity = await this.ingredienteRepository.findOne({where: {id: ingredienteId}});
        if (!ingrediente) {
            throw new BusinessLogicException("Ingrediente no encontrado", BusinessError.NOT_FOUND);
        }
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta) {
            throw new BusinessLogicException("Receta no encontrada", BusinessError.NOT_FOUND);
        }
        const cantidad: CantidadEntity = await this.cantidadRepository.findOne({where: {receta, ingrediente}, relations: ['ingrediente', 'receta']});
        if (!cantidad) {
            throw new BusinessLogicException("Ingrediente no encontrado en la receta", BusinessError.PRECONDITION_FAILED);
        }
        return cantidad.ingrediente;
    }

    async findIngredientesByRecetaId(recetaId: string): Promise<IngredienteEntity[]> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta) {
            throw new BusinessLogicException("Receta no encontrada", BusinessError.NOT_FOUND);
        }
        const cantidad: CantidadEntity[] = await this.cantidadRepository.find({where: {receta}, relations: ['ingrediente', 'receta']});
        if (!cantidad) {
            throw new BusinessLogicException("Cantidad no encontrada", BusinessError.NOT_FOUND);
        }
        const ingredientes: IngredienteEntity[] = [];
        cantidad.forEach(cant => { ingredientes.push(cant.ingrediente); });
        return ingredientes;
    }

    async deleteIngredienteFromReceta(recetaId: string, ingredienteId: string): Promise<void> {
        const ingrediente: IngredienteEntity = await this.ingredienteRepository.findOne({where: {id: ingredienteId}});
        if (!ingrediente) {
            throw new BusinessLogicException("Ingrediente no encontrado", BusinessError.NOT_FOUND);
        }
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta) {
            throw new BusinessLogicException("Receta no encontrada", BusinessError.NOT_FOUND);
        }
        const cantidad: CantidadEntity = await this.cantidadRepository.findOne({where: {receta, ingrediente}, relations: ['ingrediente', 'receta']});
        if (!cantidad) {
            throw new BusinessLogicException("Ingrediente no encontrado en la receta", BusinessError.PRECONDITION_FAILED);
        }
        receta.calTotales = receta.calTotales - (cantidad.cantidad * ingrediente.calorias);
        await this.recetaRepository.save(receta);
        await this.cantidadRepository.remove(cantidad);
    }

}
