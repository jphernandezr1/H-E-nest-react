import { Test, TestingModule } from '@nestjs/testing';
import { EjercicioService } from './ejercicio.service';

/*describe('EjercicioService', () => {
  let service: EjercicioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EjercicioService],
    }).compile();

    service = module.get<EjercicioService>(EjercicioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});*/

/* eslint-disable prettier/prettier */
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EjercicioEntity } from './ejercicio.entity';





import { faker } from '@faker-js/faker';

describe('EjercicioService', () => {
  let service: EjercicioService;
  let repository: Repository<EjercicioEntity>;
  let rutinaList: EjercicioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EjercicioService],
    }).compile();

    service = module.get<EjercicioService>(EjercicioService);
    repository = module.get<Repository<EjercicioEntity>>(getRepositoryToken(EjercicioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    rutinaList = [];
    for(let i = 0; i < 5; i++){
        const ejercicio: EjercicioEntity = await repository.save({
        id:""+i,
        tipo: faker.datatype.string(), 
        duracion: i+99, 
        numRepeiciones: 10+i, 
        infoAdicional: faker.address.city()})
        rutinaList.push(ejercicio);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all ejercicio', async () => {
    const ejercicio: EjercicioEntity[] = await service.findAll();
    expect(ejercicio).not.toBeNull();
    expect(ejercicio).toHaveLength(rutinaList.length);
  });

  it('findOne should return a ejercicio by id', async () => {
    const storedEjercicio: EjercicioEntity = rutinaList[0];
    const ejercicio: EjercicioEntity = await service.findOne(storedEjercicio.id);
    expect(ejercicio).not.toBeNull();
    expect(ejercicio.tipo).toEqual(storedEjercicio.tipo)
    expect(ejercicio.duracion).toEqual(storedEjercicio.duracion)
    expect(ejercicio.numRepeiciones).toEqual(storedEjercicio.numRepeiciones)
    expect(ejercicio.infoAdicional).toEqual(storedEjercicio.infoAdicional)
  });

  it('findOne should throw an exception for an invalid ejercicio', async () => {
    await expect(() => service.findOne('10000000-e89b-12d3-a456-426614174000')).rejects.toHaveProperty("message", "The ejercicio with the given id was not found")
  });

  it('create should return a new ejercicio', async () => {
    const ejercicio: EjercicioEntity = {
      id: "",
      tipo: faker.datatype.string(),
      duracion: 99,
      numRepeiciones: 10,
      infoAdicional: faker.address.city(),
    }

    const newEjercicio: EjercicioEntity = await service.create(ejercicio);
    expect(newEjercicio).not.toBeNull();

    const storedEjercicio: EjercicioEntity = await repository.findOne({where: {id: newEjercicio.id}})
    expect(storedEjercicio).not.toBeNull();
    expect(storedEjercicio.tipo).toEqual(newEjercicio.tipo)
    expect(storedEjercicio.duracion).toEqual(newEjercicio.duracion)
    expect(storedEjercicio.numRepeiciones).toEqual(newEjercicio.numRepeiciones)
    expect(storedEjercicio.infoAdicional).toEqual(newEjercicio.infoAdicional)
  });

  it('update should modify a ejercicio', async () => {
    const ejercicio: EjercicioEntity = rutinaList[0];
    ejercicio.tipo = "New tipo";
    ejercicio.duracion = 10;
  
    const updatedEjercicio: EjercicioEntity = await service.update(ejercicio.id, ejercicio);
    expect(updatedEjercicio).not.toBeNull();
  
    const storedEjercicio: EjercicioEntity = await repository.findOne({ where: { id: ejercicio.id } })
    expect(storedEjercicio).not.toBeNull();
    expect(storedEjercicio.tipo).toEqual(ejercicio.tipo)
    expect(storedEjercicio.duracion).toEqual(ejercicio.duracion)
  });
 
  it('update should throw an exception for an invalid ejercicio', async () => {
    let ejercicio: EjercicioEntity = rutinaList[0];
    ejercicio = {
      ...ejercicio, tipo: "New tipo", duracion: 10
    }
    await expect(() => service.update('10000000-e89b-12d3-a456-426614174000', ejercicio)).rejects.toHaveProperty("message", "The ejercicio with the given id was not found")
  });

  it('delete should remove a ejercicio', async () => {
    const ejercicio: EjercicioEntity = rutinaList[0];
    await service.delete(ejercicio.id);
  
    const deletedMuseum: EjercicioEntity = await repository.findOne({ where: { id: ejercicio.id } })
    expect(deletedMuseum).toBeNull();
  });

  it('delete should throw an exception for an invalid ejercicio', async () => {
    const ejercicio: EjercicioEntity = rutinaList[0];
    await service.delete(ejercicio.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The ejercicio with the given id was not found")
  });
 
});
