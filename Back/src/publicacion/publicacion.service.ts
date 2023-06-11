import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PublicacionEntity } from './publicacion.entity';

@Injectable()
export class PublicacionService {
  constructor(
    @InjectRepository(PublicacionEntity)
    private readonly publicacionRepository: Repository<PublicacionEntity>,
  ) {}

  async findAll(): Promise<PublicacionEntity[]> {
    return await this.publicacionRepository.find({
      relations: [],
    });
  }

  async findOne(id: string): Promise<PublicacionEntity> {
    const publicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({
        where: { id },
        relations: [],
      });
    if (!publicacion)
      throw new BusinessLogicException(
        'The publicacion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return publicacion;
  }

  async create(publicacion: PublicacionEntity): Promise<PublicacionEntity> {
    return await this.publicacionRepository.save(publicacion);
  }

  async update(
    id: string,
    publicacion: PublicacionEntity,
  ): Promise<PublicacionEntity> {
    const persistedPublicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({ where: { id } });
    if (!persistedPublicacion)
      throw new BusinessLogicException(
        'The publicacion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    publicacion.id = id;

    return await this.publicacionRepository.save(publicacion);
  }

  async delete(id: string) {
    const publicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({
        where: { id },
      });
    if (!publicacion)
      throw new BusinessLogicException(
        'The publicacion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.publicacionRepository.remove(publicacion);
  }
}
