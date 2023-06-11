/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PerfilEntity } from './perfil.entity';
import { PerfilService } from './perfil.service';
import { faker } from '@faker-js/faker';

describe('PerfilService', () => {
  let service: PerfilService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<PerfilEntity>;
  let perfilList: PerfilEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerfilService],
    }).compile();

    service = module.get<PerfilService>(PerfilService);
    repository = module.get<Repository<PerfilEntity>>(getRepositoryToken(PerfilEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    //repository.query('TRUNCATE TABLE "perfil_entity" CASCADE');
    repository.clear();
    perfilList = [];
    for (let i = 0; i < 5; i++) {
      const perfil: PerfilEntity = await repository.save({
        nombre: faker.name.fullName(),
        correo: faker.internet.email(),
        fechaDeNacimiento: faker.datatype.string(),
        documento: faker.datatype.number()
      });
      perfilList.push(perfil);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll debe retornar todos los perfiles', async () => {
    const perfiles: PerfilEntity[] = await service.findAll()
    //repository.query('SELECT * FROM perfil_entity');
    expect(perfiles).not.toBeNull();
    expect(perfiles).toHaveLength(perfilList.length);
  });
  it('findOne debe retornar un perfil por id', async () => {
    const perfilactual: PerfilEntity = perfilList[0];
    const perfil: PerfilEntity = await service.findOne(perfilactual.id);
    expect(perfil).not.toBeNull();
    expect(perfil.nombre).toEqual(perfilactual.nombre)
    expect(perfil.correo).toEqual(perfilactual.correo)
    expect(perfil.fechaDeNacimiento).toEqual(perfilactual.fechaDeNacimiento)
    expect(perfil.documento).toEqual(perfilactual.documento)
  });
  it('findOne debe retornar error al dar un id no valido', async () => {
    await expect(() => service.findOne("00000000-e89b-12d3-a456-426614174000")).rejects.toHaveProperty("message", "el perfil con ese id, no se encontro")
  });
  it('create deberia retornar un nuevo perfil', async () => {
    const perfil: PerfilEntity = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
      publicacion:[],
      likes: [],
      metricas: [],
      rutinas: []
    }

    const nuevoperfil: PerfilEntity = await service.create(perfil);
    expect(nuevoperfil).not.toBeNull();

    const perfil2: PerfilEntity = await repository.findOne({ where: { id: nuevoperfil.id } })
    expect(perfil2).not.toBeNull();
    expect(perfil2).not.toBeNull();
    expect(perfil2.nombre).toEqual(nuevoperfil.nombre)
    expect(perfil2.correo).toEqual(nuevoperfil.correo)
    expect(perfil2.fechaDeNacimiento).toEqual(nuevoperfil.fechaDeNacimiento)
    expect(perfil2.documento).toEqual(nuevoperfil.documento)
  });

  it('update deberia actualizar un perfil', async () => {
    const perfil: PerfilEntity = perfilList[0];
    perfil.nombre = "nuevo nombre";
    perfil.correo = "nuevo@nuevo.com";
    const perfilActualizado: PerfilEntity = await service.update(perfil.id, perfil);
    expect(perfilActualizado).not.toBeNull();
    const perfil2: PerfilEntity = await repository.findOne({ where: { id: perfil.id } })
    expect(perfil2).not.toBeNull();
    expect(perfil2.nombre).toEqual(perfil.nombre)
    expect(perfil2.correo).toEqual(perfil.correo)
    expect(perfil2.fechaDeNacimiento).toEqual(perfil.fechaDeNacimiento)
    expect(perfil2.documento).toEqual(perfil.documento)
  });
  it('update deberia dar un error para un perfil no existente', async () => {
    let perfil: PerfilEntity = perfilList[0];
    perfil = {
      ...perfil, nombre: "Nuevo nombre", correo: "nuevo@nuevo.com"
    }
    await expect(() => service.update('10000000-e89b-12d3-a456-426614174000', perfil)).rejects.toHaveProperty("message", "el perfil con ese id, no se encontro")
  });
  it('delete deberia eliminar un perfil', async () => {
    const perfil: PerfilEntity = perfilList[0];
    await service.delete(perfil.id);
    const perfilEliminado: PerfilEntity = await repository.findOne({ where: { id: perfil.id } })
    expect(perfilEliminado).toBeNull();
  });
  it('delete deberia generar un error para un perfil no valido', async () => {
    await expect(() => service.delete("10000000-e89b-12d3-a456-426614174000")).rejects.toHaveProperty("message", "el perfil con ese id, no se encontro")
  });

});