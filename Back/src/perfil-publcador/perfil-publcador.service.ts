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
export class PerfilPublcadorService {
  constructor(
    @InjectRepository(PerfilEntity)
    private readonly perfilRepository: Repository<PerfilEntity>,

    @InjectRepository(PublicacionEntity)
    private readonly publicacionRepository: Repository<PublicacionEntity>,
  ) {}

  async addPublicacionPerfil(
    perfilId: string,
    publicacionId: string,
  ): Promise<PerfilEntity> {
    const publicacio: PublicacionEntity =
      await this.publicacionRepository.findOne({
        where: { id: publicacionId },
      });
    if (!publicacio)
      throw new BusinessLogicException(
        'la publicacion con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['publicacion'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    perfil.publicacion = [...perfil.publicacion, publicacio];
    return await this.perfilRepository.save(perfil);
  }

  async findPublicacionPorPerfilIdpublicacionId(
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
        'la publicacion con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['publicacion'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    const perfilpub: PublicacionEntity = perfil.publicacion.find(
      (e) => e.id === publica.id,
    );
    if (!perfilpub)
      throw new BusinessLogicException(
        'la publicacion con ese id no esta asociada al perfil',
        BusinessError.PRECONDITION_FAILED,
      );
    return perfilpub;
  }
  async findPublicacionPorPerfilId(
    perfilId: string,
  ): Promise<PublicacionEntity[]> {
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['publicacion'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return perfil.publicacion;
  }
  async asociarPublicacionPerfil(
    perfilId: string,
    publicaciones: PublicacionEntity[],
  ): Promise<PerfilEntity> {
    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['publicacion'],
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
          'la publicacion con ese id no fue encontrada',
          BusinessError.NOT_FOUND,
        );
    }
    perfil.publicacion = publicaciones;
    return await this.perfilRepository.save(perfil);
  }
  async deletePublicacionPerfil(perfilId: string, publicacionId: string) {
    const pub: PublicacionEntity = await this.publicacionRepository.findOne({
      where: { id: publicacionId },
    });
    if (!pub)
      throw new BusinessLogicException(
        'la publicacion con ese id no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const perfil: PerfilEntity = await this.perfilRepository.findOne({
      where: { id: perfilId },
      relations: ['publicacion'],
    });
    if (!perfil)
      throw new BusinessLogicException(
        'el perfil con ese id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    const perfilpub: PublicacionEntity = perfil.publicacion.find(
      (e) => e.id === pub.id,
    );
    if (!perfilpub)
      throw new BusinessLogicException(
        'la publicacion con ese id no esta asociada al perfil',
        BusinessError.PRECONDITION_FAILED,
      );

    perfil.publicacion = perfil.publicacion.filter(
      (e) => e.id !== publicacionId,
    );
    await this.perfilRepository.save(perfil);
  }
}
