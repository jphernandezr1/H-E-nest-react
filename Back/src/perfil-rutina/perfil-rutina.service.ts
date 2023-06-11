





/* archivo: src/perfil-rutina/perfil-rutina.service.ts */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RutinaEntity } from '../rutina/rutina.entity';
import { PerfilEntity } from '../perfil/perfil.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

//museo = perfil
//artwork = rutina
@Injectable()
export class PerfilRutinaService {
   constructor(
       @InjectRepository(PerfilEntity)
       private readonly perfilRepository: Repository<PerfilEntity>,
   
       @InjectRepository(RutinaEntity)
       private readonly rutinaRepository: Repository<RutinaEntity>
   ) {}

   async addRutinaPerfil(perfilId: string, rutinaId: string): Promise<PerfilEntity> {
       const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinaId}});
       if (!rutina)
         throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND);
     
       const perfil: PerfilEntity = await this.perfilRepository.findOne({where: {id: perfilId}, relations: ["rutinas"]})
       if (!perfil)
         throw new BusinessLogicException("The perfil with the given id was not found", BusinessError.NOT_FOUND);
   
       perfil.rutinas = [...perfil.rutinas, rutina];
       return await this.perfilRepository.save(perfil);
     }
   
   async findRutinaByPerfilIdRutinaId(perfilId: string, rutinaId: string): Promise<RutinaEntity> {
       const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinaId}});
       if (!rutina)
         throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND)
      
       const perfil: PerfilEntity = await this.perfilRepository.findOne({where: {id: perfilId}, relations: ["rutinas"]});
       if (!perfil)
         throw new BusinessLogicException("The perfil with the given id was not found", BusinessError.NOT_FOUND)
  
       const perfilRutina: RutinaEntity = perfil.rutinas.find(e => e.id === rutina.id);
  
       if (!perfilRutina)
         throw new BusinessLogicException("The rutina with the given id is not associated to the perfil", BusinessError.PRECONDITION_FAILED)
  
       return perfilRutina;
   }
   
   async findARutinasByPerfilId(perfilId: string): Promise<RutinaEntity[]> {
       const perfil: PerfilEntity = await this.perfilRepository.findOne({where: {id: perfilId}, relations: ["rutinas"]});
       if (!perfil)
         throw new BusinessLogicException("The perfil with the given id was not found", BusinessError.NOT_FOUND)
      
       return perfil.rutinas;
   }
   
   async associateRutinPerfil(perfilId: string, rutinas: RutinaEntity[]): Promise<PerfilEntity> {
       const perfil: PerfilEntity = await this.perfilRepository.findOne({where: {id: perfilId}, relations: ["rutinas"]});
   
       if (!perfil)
         throw new BusinessLogicException("The perfil with the given id was not found", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < rutinas.length; i++) {
         const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinas[i].id}});
         if (!rutina)
           throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND)
       }
   
       perfil.rutinas = rutinas;
       return await this.perfilRepository.save(perfil);
     }
   
   async deleteRutinaPerfil(perfilId: string, rutinaId: string){
       const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinaId}});
       if (!rutina)
         throw new BusinessLogicException("The rutina with the given id was not found", BusinessError.NOT_FOUND)
   
       const perfil: PerfilEntity = await this.perfilRepository.findOne({where: {id: perfilId}, relations: ["rutinas"]});
       if (!perfil)
         throw new BusinessLogicException("The perfil with the given id was not found", BusinessError.NOT_FOUND)
   
       const perfilRutina: RutinaEntity = perfil.rutinas.find(e => e.id === rutina.id);
   
       if (!perfilRutina)
           throw new BusinessLogicException("The rutina with the given id is not associated to the perfil", BusinessError.PRECONDITION_FAILED)

       perfil.rutinas = perfil.rutinas.filter(e => e.id !== rutinaId);
       await this.perfilRepository.save(perfil);
   }  
}




