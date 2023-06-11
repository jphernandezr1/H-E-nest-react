/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { EjercicioEntity } from './ejercicio.entity';

@Injectable()
export class EjercicioService {


    constructor(
        @InjectRepository(EjercicioEntity)
        private readonly ejercicioRepository: Repository<EjercicioEntity>
    ){}

    async findAll(): Promise<EjercicioEntity[]> {
        return await this.ejercicioRepository.find({ });
    }

    async findOne(id: string): Promise<EjercicioEntity> {
        const ejercicio: EjercicioEntity = await this.ejercicioRepository.findOne({where: {id}} );
        if (!ejercicio)
          throw new BusinessLogicException("The ejercicio with the given id was not found", BusinessError.NOT_FOUND);
    
        return ejercicio;
    }

    async create(ejercicio: EjercicioEntity): Promise<EjercicioEntity> {
        return await this.ejercicioRepository.save(ejercicio);
    }

    async update(id: string, ejercicio: EjercicioEntity): Promise<EjercicioEntity> {
        const persistedEjercicio: EjercicioEntity = await this.ejercicioRepository.findOne({where:{id}});
        if (!persistedEjercicio)
          throw new BusinessLogicException("The ejercicio with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.ejercicioRepository.save({...persistedEjercicio, ...ejercicio});
    }

    async delete(id: string) {
        const ejercico: EjercicioEntity = await this.ejercicioRepository.findOne({where:{id}});
        if (!ejercico)
          throw new BusinessLogicException("The ejercicio with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.ejercicioRepository.remove(ejercico);
    }
}

