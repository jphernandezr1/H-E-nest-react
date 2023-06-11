import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ForoEntity } from './foro.entity';
import { ForoService } from './foro.service';
import { faker } from '@faker-js/faker';

describe('ForoService', () => {
  let service: ForoService;
  let repository: Repository<ForoEntity>;
  let ForosList: ForoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ForoService],
    }).compile();

    service = module.get<ForoService>(ForoService);
    repository = module.get<Repository<ForoEntity>>(
      getRepositoryToken(ForoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ForosList = [];
    for (let i = 0; i < 5; i++) {
      const foro: ForoEntity = await repository.save({
        titulo: faker.name.fullName(),
        numPublicaciones: Math.floor(Math.random() * 60) + 1,
      });
      ForosList.push(foro);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all foros', async () => {
    const foro: ForoEntity[] = await service.findAll();
    expect(foro).not.toBeNull();
    expect(foro).toHaveLength(ForosList.length);
  });

  it('findOne should return a foro by id', async () => {
    const storedForo: ForoEntity = ForosList[0];
    const foro: ForoEntity = await service.findOne(storedForo.id);
    expect(foro).not.toBeNull();
    expect(foro.titulo).toEqual(storedForo.titulo);
    expect(foro.numPublicaciones).toEqual(storedForo.numPublicaciones);
  });

  it('findOne should throw an exception for an invalid foro', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The foro with the given id was not found',
    );
  });

  it('create should return a new foro', async () => {
    const foro: ForoEntity = {
      id: '',
      titulo: faker.name.fullName(),
      numPublicaciones: Math.floor(Math.random() * 60) + 1,
      publicaciones: [],
    };

    const newForo: ForoEntity = await service.create(foro);
    expect(newForo).not.toBeNull();

    const storedForo: ForoEntity = await repository.findOne({
      where: { id: newForo.id },
    });
    expect(storedForo).not.toBeNull();
    expect(storedForo.titulo).toEqual(newForo.titulo);
    expect(storedForo.numPublicaciones).toEqual(newForo.numPublicaciones);
  });

  it('update should modify a Foro', async () => {
    const foro: ForoEntity = ForosList[0];
    foro.titulo = 'New name';
    foro.numPublicaciones = Math.floor(Math.random() * 60) + 1;

    const updatedForo: ForoEntity = await service.update(foro.id, foro);
    expect(updatedForo).not.toBeNull();

    const storedForo: ForoEntity = await repository.findOne({
      where: { id: foro.id },
    });
    expect(storedForo).not.toBeNull();
    expect(storedForo.titulo).toEqual(foro.titulo);
    expect(storedForo.numPublicaciones).toEqual(foro.numPublicaciones);
  });

  it('update should throw an exception for an invalid foro', async () => {
    let foro: ForoEntity = ForosList[0];
    foro = {
      ...foro,
      titulo: 'New name',
      numPublicaciones: Math.floor(Math.random() * 60) + 1,
    };
    await expect(() => service.update('0', foro)).rejects.toHaveProperty(
      'message',
      'The foro with the given id was not found',
    );
  });

  it('delete should remove a foro', async () => {
    const foro: ForoEntity = ForosList[0];
    await service.delete(foro.id);

    const deletedForo: ForoEntity = await repository.findOne({
      where: { id: foro.id },
    });
    expect(deletedForo).toBeNull();
  });

  it('delete should throw an exception for an invalid foro', async () => {
    const foro: ForoEntity = ForosList[0];
    await service.delete(foro.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The foro with the given id was not found',
    );
  });
});
