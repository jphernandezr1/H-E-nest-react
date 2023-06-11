import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { IngredienteEntity } from './ingrediente.entity';
import { IngredienteService } from './ingrediente.service';
import { faker } from '@faker-js/faker';

describe('IngredienteService', () => {
  let service: IngredienteService;
  let repository: Repository<IngredienteEntity>;
  let ingredientelist: IngredienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [IngredienteService],
    }).compile();

    service = module.get<IngredienteService>(IngredienteService);
    repository = module.get<Repository<IngredienteEntity>>(getRepositoryToken(IngredienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ingredientelist = [];
    for (let i = 0; i < 5; i++) {
      const ingrediente: IngredienteEntity = await repository.save({
        nombre: faker.name.firstName(),
        descripcion: faker.lorem.sentence(),
        calorias: faker.datatype.number(),
        infoAdicional: faker.lorem.sentence(),
      })
      ingredientelist.push(ingrediente);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find should return all ingredientes', async () => {
    const ingredientes: IngredienteEntity[] = await service.findAll();
    expect(ingredientes).not.toBeNull();
    expect(ingredientes).toHaveLength(ingredientelist.length);
  });

  it('findOne should return a ingrediente by id', async () => {
    const storedingrediente: IngredienteEntity = ingredientelist[0];
    const ingrediente: IngredienteEntity = await service.findOne(storedingrediente.id);
    expect(ingrediente).not.toBeNull();
    expect(ingrediente.id).toEqual(storedingrediente.id);
    expect(ingrediente.nombre).toEqual(storedingrediente.nombre);
    expect(ingrediente.descripcion).toEqual(storedingrediente.descripcion);
    expect(ingrediente.calorias).toEqual(storedingrediente.calorias);
    expect(ingrediente.infoAdicional).toEqual(storedingrediente.infoAdicional);
    });

    it('findOne should throw an exception for an invalid ingrediente', async () => {
      await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Ingrediente no encontrado")
    });

    it ('create should return a new ingrediente', async () => {
      const ingrediente : IngredienteEntity = {
        id:"",
        nombre: faker.name.firstName(),
        descripcion: faker.lorem.sentence(),
        calorias: faker.datatype.number(),
        infoAdicional: faker.lorem.sentence(),
      }
      const newingrediente: IngredienteEntity = await service.create(ingrediente);
      expect(newingrediente).not.toBeNull();

      const storedingrediente: IngredienteEntity = await repository.findOne({where: {id: newingrediente.id}})
      expect(storedingrediente).not.toBeNull();
      expect(storedingrediente.nombre).toEqual(newingrediente.nombre);
      expect(storedingrediente.descripcion).toEqual(newingrediente.descripcion);
      expect(storedingrediente.calorias).toEqual(newingrediente.calorias);
      expect(storedingrediente.infoAdicional).toEqual(newingrediente.infoAdicional);
      });   
      
      it('update should modify a ingrediente', async () => {
        const ingrediente : IngredienteEntity = ingredientelist[0];
        ingrediente.nombre = "New name";
        ingrediente.descripcion = "New description";

        const updatedingrediente: IngredienteEntity = await service.update(ingrediente.id, ingrediente);
        expect(updatedingrediente).not.toBeNull();

        const storedingrediente: IngredienteEntity = await repository.findOne({where: {id: updatedingrediente.id}})
        expect(storedingrediente).not.toBeNull();
        expect(storedingrediente.nombre).toEqual(updatedingrediente.nombre);
        expect(storedingrediente.descripcion).toEqual(updatedingrediente.descripcion);
    });

    it('update should throw an exception for an invalid ingrediente', async () => {
      let ingrediente : IngredienteEntity = ingredientelist[0];
      ingrediente = { ...ingrediente, nombre : "New name", descripcion: "New description"}
      await expect(() => service.update("0", ingrediente)).rejects.toHaveProperty("message", "Ingrediente no encontrado")
    });

    it('delete should remove a ingrediente', async () => {
      const ingrediente : IngredienteEntity = ingredientelist[0];
      await service.delete(ingrediente.id);
      
      const deletedingrediente: IngredienteEntity = await repository.findOne({where: {id: ingrediente.id}})
      expect(deletedingrediente).toBeNull();
    });

    it('delete should throw an exception for an invalid ingrediente', async () => {
      const ingrediente : IngredienteEntity = ingredientelist[0];
      await service.delete(ingrediente.id);
      await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Ingrediente no encontrado")
    });
});