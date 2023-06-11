import { Test, TestingModule } from '@nestjs/testing';
import { RutinaService } from './rutina.service';

/*describe('RutinaService', () => {
  let service: RutinaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RutinaService],
    }).compile();

    service = module.get<RutinaService>(RutinaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});*/

/* eslint-disable prettier/prettier */
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RutinaEntity } from './rutina.entity';
import { faker } from '@faker-js/faker';

describe('RutinaService', () => {
  let service: RutinaService;
  let repository: Repository<RutinaEntity>;
  let rutinaList: RutinaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RutinaService],
    }).compile();

    service = module.get<RutinaService>(RutinaService);
    repository = module.get<Repository<RutinaEntity>>(getRepositoryToken(RutinaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    rutinaList = [];
    for(let i = 0; i < 5; i++){
        const perfil: RutinaEntity = await repository.save({
        id: ""+i,
        nombre: faker.internet.password(), 
        infoAdicional: faker.lorem.sentence() 
        ,ejercicios:[],
        recetas:[]
      })
        rutinaList.push(perfil);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all rutinas', async () => {
    const rutina: RutinaEntity[] = await service.findAll();
    expect(rutina).not.toBeNull();
    expect(rutina).toHaveLength(rutinaList.length);
  });

  it('findOne should return a rutina by id', async () => {
    const storedRutina: RutinaEntity = rutinaList[0];
    const rutina: RutinaEntity = await service.findOne(storedRutina.id);
    expect(rutina).not.toBeNull();
    expect(rutina.nombre).toEqual(storedRutina.nombre)
    expect(rutina.infoAdicional).toEqual(storedRutina.infoAdicional)
    
  });

  it('findOne should throw an exception for an invalid rutina', async () => {
    await expect(() => service.findOne('10000000-e89b-12d3-a456-426614174000')).rejects.toHaveProperty("message", "The rutina with the given id was not found")
  });

  it('create should return a new rutina', async () => {
    const rutina: RutinaEntity = {
      id: "",
      nombre: faker.name.fullName(), 
      infoAdicional: faker.lorem.sentence(), 
      ejercicios: [],
      recetas: []
    }

    const newRutina: RutinaEntity = await service.create(rutina);
    expect(newRutina).not.toBeNull();

    const storedRutina: RutinaEntity = await repository.findOne({where: {id: newRutina.id}})
    expect(storedRutina).not.toBeNull();
    expect(storedRutina.nombre).toEqual(newRutina.nombre)
    expect(storedRutina.infoAdicional).toEqual(newRutina.infoAdicional)
  });

  it('update should modify a rutina', async () => {
    const rutina: RutinaEntity = rutinaList[0];
    rutina.nombre = "New name";
    rutina.infoAdicional = "New info";
  
    const updatedRutina: RutinaEntity = await service.update(rutina.id, rutina);
    expect(updatedRutina).not.toBeNull();
  
    const storedRutina: RutinaEntity = await repository.findOne({ where: { id: rutina.id } })
    expect(storedRutina).not.toBeNull();
    expect(storedRutina.nombre).toEqual(rutina.nombre)
    expect(storedRutina.infoAdicional).toEqual(rutina.infoAdicional)
  });
 
  it('update should throw an exception for an invalid rutina', async () => {
    let rutina: RutinaEntity = rutinaList[0];
    rutina = {
      ...rutina, nombre: "New name2", infoAdicional: "New info2"
    }
    await expect(() => service.update('10000000-e89b-12d3-a456-426614174000', rutina)).rejects.toHaveProperty("message", "The rutina with the given id was not found")
  });

  it('delete should remove a rutina', async () => {
    const rutina: RutinaEntity = rutinaList[0];
    await service.delete(rutina.id);
  
    const deletedRutina: RutinaEntity = await repository.findOne({ where: { id: rutina.id } })
    expect(deletedRutina).toBeNull();
  });

  it('delete should throw an exception for an invalid rutina', async () => {
    const rutina: RutinaEntity = rutinaList[0];
    await service.delete(rutina.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The rutina with the given id was not found")
  });
 
});
