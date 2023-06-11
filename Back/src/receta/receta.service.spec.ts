import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { faker } from '@faker-js/faker';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetalist: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetalist = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: faker.name.firstName(),
        descripcion: faker.lorem.sentence(),
        especificaciones: faker.lorem.sentence(),
        infoAdicional: faker.lorem.sentence(),
      })
      recetalist.push(receta);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find should return all recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetalist.length);
  });

  it('findOne should return a receta by id', async () => {
    const storedReceta: RecetaEntity = recetalist[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.id).toEqual(storedReceta.id);
    expect(receta.nombre).toEqual(storedReceta.nombre);
    expect(receta.descripcion).toEqual(storedReceta.descripcion);
    expect(receta.calTotales).toEqual(storedReceta.calTotales);
    expect(receta.especificaciones).toEqual(storedReceta.especificaciones);
    expect(receta.infoAdicional).toEqual(storedReceta.infoAdicional);
    });

    it('findOne should throw an exception for an invalid receta', async () => {
      await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Receta no encontrada")
    });

    it ('create should return a new receta', async () => {
      const receta : RecetaEntity = new RecetaEntity(
        faker.name.firstName(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
      );
      const newReceta: RecetaEntity = await service.create(receta);
      expect(newReceta).not.toBeNull();

      const storedReceta: RecetaEntity = await repository.findOne({where: {id: newReceta.id}})
      expect(storedReceta).not.toBeNull();
      expect(storedReceta.nombre).toEqual(newReceta.nombre);
      expect(storedReceta.descripcion).toEqual(newReceta.descripcion);
      expect(storedReceta.calTotales).toEqual(newReceta.calTotales);
      expect(storedReceta.especificaciones).toEqual(newReceta.especificaciones);
      expect(storedReceta.infoAdicional).toEqual(newReceta.infoAdicional);

      });   
      
      it('update should modify a receta', async () => {
        const receta : RecetaEntity = recetalist[0];
        receta.nombre = "New name";
        receta.descripcion = "New description";

        const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
        expect(updatedReceta).not.toBeNull();

        const storedReceta: RecetaEntity = await repository.findOne({where: {id: updatedReceta.id}})
        expect(storedReceta).not.toBeNull();
        expect(storedReceta.nombre).toEqual(updatedReceta.nombre);
        expect(storedReceta.descripcion).toEqual(updatedReceta.descripcion);
    });

    it('update should throw an exception for an invalid receta', async () => {
      let receta : RecetaEntity = recetalist[0];
      receta = { ...receta, nombre : "New name", descripcion: "New description"}
      await expect(() => service.update("0", receta)).rejects.toHaveProperty("message", "Receta no encontrada")
    });

    it('delete should remove a receta', async () => {
      const receta : RecetaEntity = recetalist[0];
      await service.delete(receta.id);
      
      const deletedReceta: RecetaEntity = await repository.findOne({where: {id: receta.id}})
      expect(deletedReceta).toBeNull();
    });

    it('delete should throw an exception for an invalid receta', async () => {
      const receta : RecetaEntity = recetalist[0];
      await service.delete(receta.id);
      await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Receta no encontrada")
    });
});



