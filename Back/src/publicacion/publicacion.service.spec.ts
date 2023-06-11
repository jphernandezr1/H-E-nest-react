import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PublicacionEntity } from './publicacion.entity';
import { PublicacionService } from './publicacion.service';
import { faker } from '@faker-js/faker';

describe('PublicacionService', () => {
  let service: PublicacionService;
  let repository: Repository<PublicacionEntity>;
  let Pulicacioneslist: PublicacionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PublicacionService],
    }).compile();

    service = module.get<PublicacionService>(PublicacionService);
    repository = module.get<Repository<PublicacionEntity>>(
      getRepositoryToken(PublicacionEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    Pulicacioneslist = [];
    for (let i = 0; i < 5; i++) {
      const publicacion: PublicacionEntity = await repository.save({
        texto: faker.name.fullName(),
        numMegusta: Math.floor(Math.random() * 60) + 1
      });
      Pulicacioneslist.push(publicacion);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all publicacions', async () => {
    const publicacion: PublicacionEntity[] = await service.findAll();
    expect(publicacion).not.toBeNull();
    expect(publicacion).toHaveLength(Pulicacioneslist.length);
  });

  it('findOne should return a publicacion by id', async () => {
    const storedpublicacion: PublicacionEntity = Pulicacioneslist[0];
    const publicacion: PublicacionEntity = await service.findOne(
      storedpublicacion.id,
    );
    expect(publicacion).not.toBeNull();
    expect(publicacion.texto).toEqual(storedpublicacion.texto);
    expect(publicacion.numMegusta).toEqual(storedpublicacion.numMegusta);
  });

  it('findOne should throw an exception for an invalid publicacion', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id was not found',
    );
  });

  it('create should return a new publicacion', async () => {
    const publicacion: PublicacionEntity = {
      id: '',
      texto: faker.name.fullName(),
      numMegusta: Math.floor(Math.random() * 60) + 1,
      likes: [],
      publicador: null,
      foro: null,
    };

    const newpublicacion: PublicacionEntity = await service.create(publicacion);
    expect(newpublicacion).not.toBeNull();

    const storedpublicacion: PublicacionEntity = await repository.findOne({
      where: { id: newpublicacion.id },
    });
    expect(storedpublicacion).not.toBeNull();
    expect(storedpublicacion.texto).toEqual(newpublicacion.texto);
    expect(storedpublicacion.numMegusta).toEqual(newpublicacion.numMegusta);
  });

  it('update should modify a publicacion', async () => {
    const publicacion: PublicacionEntity = Pulicacioneslist[0];
    publicacion.texto = 'New name';
    publicacion.numMegusta = Math.floor(Math.random() * 60) + 1;

    const updatedpublicacion: PublicacionEntity = await service.update(
      publicacion.id,
      publicacion,
    );
    expect(updatedpublicacion).not.toBeNull();

    const storedpublicacion: PublicacionEntity = await repository.findOne({
      where: { id: publicacion.id },
    });
    expect(storedpublicacion).not.toBeNull();
    expect(storedpublicacion.texto).toEqual(publicacion.texto);
    expect(storedpublicacion.numMegusta).toEqual(publicacion.numMegusta);
  });

  it('update should throw an exception for an invalid publicacion', async () => {
    let publicacion: PublicacionEntity = Pulicacioneslist[0];
    publicacion = {
      ...publicacion,
      texto: 'New name',
      numMegusta: Math.floor(Math.random() * 60) + 1,
    };
    await expect(() => service.update('0', publicacion)).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id was not found',
    );
  });

  it('delete should remove a publicacion', async () => {
    const publicacion: PublicacionEntity = Pulicacioneslist[0];
    await service.delete(publicacion.id);

    const deletedpublicacion: PublicacionEntity = await repository.findOne({
      where: { id: publicacion.id },
    });
    expect(deletedpublicacion).toBeNull();
  });

  it('delete should throw an exception for an invalid publicacion', async () => {
    const publicacion: PublicacionEntity = Pulicacioneslist[0];
    await service.delete(publicacion.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The publicacion with the given id was not found',
    );
  });
});
