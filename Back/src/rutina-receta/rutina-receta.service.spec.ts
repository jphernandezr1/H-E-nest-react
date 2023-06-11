import { Test, TestingModule } from '@nestjs/testing';
import { RecetaEntity } from '../receta/receta.entity';
import { RutinaEntity } from '../rutina/rutina.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RutinaRecetaService } from './rutina-receta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('RutinaRecetaService', () => {
  let service: RutinaRecetaService;
  let rutinaRepository: Repository<RutinaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let rutina: RutinaEntity;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RutinaRecetaService],
    }).compile();

    service = module.get<RutinaRecetaService>(RutinaRecetaService);
    rutinaRepository = module.get<Repository<RutinaEntity>>(getRepositoryToken(RutinaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    rutinaRepository.clear();

    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.name.firstName(),
        descripcion: faker.lorem.sentence(),
        especificaciones: faker.lorem.sentence(),
        infoAdicional: faker.lorem.sentence(),
      })
      recetasList.push(receta);
    }
    rutina = await rutinaRepository.save({
      nombre: faker.name.firstName(),
      infoAdicional: faker.lorem.sentence(),
      recetas: recetasList,
      ejercicios: [],
    });
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecetaRutina should add a receta to a rutina', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      calTotales: faker.datatype.number(),
      especificaciones: faker.lorem.sentence(),
      infoAdicional: faker.lorem.sentence(),
    });
    const newRutina: RutinaEntity = await rutinaRepository.save({
      nombre: faker.name.firstName(),
      infoAdicional: faker.lorem.sentence(),
      recetas: [],
      ejercicios: [],
    });
    const rutinaReceta = await service.addRecetaRutina(newRutina.id, newReceta.id);
    expect(rutinaReceta.recetas.length).toBe(1);
    expect(rutinaReceta.recetas[0]).not.toBeNull();
    expect(rutinaReceta.recetas[0].nombre).toBe(newReceta.nombre);
    expect(rutinaReceta.recetas[0].descripcion).toBe(newReceta.descripcion);
    expect(rutinaReceta.recetas[0].calTotales).toBe(newReceta.calTotales);
    expect(rutinaReceta.recetas[0].especificaciones).toBe(newReceta.especificaciones);
    expect(rutinaReceta.recetas[0].infoAdicional).toBe(newReceta.infoAdicional);
  });

  it('addRecetaRutina should thrown an exception for an invalid receta', async () => {
    const newRutina: RutinaEntity = await rutinaRepository.save({
      nombre: faker.name.firstName(),
      infoAdicional: faker.lorem.sentence(),
      recetas: [],
      ejercicios: [],
    });
    
    await expect(service.addRecetaRutina(newRutina.id, 'invalidId')).rejects.toHaveProperty("message", "Receta no encontrada")
  });

  it('addRecetaRutina should thrown an exception for an invalid rutina', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      calTotales: faker.datatype.number(),
      especificaciones: faker.lorem.sentence(),
      infoAdicional: faker.lorem.sentence(),
    });
    await expect(service.addRecetaRutina('invalidId', newReceta.id)).rejects.toHaveProperty("message", "Rutina no encontrada")
  });

  it('findRecetaByRutinaIdRecetaId should return a receta by rutina', async () => {
    const receta : RecetaEntity = recetasList[0];
    const rutinaReceta = await service.findRecetaByRutinaIdRecetaId(rutina.id, receta.id);
    expect(rutinaReceta).not.toBeNull();
    expect(rutinaReceta.nombre).toBe(receta.nombre);
    expect(rutinaReceta.descripcion).toBe(receta.descripcion);
    expect(rutinaReceta.calTotales).toBe(receta.calTotales);
    expect(rutinaReceta.especificaciones).toBe(receta.especificaciones);
    expect(rutinaReceta.infoAdicional).toBe(receta.infoAdicional);
});

  it('findRecetaByRutinaIdRecetaId should thrown an exception for an invalid receta', async () => {
    await expect(service.findRecetaByRutinaIdRecetaId(rutina.id, 'invalidId')).rejects.toHaveProperty("message", "Receta no encontrada")
  });

  it('findRecetaByRutinaIdRecetaId should thrown an exception for an invalid rutina', async () => {
    const receta : RecetaEntity = recetasList[0];
    await expect(service.findRecetaByRutinaIdRecetaId('invalidId', receta.id)).rejects.toHaveProperty("message", "Rutina no encontrada")
  });

  it('findRecetaByRutinaIdRecetaId should thrown an exception for a receta not associated to the rutina', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      calTotales: faker.datatype.number(),
      especificaciones: faker.lorem.sentence(),
      infoAdicional: faker.lorem.sentence(),
    });
    await expect(service.findRecetaByRutinaIdRecetaId(rutina.id, newReceta.id)).rejects.toHaveProperty("message", "Receta no encontrada en la rutina")
  });

  it('findRecetasByRutinaId should return a list of recetas by rutina', async () => {
    const recetas : RecetaEntity[] = await service.findRecetasByRutinaId(rutina.id);
    expect(recetas.length).toBe(5);
  });

  it('findRecetasByRutinaId should thrown an exception for an invalid rutina', async () => {
    await expect(()=>service.findRecetasByRutinaId('invalidId')).rejects.toHaveProperty("message", "Rutina no encontrada")
  });

  it('associateRecetasRutina should update recetas list for a rutina', async () => {
    const newReceta : RecetaEntity = await recetaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      calTotales: faker.datatype.number(),
      especificaciones: faker.lorem.sentence(),
      infoAdicional: faker.lorem.sentence(),
    });
    const updatedRutina : RutinaEntity = await service.associateRecetasRutina(rutina.id, [newReceta]);
    expect(updatedRutina.recetas.length).toBe(1);
    expect(updatedRutina.recetas[0]).not.toBeNull();
    expect(updatedRutina.recetas[0].nombre).toBe(newReceta.nombre);
    expect(updatedRutina.recetas[0].descripcion).toBe(newReceta.descripcion);
    expect(updatedRutina.recetas[0].calTotales).toBe(newReceta.calTotales);
    expect(updatedRutina.recetas[0].especificaciones).toBe(newReceta.especificaciones);
    expect(updatedRutina.recetas[0].infoAdicional).toBe(newReceta.infoAdicional);
  });

  it('associateRecetasRutina should thrown an exception for an invalid rutina', async () => {
    const newReceta : RecetaEntity = recetasList[0];
    newReceta.id = 'invalidId';
    await expect(()=> service.associateRecetasRutina('invalidId', [newReceta])).rejects.toHaveProperty("message", "Rutina no encontrada")
  });

  it('associateRecetasRutina should thrown an exception for an invalid receta', async () => {
    const newReceta : RecetaEntity = await recetaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      calTotales: faker.datatype.number(),
      especificaciones: faker.lorem.sentence(),
      infoAdicional: faker.lorem.sentence(),
    });
    await expect(()=> service.associateRecetasRutina("0", [newReceta])).rejects.toHaveProperty("message", "Rutina no encontrada")
  });

  it('deleteRecetaRutina should delete a receta from a rutina', async () => {
    const receta : RecetaEntity = recetasList[0];
    await service.deleteRecetaRutina(rutina.id, receta.id);
    const storedRutina : RutinaEntity = await rutinaRepository.findOne({where: {id: rutina.id}, relations: ['recetas']});
    const deleteReceta : RecetaEntity = storedRutina.recetas.find(e => e.id === receta.id);
    expect(deleteReceta).toBeUndefined();
  });

  it('deleteRecetaRutina should thrown an exception for an invalid receta', async () => {
    await expect(()=> service.deleteRecetaRutina(rutina.id, 'invalidId')).rejects.toHaveProperty("message", "Receta no encontrada")
  });

  it('deleteRecetaRutina should thrown an exception for an invalid rutina', async () => {
    const receta : RecetaEntity = recetasList[0];
    await expect(()=> service.deleteRecetaRutina("0", receta.id)).rejects.toHaveProperty("message", "Rutina no encontrada")
  });

  it('deleteRecetasRutina should thrown an exception for a receta not associated to the rutina', async () => {
    const receta : RecetaEntity = await recetaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      calTotales: faker.datatype.number(),
      especificaciones: faker.lorem.sentence(),
      infoAdicional: faker.lorem.sentence(),
    });
    await expect(()=> service.deleteRecetaRutina(rutina.id, receta.id)).rejects.toHaveProperty("message", "Receta no encontrada en la rutina")
  });

});








  

    



    



