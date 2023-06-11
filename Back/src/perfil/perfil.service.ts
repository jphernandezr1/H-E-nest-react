import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilEntity } from './perfil.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,
  ) {}
  async findAll(): Promise<PerfilEntity[]> {
    return await this.perfilRepository.find({});
  }
  async findOne(id: string): Promise<PerfilEntity> {
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id },
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id, no se encontro',
        BusinessError.NOT_FOUND,
      );

    return perfil;
  }
  async create(perfil: PerfilEntity): Promise<PerfilEntity> {
    return await this.perfilRepository.save(perfil);
  }
  async update(id: string, perfil: PerfilEntity): Promise<PerfilEntity> {
    const persistedPerfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id },
    });
    if (!persistedPerfil)
      throw new BusinessLogicException(
        'el perfil con ese id, no se encontro',
        BusinessError.NOT_FOUND,
      );
    return await this.perfilRepository.save({
      ...persistedPerfil,
      ...perfil,
    });
  }
  async delete(id: string) {
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id },
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id, no se encontro',
        BusinessError.NOT_FOUND,
      );

    await this.perfilRepository.remove(perfil);
  }
}
