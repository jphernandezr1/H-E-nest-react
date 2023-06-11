import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ForoEntity } from './foro.entity';

@Injectable()
export class ForoService {
  constructor(
    @InjectRepository(ForoEntity)
    private readonly foroRepository: Repository<ForoEntity>,
  ) {}

  async findAll(): Promise<ForoEntity[]> {
    return await this.foroRepository.find({
      relations: ['publicaciones'],
    });
  }

  async findOne(id: string): Promise<ForoEntity> {
    const foro: ForoEntity = await this.foroRepository.findOne({
      where: { id },
      relations: ['publicaciones'],
    });
    if (!foro)
      throw new BusinessLogicException(
        'The foro with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return foro;
  }

  async create(foro: ForoEntity): Promise<ForoEntity> {
    return await this.foroRepository.save(foro);
  }

  async update(id: string, foro: ForoEntity): Promise<ForoEntity> {
    const persistedForo: ForoEntity = await this.foroRepository.findOne({
      where: { id },
    });
    if (!persistedForo)
      throw new BusinessLogicException(
        'The foro with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    foro.id = id;

    return await this.foroRepository.save(foro);
  }

  async delete(id: string) {
    const foro: ForoEntity = await this.foroRepository.findOne({
      where: { id },
    });
    if (!foro)
      throw new BusinessLogicException(
        'The foro with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.foroRepository.remove(foro);
  }
}
