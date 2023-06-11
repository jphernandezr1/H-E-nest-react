

/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EjercicioEntity } from '../ejercicio/ejercicio.entity';
import { Repository } from 'typeorm';
import { RutinaEntity } from '../rutina/rutina.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RutinaEjercicioService } from './rutina-ejercicio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


//museo = rutinaa
// aartwork = ejercicio

describe('RutinaEjercicioService', () => {
  let service: RutinaEjercicioService;
  let rutinaRepository: Repository<RutinaEntity>;
  let ejercicioRepository: Repository<EjercicioEntity>;
  let rutina: RutinaEntity;
  let ejerciciosList : EjercicioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RutinaEjercicioService],
    }).compile();

    service = module.get<RutinaEjercicioService>(RutinaEjercicioService);
    rutinaRepository = module.get<Repository<RutinaEntity>>(getRepositoryToken(RutinaEntity));
    ejercicioRepository = module.get<Repository<EjercicioEntity>>(getRepositoryToken(EjercicioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    ejercicioRepository.clear();
    rutinaRepository.clear();

    ejerciciosList = [];
    for(let i = 0; i < 5; i++){
        const ejercicio: EjercicioEntity = await ejercicioRepository.save({
          id:""+i,
          tipo: faker.datatype.string(), 
          duracion: i+99, 
          numRepeiciones: 10+i, 
          infoAdicional: faker.address.city()
        })
        ejerciciosList.push(ejercicio);
    }

    rutina = await rutinaRepository.save({
      id: ""+Math.random(),
      nombre: faker.internet.password(), 
      infoAdicional: faker.lorem.sentence(),
      ejercicios: ejerciciosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addEjercicioRutina should add an ejercicio to a rutina', async () => {
    const newEjercicio: EjercicioEntity = await ejercicioRepository.save({
      id:""+10,
      tipo: faker.datatype.string(), 
      duracion: 99, 
      numRepeiciones: 10, 
      infoAdicional: faker.address.city()
    });

    const newRutina: RutinaEntity = await rutinaRepository.save({
      id: ""+Math.random(),
      nombre: faker.internet.password(), 
      infoAdicional: faker.lorem.sentence()
    })

    const result: RutinaEntity = await service.addEjercicioRutina(newRutina.id, newEjercicio.id);
    
    expect(result.ejercicios.length).toBe(1);
    expect(result.ejercicios[0]).not.toBeNull();
    expect(result.ejercicios[0].id).toBe(newEjercicio.id)
    expect(result.ejercicios[0].tipo).toBe(newEjercicio.tipo)
    expect(result.ejercicios[0].numRepeiciones).toBe(newEjercicio.numRepeiciones)
    expect(result.ejercicios[0].infoAdicional).toBe(newEjercicio.infoAdicional)
  });

  it('addEjercicioRutina should thrown exception for an invalid ejercicio', async () => {
    const newRutina: RutinaEntity = await rutinaRepository.save({
      id: ""+Math.random(),
      nombre: faker.internet.password(), 
      infoAdicional: faker.lorem.sentence()
    })

    await expect(() => service.addEjercicioRutina(newRutina.id, '10000000-e89b-12d3-a456-426614174000')).rejects.toHaveProperty("message", "The ejercicio with the given id was not found");
  });

  it('addEjercicioRutina should throw an exception for an invalid museum', async () => {
    const newEjercicio: EjercicioEntity = await ejercicioRepository.save({
      id:""+10,
      tipo: faker.datatype.string(), 
      duracion: 99, 
      numRepeiciones: 10, 
      infoAdicional: faker.address.city()
    });

    await expect(() => service.addEjercicioRutina("0", newEjercicio.id)).rejects.toHaveProperty("message", "The rutinaa with the given id was not found");
  });

  it('findEjercicioByRutinaIdEjercicioId should return ejercicio by rutina', async () => {
    const ejercicio: EjercicioEntity = ejerciciosList[0];
    const storedEjercicio: EjercicioEntity = await service.findEjercicioByRutinaIdEjercicioId(rutina.id, ejercicio.id, )
    expect(storedEjercicio).not.toBeNull();
    expect(storedEjercicio.id).toBe(ejercicio.id);
    expect(storedEjercicio.tipo).toBe(ejercicio.tipo);
    expect(storedEjercicio.duracion).toBe(ejercicio.duracion);
    expect(storedEjercicio.numRepeiciones).toBe(ejercicio.numRepeiciones);
    expect(storedEjercicio.infoAdicional).toBe(ejercicio.infoAdicional);
  });

  it('findEjercicioByRutinaIdEjercicioId should throw an exception for an invalid ejercicio', async () => {
    await expect(()=> service.findEjercicioByRutinaIdEjercicioId(rutina.id, '10000000-e89b-12d3-a456-426614174000')).rejects.toHaveProperty("message", "The ejercicio with the given id was not found"); 
  });

  it('findEjercicioByRutinaIdEjercicioId should throw an exception for an invalid rutina', async () => {
    const artwork: EjercicioEntity = ejerciciosList[0]; 
    await expect(()=> service.findEjercicioByRutinaIdEjercicioId("0", artwork.id)).rejects.toHaveProperty("message", "The rutina with the given id was not found"); 
  });

  it('findEjercicioByRutinaIdEjercicioId should throw an exception for an ejercicio not associated to the rutina', async () => {
    const newEjercicio: EjercicioEntity = await ejercicioRepository.save({
      id:""+10,
      tipo: faker.datatype.string(), 
      duracion: 99, 
      numRepeiciones: 10, 
      infoAdicional: faker.address.city()
    });

    await expect(()=> service.findEjercicioByRutinaIdEjercicioId(rutina.id, newEjercicio.id)).rejects.toHaveProperty("message", "The ejercicio with the given id is not associated to the rutina"); 
  });

  it('findEjercicioByRutinaId should return artworks by rutina', async ()=>{
    const artworks: EjercicioEntity[] = await service.findEjercicioByRutinaId(rutina.id);
    expect(artworks.length).toBe(5)
  });

  it('findEjercicioByRutinaId should throw an exception for an invalid rutina', async () => {
    await expect(()=> service.findEjercicioByRutinaId("0")).rejects.toHaveProperty("message", "The rutina with the given id was not found"); 
  });

  it('associateEjerciciosRutina should update ejercicios list for a rutina', async () => {
    const newEjercicio: EjercicioEntity = await ejercicioRepository.save({
      id:""+10,
      tipo: faker.datatype.string(), 
      duracion: 99, 
      numRepeiciones: 10, 
      infoAdicional: faker.address.city()
    });

    const updatedRutina: RutinaEntity = await service.associateEjerciciosRutina(rutina.id, [newEjercicio]);
    expect(updatedRutina.ejercicios.length).toBe(1);

    expect(updatedRutina.ejercicios[0].id).toBe(newEjercicio.id);
    expect(updatedRutina.ejercicios[0].tipo).toBe(newEjercicio.tipo);
    expect(updatedRutina.ejercicios[0].duracion).toBe(newEjercicio.duracion);
    expect(updatedRutina.ejercicios[0].numRepeiciones).toBe(newEjercicio.numRepeiciones);
    expect(updatedRutina.ejercicios[0].infoAdicional).toBe(newEjercicio.infoAdicional);
  });

  it('associateEjerciciosRutina should throw an exception for an invalid rutina', async () => {
    const newEjercicio: EjercicioEntity = await ejercicioRepository.save({
      id:""+10,
      tipo: faker.datatype.string(), 
      duracion: 99, 
      numRepeiciones: 10, 
      infoAdicional: faker.address.city()
    });

    await expect(()=> service.associateEjerciciosRutina("0", [newEjercicio])).rejects.toHaveProperty("message", "The rutina with the given id was not found"); 
  });

  it('associateEjerciciosRutina should throw an exception for an invalid ejercicio', async () => {
    const newArtwork: EjercicioEntity = ejerciciosList[0];
    newArtwork.id = '10000000-e89b-12d3-a456-426614174000';

    await expect(()=> service.associateEjerciciosRutina(rutina.id, [newArtwork])).rejects.toHaveProperty("message", "The ejercicio with the given id was not found"); 
  });

  it('deleteEjercicioRutina should remove an artwork from a rutinaa', async () => {
    const ejercicio: EjercicioEntity = ejerciciosList[0];
    
    await service.deleteEjercicioRutina(rutina.id, ejercicio.id);

    const storedRutia: RutinaEntity = await rutinaRepository.findOne({where: {id: rutina.id}, relations: ["ejercicios","recetas"]});
    const deletedEjercicio: EjercicioEntity = storedRutia.ejercicios.find(a => a.id === ejercicio.id);

    expect(deletedEjercicio).toBeUndefined();

  });

  it('deleteEjercicioRutina should thrown an exception for an invalid ejercicio', async () => {
    await expect(()=> service.deleteEjercicioRutina(rutina.id, '10000000-e89b-12d3-a456-426614174000')).rejects.toHaveProperty("message", "The ejercicio with the given id was not found"); 
  });

  it('deleteEjercicioRutina should thrown an exception for an invalid rutina', async () => {
    const ejercicio: EjercicioEntity = ejerciciosList[0];
    await expect(()=> service.deleteEjercicioRutina("0", ejercicio.id)).rejects.toHaveProperty("message", "The rutina with the given id was not found"); 
  });

  it('deleteEjercicioRutina should thrown an exception for an non asocciated artwork', async () => {
    const newEjercicio: EjercicioEntity = await ejercicioRepository.save({
      id:""+10,
      tipo: faker.datatype.string(), 
      duracion: 99, 
      numRepeiciones: 10, 
      infoAdicional: faker.address.city()
    });

    await expect(()=> service.deleteEjercicioRutina(rutina.id, newEjercicio.id)).rejects.toHaveProperty("message", "The ejercicio with the given id is not associated to the rutina"); 
  }); 

  
});
