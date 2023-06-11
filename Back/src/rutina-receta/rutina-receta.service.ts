import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RutinaEntity } from '../rutina/rutina.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class RutinaRecetaService {
    constructor (
        @InjectRepository(RutinaEntity)
        private readonly rutinaRepository: Repository<RutinaEntity>,

        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
    ) {}

    async addRecetaRutina(rutinaId: string, recetaId: string): Promise<RutinaEntity>{
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta) {
            throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
        }
        const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinaId}, relations: ['recetas']});
        if (!rutina) {
            throw new BusinessLogicException('Rutina no encontrada', BusinessError.NOT_FOUND);
        }
        rutina.recetas = [...rutina.recetas, receta];
        return await this.rutinaRepository.save(rutina);

    }

    async findRecetaByRutinaIdRecetaId(rutinaId: string, recetaId: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta) {
            throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
        }
        const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinaId}, relations: ['recetas']});
        if (!rutina) {
            throw new BusinessLogicException('Rutina no encontrada', BusinessError.NOT_FOUND);
        }
        const recetaRutina = rutina.recetas.find(a => a.id === receta.id);
        if (!recetaRutina) {
            throw new BusinessLogicException('Receta no encontrada en la rutina', BusinessError.PRECONDITION_FAILED);
        }
        return recetaRutina;
    }

    async findRecetasByRutinaId(rutinaId: string): Promise<RecetaEntity[]> {
        const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinaId}, relations: ['recetas']});
        if (!rutina) {
            throw new BusinessLogicException('Rutina no encontrada', BusinessError.NOT_FOUND);
        }
        return rutina.recetas;
    }

    async associateRecetasRutina(rutinaId: string, recetas: RecetaEntity[]): Promise<RutinaEntity> {
        const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinaId}});
        if (!rutina) {
            throw new BusinessLogicException('Rutina no encontrada', BusinessError.NOT_FOUND);
        }
        for (let i = 0; i < recetas.length; i++) {
            const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetas[i].id}});
            if (!receta) {
                throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
            }
        }
        rutina.recetas = recetas;
        return await this.rutinaRepository.save(rutina);
    }

    async deleteRecetaRutina(rutinaId: string, recetaId: string): Promise<RutinaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta) {
            throw new BusinessLogicException('Receta no encontrada', BusinessError.NOT_FOUND);
        }
        const rutina: RutinaEntity = await this.rutinaRepository.findOne({where: {id: rutinaId}, relations: ['recetas']});
        if (!rutina) {
            throw new BusinessLogicException('Rutina no encontrada', BusinessError.NOT_FOUND);
        }
        const recetaRutina = rutina.recetas.find(r => r.id === recetaId);
        if (!recetaRutina) {
            throw new BusinessLogicException('Receta no encontrada en la rutina', BusinessError.PRECONDITION_FAILED);
        }
        rutina.recetas = rutina.recetas.filter(r => r.id !== recetaId);
        return await this.rutinaRepository.save(rutina);
    }
}
