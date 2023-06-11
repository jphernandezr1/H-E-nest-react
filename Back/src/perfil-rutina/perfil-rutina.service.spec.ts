
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { RutinaEntity } from '../rutina/rutina.entity';
import { Repository } from 'typeorm';
import { PerfilEntity } from '../perfil/perfil.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PerfilRutinaService } from './perfil-rutina.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

//museo = perfil
//artwork = rutina
describe('PerfilRutinaService', () => {
  let service: PerfilRutinaService;
  let perfilRepository: Repository<PerfilEntity>;
  let rutinaRepository: Repository<RutinaEntity>;
  let perfil: PerfilEntity;
  let rutinasList : RutinaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerfilRutinaService],
    }).compile();

    service = module.get<PerfilRutinaService>(PerfilRutinaService);
    perfilRepository = module.get<Repository<PerfilEntity>>(getRepositoryToken(PerfilEntity));
    rutinaRepository = module.get<Repository<RutinaEntity>>(getRepositoryToken(RutinaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    rutinaRepository.clear();
    perfilRepository.clear();

    rutinasList = [];
    for(let i = 0; i < 5; i++){
        const rutinas: RutinaEntity = await rutinaRepository.save({
          id: ""+Math.random(),
          nombre: faker.internet.password(), 
          infoAdicional: faker.lorem.sentence()
        })
        rutinasList.push(rutinas);
    }

    perfil = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
      rutinas: rutinasList,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRutinaPerfil should add an rutina to a perfil', async () => {
    const newRutina: RutinaEntity = await rutinaRepository.save({
          id: ""+Math.random(),
          nombre: faker.internet.password(), 
          infoAdicional: faker.lorem.sentence()
    });

    const newPerfil: PerfilEntity = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
      rutinas: rutinasList,
    })

    const result: PerfilEntity = await service.addRutinaPerfil(newPerfil.id, newRutina.id);
  
    expect(result.rutinas.length).toBe(6);
    expect(result.rutinas[result.rutinas.length-1]).not.toBeNull();
    expect(result.rutinas[result.rutinas.length-1].id).toBe(newRutina.id)
    expect(result.rutinas[result.rutinas.length-1].id).toBe(newRutina.id)
    expect(result.rutinas[result.rutinas.length-1].nombre).toBe(newRutina.nombre)
    expect(result.rutinas[result.rutinas.length-1].infoAdicional).toBe(newRutina.infoAdicional)
  });

  it('addRutinaPerfil should thrown exception for an invalid rutina', async () => {
    const newPerfil: PerfilEntity = await perfilRepository.save({
      nombre: faker.name.fullName(),
      correo: faker.internet.email(),
      fechaDeNacimiento: faker.datatype.string(),
      documento: faker.datatype.number(),
      
    })

    await expect(() => service.addRutinaPerfil(newPerfil.id, "0")).rejects.toHaveProperty("message", "The rutina with the given id was not found");
  });

  it('addRutinaPerfil should throw an exception for an invalid perfil', async () => {
    const newRutina: RutinaEntity = await rutinaRepository.save({
      id: ""+Math.random(),
      nombre: faker.internet.password(), 
      infoAdicional: faker.lorem.sentence()
    });

    await expect(() => service.addRutinaPerfil("0", newRutina.id)).rejects.toHaveProperty("message", "The perfil with the given id was not found");
  });

  it('findRutinaByPerfilIdRutinaId should return rutina by perfil', async () => {
    const rutina: RutinaEntity = rutinasList[0];
    const storedRutina: RutinaEntity = await service.findRutinaByPerfilIdRutinaId(perfil.id, rutina.id, )
    expect(storedRutina).not.toBeNull();
    expect(storedRutina.id).toBe(rutina.id);
    expect(storedRutina.nombre).toBe(rutina.nombre);
    expect(storedRutina.infoAdicional).toBe(rutina.infoAdicional);
  });

  it('findRutinaByPerfilIdRutinaId should throw an exception for an invalid rutina', async () => {
    await expect(()=> service.findRutinaByPerfilIdRutinaId(perfil.id, "0")).rejects.toHaveProperty("message", "The rutina with the given id was not found"); 
  });

  it('findRutinaByPerfilIdRutinaId should throw an exception for an invalid perfil', async () => {
    const rutina: RutinaEntity = rutinasList[0]; 
    await expect(()=> service.findRutinaByPerfilIdRutinaId("0", rutina.id)).rejects.toHaveProperty("message", "The perfil with the given id was not found"); 
  });

  it('findRutinaByPerfilIdRutinaId should throw an exception for an rutina not associated to the perfil', async () => {
    const newRutina: RutinaEntity = await rutinaRepository.save({
      id: ""+Math.random(),
      nombre: faker.internet.password(), 
      infoAdicional: faker.lorem.sentence()
    });

    await expect(()=> service.findRutinaByPerfilIdRutinaId(perfil.id, newRutina.id)).rejects.toHaveProperty("message", "The rutina with the given id is not associated to the perfil"); 
  });

  it('findARutinasByPerfilId should return rutina by perfil', async ()=>{
    const rutinas: RutinaEntity[] = await service.findARutinasByPerfilId(perfil.id);
    expect(rutinas.length).toBe(5)
  });

  it('findARutinasByPerfilId should throw an exception for an invalid perfil', async () => {
    await expect(()=> service.findARutinasByPerfilId("0")).rejects.toHaveProperty("message", "The perfil with the given id was not found"); 
  });

  it('findARutinasByPerfilId should update artworks list for a museum', async () => {
    const newRutina: RutinaEntity = await rutinaRepository.save({
      id: ""+Math.random(),
      nombre: faker.internet.password(), 
      infoAdicional: faker.lorem.sentence() 
    });

    const updatedMuseum: PerfilEntity = await service.associateRutinPerfil(perfil.id, [newRutina]);
    expect(updatedMuseum.rutinas.length).toBe(1);

    expect(updatedMuseum.rutinas[0].id).toBe(newRutina.id);
    expect(updatedMuseum.rutinas[0].nombre).toBe(newRutina.nombre);
    expect(updatedMuseum.rutinas[0].infoAdicional).toBe(newRutina.infoAdicional);
  });

  it('associateRutinPerfil should throw an exception for an invalid perfil', async () => {
    const newRutina: RutinaEntity = await rutinaRepository.save({
      id: ""+Math.random(),
      nombre: faker.internet.password(), 
      infoAdicional: faker.lorem.sentence()
    });

    await expect(()=> service.associateRutinPerfil("0", [newRutina])).rejects.toHaveProperty("message", "The perfil with the given id was not found"); 
  });

  it('associateRutinPerfil should throw an exception for an invalid rutina', async () => {
    const newRutina: RutinaEntity = rutinasList[0];
    newRutina.id = "0";

    await expect(()=> service.associateRutinPerfil(perfil.id, [newRutina])).rejects.toHaveProperty("message", "The rutina with the given id was not found"); 
  });

  it('deleteRutinaPerfil should remove an rutina from a perfil', async () => {
    const rutina: RutinaEntity = rutinasList[0];
    
    await service.deleteRutinaPerfil(perfil.id, rutina.id);

    const storedPerfil: PerfilEntity = await perfilRepository.findOne({where: {id: perfil.id}, relations: ["rutinas"]});
    const deletedRutina: RutinaEntity = storedPerfil.rutinas.find(a => a.id === rutina.id);

    expect(deletedRutina).toBeUndefined();

  });

  it('deleteRutinaPerfil should thrown an exception for an invalid rutina', async () => {
    await expect(()=> service.deleteRutinaPerfil(perfil.id, "0")).rejects.toHaveProperty("message", "The rutina with the given id was not found"); 
  });

  it('deleteRutinaPerfil should thrown an exception for an invalid perfil', async () => {
    const rutina: RutinaEntity = rutinasList[0];
    await expect(()=> service.deleteRutinaPerfil("0", rutina.id)).rejects.toHaveProperty("message", "The perfil with the given id was not found"); 
  });

  it('deleteRutinaPerfil should thrown an exception for an non asocciated rutina', async () => {
    const newRutina: RutinaEntity = await rutinaRepository.save({
      id: ""+Math.random(),
      nombre: faker.internet.password(), 
      infoAdicional: faker.lorem.sentence()
    });

    await expect(()=> service.deleteRutinaPerfil(perfil.id, newRutina.id)).rejects.toHaveProperty("message", "The rutina with the given id is not associated to the perfil"); 
  }); 

});