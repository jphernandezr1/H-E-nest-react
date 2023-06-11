import { Injectable } from '@nestjs/common';
import { PerfilEntity } from '../perfil/perfil.entity';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class PerfilLikesService {
  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,

    @InjectRepository(PublicacionEntity)
    private readonly publicacionRepository: Repository<PublicacionEntity>,
  ) {}

  async addLikePerfil(
    perfilId: string,
    publicacionId: string,
  ): Promise<PerfilEntity> {
    const publicacio: PublicacionEntity =
      await this.publicacionRepository.findOne({
        where: { id: publicacionId }
      });
    if (!publicacio)
      throw new BusinessLogicException(
        'el like con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['likes'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
      perfil.likes = [...perfil.likes, publicacio];
    return await this.perfilRepository.save(perfil);
  }

  async findLikePorPerfilIdlikeId(
    perfilId: string,
    publicacionId: string,
  ): Promise<PublicacionEntity> {
    const publica: PublicacionEntity = await this.publicacionRepository.findOne(
      {
        where: { id: publicacionId },
      },
    );
    if (!publica)
      throw new BusinessLogicException(
        'el like con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['likes'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    const perfilpub: PublicacionEntity = perfil.likes.find(
      (e) => e.id === publica.id,
    );
    if (!perfilpub)
      throw new BusinessLogicException(
        'el like con ese id no esta asociada al perfil',
        BusinessError.PRECONDITION_FAILED,
      );
    return perfilpub;
  }
  async findLikePorPerfilId(
    perfilId: string,
  ): Promise<PublicacionEntity[]> {
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['likes'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return perfil.likes;
  }
  async asociarlikePerfil(
    perfilId: string,
    publicaciones: PublicacionEntity[],
  ): Promise<PerfilEntity> {
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['likes'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < publicaciones.length; i++) {
      const pub: PublicacionEntity = await this.publicacionRepository.findOne({
        where: { id: publicaciones[i].id },
      });
      if (!pub)
        throw new BusinessLogicException(
          'el like con ese id no fue encontrada',
          BusinessError.NOT_FOUND,
        );
    }
    perfil.likes = publicaciones;
    return await this.perfilRepository.save(perfil);
  }
  async deleteLikePerfil(perfilId: string, publicacionId: string) {
    const pub: PublicacionEntity = await this.publicacionRepository.findOne({
      where: { id: publicacionId },
    });
    if (!pub)
      throw new BusinessLogicException(
        'el like con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['likes'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    const perfilpub: PublicacionEntity = perfil.likes.find(
      (e) => e.id === pub.id,
    );
    if (!perfilpub)
      throw new BusinessLogicException(
        'el like con ese id no esta asociada al perfil',
        BusinessError.PRECONDITION_FAILED,
      );

    perfil.likes = perfil.likes.filter(
      (e) => e.id !== publicacionId,
    );
    await this.perfilRepository.save(perfil);
  }
}
