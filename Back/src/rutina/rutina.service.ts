/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RutinaEntity } from './rutina.entity';

@Injectable()
export class RutinaService {

    constructor(
        @InjectRepository(RutinaEntity)
        private readonly rutinaRepository: Repository<RutinaEntity>
    ){}

    async findAll(): Promise<RutinaEntity[]> {
        return await this.rutinaRepository.find({ relations: ["ejercicios", "recetas"]});
    }

    async findOne(id: string): Promise<RutinaEntity> {
        const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id}, relations: ["ejercicios", "recetas"] } );
        if (!rutina)
          throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND);
    
        return rutina;
    }

    async create(rutina: RutinaEntity): Promise<RutinaEntity> {
        return await this.rutinaRepository.save(rutina);
    }

    async update(id: string, rutina: RutinaEntity): Promise<RutinaEntity> {
        const persistedRutina: RutinaEntity = await this.rutinaRepository.findOne({where:{id}});
        if (!persistedRutina)
          throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.rutinaRepository.save({...persistedRutina, ...rutina });
    }

    async delete(id: string) {
        const rutina: RutinaEntity = await this.rutinaRepository.findOne({where:{id}});
        if (!rutina)
          throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.rutinaRepository.remove(rutina);
    }
}
