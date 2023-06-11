import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { ForoEntity } from '../foro/foro.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ForoPublicacionService {
  constructor(
    @InjectRepository(ForoEntity)
    private readonly foroRepository: Repository<ForoEntity>,

    @InjectRepository(PublicacionEntity)
    private readonly publicacionRepository: Repository<PublicacionEntity>,
  ) {}

  async addpublicacionforo(
    foroId: string,
    publicacionId: string,
  ): Promise<ForoEntity> {
    const publicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({
        where: { id: publicacionId },
      });
    if (!publicacion)
      throw new BusinessLogicException(
        'The publicacion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const foro: ForoEntity = await this.foroRepository.findOne({
      where: { id: foroId },
      relations: ['publicaciones'],
    });
    if (!foro)
      throw new BusinessLogicException(
        'The foro with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    foro.publicaciones = [...foro.publicaciones, publicacion];
    return await this.foroRepository.save(foro);
  }

  async findPublicaconByForoIdPublicacionId(
    foroId: string,
    publicacionId: string,
  ): Promise<PublicacionEntity> {
    const publicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({
        where: { id: publicacionId },
      });
    if (!publicacion)
      throw new BusinessLogicException(
        'The publicacion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const foro: ForoEntity = await this.foroRepository.findOne({
      where: { id: foroId },
      relations: ['publicaciones'],
    });
    if (!foro)
      throw new BusinessLogicException(
        'The foro with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const foroPublicacion: PublicacionEntity = foro.publicaciones.find(
      (e) => e.id === publicacion.id,
    );

    if (!foroPublicacion)
      throw new BusinessLogicException(
        'The publicacion with the given id is not associated to the foro',
        BusinessError.PRECONDITION_FAILED,
      );

    return foroPublicacion;
  }

  async findpublicacionesByforoId(
    foroId: string,
  ): Promise<PublicacionEntity[]> {
    const foro: ForoEntity = await this.foroRepository.findOne({
      where: { id: foroId },
      relations: ['publicaciones'],
    });
    if (!foro)
      throw new BusinessLogicException(
        'The foro with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return foro.publicaciones;
  }

  async associatepublicacionesForo(
    foroId: string,
    publicaciones: PublicacionEntity[],
  ): Promise<ForoEntity> {
    const foro: ForoEntity = await this.foroRepository.findOne({
      where: { id: foroId },
      relations: ['publicaciones'],
    });

    if (!foro)
      throw new BusinessLogicException(
        'The foro with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < publicaciones.length; i++) {
      const publicacion: PublicacionEntity =
        await this.publicacionRepository.findOne({
          where: { id: publicaciones[i].id },
        });
      if (!publicacion)
        throw new BusinessLogicException(
          'The publicacion with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    foro.publicaciones = publicaciones;
    return await this.foroRepository.save(foro);
  }

  async deletePublicacionForo(foroId: string, publicacionId: string) {
    const publicacion: PublicacionEntity =
      await this.publicacionRepository.findOne({
        where: { id: publicacionId },
      });
    if (!publicacion)
      throw new BusinessLogicException(
        'The publicacion with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const foro: ForoEntity = await this.foroRepository.findOne({
      where: { id: foroId },
      relations: ['publicaciones'],
    });
    if (!foro)
      throw new BusinessLogicException(
        'The foro with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const foroPublicacion: PublicacionEntity = foro.publicaciones.find(
      (e) => e.id === publicacion.id,
    );

    if (!foroPublicacion)
      throw new BusinessLogicException(
        'The publicacion with the given id is not associated to the foro',
        BusinessError.PRECONDITION_FAILED,
      );

    foro.publicaciones = foro.publicaciones.filter(
      (e) => e.id !== publicacionId,
    );
    await this.foroRepository.save(foro);
  }
}
