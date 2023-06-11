import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';

@Injectable()
export class RecetaService {
    
    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
    ) { }

    async findAll(): Promise<RecetaEntity[]> {
        return await this.recetaRepository.find();
    }

    async findOne(id: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({ where: { id }});
        if (!receta) {
            throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
        }
        return receta;
    }

    async create(receta: RecetaEntity): Promise<RecetaEntity> {
        return await this.recetaRepository.save(receta);
    }

    async update(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
        const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({ where: { id } });
        if (!persistedReceta) {
            throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
        }
        return await this.recetaRepository.save({ ...persistedReceta, ...receta });
    }

    async updateCalorias(id: string, calorias: number): Promise<RecetaEntity> {
        const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({ where: { id } });
        if (!persistedReceta) {
            throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
        }
        return await this.recetaRepository.save({ ...persistedReceta, calTotales: calorias });
    }
    
    async updateLikes(id: string): Promise<RecetaEntity> {
        const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({ where: { id } });
        if (!persistedReceta) {
            throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
        }
        return await this.recetaRepository.save({ ...persistedReceta, likes: persistedReceta.likes + 1 });
    }


    async delete(id: string) {
        const receta: RecetaEntity = await this.recetaRepository.findOne({ where: { id } });
        if (!receta) {
            throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
        }
        await this.recetaRepository.remove(receta);
    }

}