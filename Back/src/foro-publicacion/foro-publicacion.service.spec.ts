import { Test, TestingModule } from '@nestjs/testing';
import { PublicacionEntity } from '../publicacion/publicacion.entity';
import { Repository } from 'typeorm';
import { ForoEntity } from '../foro/foro.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ForoPublicacionService } from './foro-publicacion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ForoPublicacionService', () => {
  let service: ForoPublicacionService;
  let foroRepository: Repository<ForoEntity>;
  let publicacionRepository: Repository<PublicacionEntity>;
  let foro: ForoEntity;
  let publicacionesList: PublicacionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ForoPublicacionService],
    }).compile();

    service = module.get<ForoPublicacionService>(ForoPublicacionService);
    foroRepository = module.get<Repository<ForoEntity>>(
      getRepositoryToken(ForoEntity),
    );
    publicacionRepository = module.get<Repository<PublicacionEntity>>(
      getRepositoryToken(PublicacionEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    publicacionRepository.clear();
    foroRepository.clear();

    publicacionesList = [];
    for (let i = 0; i < 5; i++) {
      const publicacion: PublicacionEntity = await publicacionRepository.save({
        id: (i + 1).toString(),
        texto: 'New name',
        numMegusta: Math.floor(Math.random() * 60) + 1,
      });
      publicacionesList.push(publicacion);
    }

    foro = await foroRepository.save({
      titulo: faker.name.fullName(),
      numPublicaciones: Math.floor(Math.random() * 60) + 1,
      publicaciones: publicacionesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addpublicacionforo should add an publicacion to a foro', async () => {
    const newpublicacion: PublicacionEntity = await publicacionRepository.save({
      texto: 'New name',
      numMegusta: Math.floor(Math.random() * 60) + 1,
    });

    const newforo: ForoEntity = await foroRepository.save({
      titulo: faker.name.fullName(),
      numPublicaciones: Math.floor(Math.random() * 60) + 1,
    });

    const result: ForoEntity = await service.addpublicacionforo(
      newforo.id,
      newpublicacion.id,
    );

    expect(result.publicaciones.length).toBe(1);
    expect(result.publicaciones[0]).not.toBeNull();
    expect(result.publicaciones[0].texto).toBe(newpublicacion.texto);
    expect(result.publicaciones[0].numMegusta).toBe(newpublicacion.numMegusta);
  });

  it('addpublicacionforo should thrown exception for an invalid publicacion', async () => {
    const newforo: ForoEntity = await foroRepository.save({
      titulo: faker.name.fullName(),
      numPublicaciones: Math.floor(Math.random() * 60) + 1,
    });

    await expect(() =>
      service.addpublicacionforo(newforo.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id was not found',
    );
  });

  it('addpublicacionforo should throw an exception for an invalid foro', async () => {
    const newpublicacion: PublicacionEntity = await publicacionRepository.save({
      texto: 'New name',
      numMegusta: Math.floor(Math.random() * 60) + 1,
    });

    await expect(() =>
      service.addpublicacionforo('0', newpublicacion.id),
    ).rejects.toHaveProperty(
      'message',
      'The foro with the given id was not found',
    );
  });

  it('findpublicacionByforoIdpublicacionId should return publicacion by foro', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    const storedpublicacion: PublicacionEntity =
      await service.findPublicaconByForoIdPublicacionId(
        foro.id,
        publicacion.id,
      );
    expect(storedpublicacion).not.toBeNull();
    expect(storedpublicacion.texto).toBe(publicacion.texto);
    expect(storedpublicacion.numMegusta).toBe(publicacion.numMegusta);
  });

  it('findpublicacionByforoIdpublicacionId should throw an exception for an invalid publicacion', async () => {
    await expect(() =>
      service.findPublicaconByForoIdPublicacionId(foro.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id was not found',
    );
  });

  it('findpublicacionByforoIdpublicacionId should throw an exception for an invalid foro', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    await expect(() =>
      service.findPublicaconByForoIdPublicacionId('0', publicacion.id),
    ).rejects.toHaveProperty(
      'message',
      'The foro with the given id was not found',
    );
  });

  it('findpublicacionByforoIdpublicacionId should throw an exception for an publicacion not associated to the foro', async () => {
    const newpublicacion: PublicacionEntity = await publicacionRepository.save({
      texto: 'New name',
      numMegusta: Math.floor(Math.random() * 60) + 1,
    });

    await expect(() =>
      service.findPublicaconByForoIdPublicacionId(foro.id, newpublicacion.id),
    ).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id is not associated to the foro',
    );
  });

  it('findpublicacionsByforoId should return publicacions by foro', async () => {
    const publicacions: PublicacionEntity[] =
      await service.findpublicacionesByforoId(foro.id);
    expect(publicacions.length).toBe(5);
  });

  it('findpublicacionsByforoId should throw an exception for an invalid foro', async () => {
    await expect(() =>
      service.findpublicacionesByforoId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The foro with the given id was not found',
    );
  });

  it('associatepublicacionsforo should update publicacions list for a foro', async () => {
    const newpublicacion: PublicacionEntity = await publicacionRepository.save({
      texto: 'New name',
      numMegusta: Math.floor(Math.random() * 60) + 1,
    });

    const updatedforo: ForoEntity = await service.associatepublicacionesForo(
      foro.id,
      [newpublicacion],
    );
    expect(updatedforo.publicaciones.length).toBe(1);

    expect(updatedforo.publicaciones[0].texto).toBe(newpublicacion.texto);
    expect(updatedforo.publicaciones[0].numMegusta).toBe(
      newpublicacion.numMegusta,
    );
  });

  it('associatepublicacionsforo should throw an exception for an invalid foro', async () => {
    const newpublicacion: PublicacionEntity = await publicacionRepository.save({
      texto: 'New name',
      numMegusta: Math.floor(Math.random() * 60) + 1,
    });

    await expect(() =>
      service.associatepublicacionesForo('0', [newpublicacion]),
    ).rejects.toHaveProperty(
      'message',
      'The foro with the given id was not found',
    );
  });

  it('associatepublicacionsforo should throw an exception for an invalid publicacion', async () => {
    const newpublicacion: PublicacionEntity = publicacionesList[0];
    newpublicacion.id = '0';

    await expect(() =>
      service.associatepublicacionesForo(foro.id, [newpublicacion]),
    ).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id was not found',
    );
  });

  it('deletepublicacionToforo should remove an publicacion from a foro', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];

    await service.deletePublicacionForo(foro.id, publicacion.id);

    const storedforo: ForoEntity = await foroRepository.findOne({
      where: { id: foro.id },
      relations: ['publicaciones'],
    });
    const deletedpublicacion: PublicacionEntity = storedforo.publicaciones.find(
      (a) => a.id === publicacion.id,
    );

    expect(deletedpublicacion).toBeUndefined();
  });

  it('deletepublicacionToforo should thrown an exception for an invalid publicacion', async () => {
    await expect(() =>
      service.deletePublicacionForo(foro.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id was not found',
    );
  });

  it('deletepublicacionToforo should thrown an exception for an invalid foro', async () => {
    const publicacion: PublicacionEntity = publicacionesList[0];
    await expect(() =>
      service.deletePublicacionForo('0', publicacion.id),
    ).rejects.toHaveProperty(
      'message',
      'The foro with the given id was not found',
    );
  });

  it('deletepublicacionToforo should thrown an exception for an non asocciated publicacion', async () => {
    const newpublicacion: PublicacionEntity = await publicacionRepository.save({
      texto: 'New name',
      numMegusta: Math.floor(Math.random() * 60) + 1,
    });

    await expect(() =>
      service.deletePublicacionForo(foro.id, newpublicacion.id),
    ).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id is not associated to the foro',
    );
  });
});
