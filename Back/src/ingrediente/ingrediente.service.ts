import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { IngredienteEntity } from './ingrediente.entity';

@Injectable()
export class IngredienteService {
    constructor(
        @InjectRepository(IngredienteEntity)
        private readonly ingredienteRepository: Repository<IngredienteEntity>,
    ) { }

    async findAll(): Promise<IngredienteEntity[]> {
        return await this.ingredienteRepository.find();
    }

    async findOne(id: string): Promise<IngredienteEntity> {
        const ingrediente: IngredienteEntity = await this.ingredienteRepository.findOne({ where: { id }});
        if (!ingrediente) {
            throw new BusinessLogicException('Ingrediente no encontrado', BusinessError.NOT_FOUND);
        }
        return ingrediente;
    }

    async create(ingrediente: IngredienteEntity): Promise<IngredienteEntity> {
        return await this.ingredienteRepository.save(ingrediente);
    }

    async update(id: string, ingrediente: IngredienteEntity): Promise<IngredienteEntity> {
        const persistedIngrediente: IngredienteEntity = await this.ingredienteRepository.findOne({ where: { id } });
        if (!persistedIngrediente) {
            throw new BusinessLogicException('Ingrediente no encontrado', BusinessError.NOT_FOUND);
        }
        return await this.ingredienteRepository.save({ ...persistedIngrediente, ...ingrediente });
    }

    async delete(id: string) {
        const ingrediente: IngredienteEntity = await this.ingredienteRepository.findOne({ where: { id } });
        if (!ingrediente) {
            throw new BusinessLogicException('Ingrediente no encontrado', BusinessError.NOT_FOUND);
        }
        await this.ingredienteRepository.remove(ingrediente);
    }
}
