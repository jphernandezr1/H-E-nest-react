
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EjercicioEntity } from '../ejercicio/ejercicio.entity';
import { RutinaEntity } from '../rutina/rutina.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
//museo = rutinaa
// aartwork = ejercicio
@Injectable()
export class RutinaEjercicioService {

    constructor(
        @InjectRepository(RutinaEntity)
        private readonly RutinaRepository: Repository<RutinaEntity>,
    
        @InjectRepository(EjercicioEntity)
        private readonly EjercicioRepository: Repository<EjercicioEntity>
    ) {}
 
    async addEjercicioRutina(rutinaId: string, ejercicioId: string): Promise<RutinaEntity> {
        const ejercicio: EjercicioEntity = await this.EjercicioRepository.findOne({where: {id: ejercicioId}});
        if (!ejercicio)
          throw new BusinessLogicException("The ejercicio with the given id was not found", BusinessError.NOT_FOUND);
      
        const rutina: RutinaEntity = await this.RutinaRepository.findOne({where: {id: rutinaId}, relations: ["ejercicios", "recetas"]})
        if (!rutina)
          throw new BusinessLogicException("The rutinaa with the given id was not found", BusinessError.NOT_FOUND);
    
        rutina.ejercicios = [...rutina.ejercicios, ejercicio];
        return await this.RutinaRepository.save(rutina);
      }
    
    async findEjercicioByRutinaIdEjercicioId(rutinaId: string, ejercicioId: string): Promise<EjercicioEntity> {
        const ejercicio: EjercicioEntity = await this.EjercicioRepository.findOne({where: {id: ejercicioId}});
        if (!ejercicio)
          throw new BusinessLogicException("The ejercicio with the given id was not found", BusinessError.NOT_FOUND)
       
        const rutina: RutinaEntity = await this.RutinaRepository.findOne({where: {id: rutinaId}, relations: ["ejercicios", "recetas"]});
        if (!rutina)
          throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND)
   
        const rutinaEjercicio: EjercicioEntity = rutina.ejercicios.find(e => e.id === ejercicio.id);
   
        if (!rutinaEjercicio)
          throw new BusinessLogicException("The ejercicio with the given id is not associated to the rutina", BusinessError.PRECONDITION_FAILED)
   
        return rutinaEjercicio;
    }
    
    async findEjercicioByRutinaId(rutinaId: string): Promise<EjercicioEntity[]> {
        const rutina: RutinaEntity = await this.RutinaRepository.findOne({where: {id: rutinaId}, relations: ["ejercicios", "recetas"]});
        if (!rutina)
          throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND)
       
        return rutina.ejercicios;
    }
    
    async associateEjerciciosRutina(rutinaId: string, ejercicios: EjercicioEntity[]): Promise<RutinaEntity> {
        const rutina: RutinaEntity = await this.RutinaRepository.findOne({where: {id: rutinaId}, relations: ["ejercicios", "recetas"]});
    
        if (!rutina)
          throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < ejercicios.length; i++) {
          const ejercicio: EjercicioEntity = await this.EjercicioRepository.findOne({where: {id: ejercicios[i].id}});
          if (!ejercicio)
            throw new BusinessLogicException("The ejercicio with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        rutina.ejercicios = ejercicios;
        return await this.RutinaRepository.save(rutina);
      }
    
    async deleteEjercicioRutina(rutinaId: string, ejercicioId: string){
        const ejercicio: EjercicioEntity = await this.EjercicioRepository.findOne({where: {id: ejercicioId}});
        if (!ejercicio)
          throw new BusinessLogicException("The ejercicio with the given id was not found", BusinessError.NOT_FOUND)
    
        const rutina: RutinaEntity = await this.RutinaRepository.findOne({where: {id: rutinaId}, relations: ["ejercicios", "recetas"]});
        if (!rutina)
          throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND)
    
        const rutinaEjercicio: EjercicioEntity = rutina.ejercicios.find(e => e.id === ejercicio.id);
    
        if (!rutinaEjercicio)
            throw new BusinessLogicException("The ejercicio with the given id is not associated to the rutina", BusinessError.PRECONDITION_FAILED)
 
        rutina.ejercicios = rutina.ejercicios.filter(e => e.id !== ejercicioId);
        await this.RutinaRepository.save(rutina);
    }  
 
}
