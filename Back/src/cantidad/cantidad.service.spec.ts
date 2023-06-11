import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CantidadEntity } from './cantidad.entity';
import { CantidadService } from './cantidad.service';
import { IngredienteEntity } from '../ingrediente/ingrediente.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { faker } from '@faker-js/faker';

describe('CantidadService', () => {
  let service: CantidadService;
  let cantidadRepository: Repository<CantidadEntity>;
  let ingredienteRepository: Repository<IngredienteEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let cantidadList : CantidadEntity[];
  let ingredienteList : IngredienteEntity[];
  let recetaList : RecetaEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CantidadService],
    }).compile();

    service = module.get<CantidadService>(CantidadService);
    cantidadRepository = module.get<Repository<CantidadEntity>>(getRepositoryToken(CantidadEntity));
    ingredienteRepository = module.get<Repository<IngredienteEntity>>(getRepositoryToken(IngredienteEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));

    await seedDatabase();
  });



  const seedDatabase = async () => {
    cantidadRepository.clear();
    ingredienteRepository.clear();
    recetaRepository.clear();
    cantidadList = [];
    ingredienteList = [];
    recetaList = [];
    for (let i = 0; i < 5; i++) {
      const ingrediente: IngredienteEntity = await ingredienteRepository.save({
        nombre: faker.name.firstName(),
        descripcion: faker.lorem.sentence(),
        calorias: faker.datatype.number(),
        infoAdicional: faker.lorem.sentence(),
      })
      ingredienteList.push(ingrediente);
    }
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.name.firstName(),
        descripcion: faker.lorem.sentence(),
        especificaciones: faker.lorem.sentence(),
        infoAdicional: faker.lorem.sentence(),
      })
      recetaList.push(receta);
    }
    for (let i = 0; i < 5; i++) {
      const cantidad: CantidadEntity = await cantidadRepository.save({
        cantidad: faker.datatype.number(),
        unidad: faker.lorem.sentence(),
      })
      cantidadList.push(cantidad);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it ('findAll should return all Cantidades', async () => {
    const cantidades: CantidadEntity[] = await service.findAll();
    expect(cantidades).toHaveLength(cantidadList.length);
    expect(cantidades).not.toBeNull();
  });

  it('findOne should return a Cantidad by id', async () => {
    const storedCantidad: CantidadEntity = cantidadList[0];
    const cantidad: CantidadEntity = await service.findOne(storedCantidad.id);
    expect(cantidad).not.toBeNull();
    expect(cantidad.id).toEqual(storedCantidad.id);
    expect(cantidad.cantidad).toEqual(storedCantidad.cantidad);
    expect(cantidad.unidad).toEqual(storedCantidad.unidad);
  });

  it ('findOne should throw an exceptionif for an invalid cantidad', async () => {
    await expect( () => service.findOne('0')).rejects.toHaveProperty('message', 'Cantidad no encontrada');
  });

  it('update should modify a Cantidad', async () => {
    const cantidad: CantidadEntity = cantidadList[0];
    cantidad.cantidad = faker.datatype.number();
    cantidad.unidad = faker.lorem.sentence();
    const updatedCantidad: CantidadEntity = await service.update(cantidad.id, cantidad);
    expect(updatedCantidad).not.toBeNull();
    const storedCantidad: CantidadEntity = await cantidadRepository.findOne({where: {id: cantidad.id}, relations: ['ingrediente', 'receta']});
    expect(storedCantidad).not.toBeNull();
    expect(storedCantidad.id).toEqual(updatedCantidad.id);
    expect(storedCantidad.cantidad).toEqual(updatedCantidad.cantidad);
    expect(storedCantidad.unidad).toEqual(updatedCantidad.unidad);
  });

  it('update should throw an exception if for an invalid cantidad', async () => {
    let cantidad: CantidadEntity = cantidadList[0];
    cantidad = {
      ...cantidad, cantidad: faker.datatype.number(), unidad: faker.lorem.sentence()
    }
    await expect( () => service.update('0', cantidad)).rejects.toHaveProperty('message', 'Cantidad no encontrada');
  });

  it ('delete should remove a Cantidad', async () => {
    const cantidad: CantidadEntity = cantidadList[0];
    await service.delete(cantidad.id);
    const storedCantidad: CantidadEntity = await cantidadRepository.findOne({where: {id: cantidad.id}});
    expect(storedCantidad).toBeNull;
  });

  it ('delete by receta and ingrediente should remove a Cantidad', async () => {
    const cantidad: CantidadEntity = cantidadList[0];
    const receta: RecetaEntity = recetaList[0];
    const ingrediente: IngredienteEntity = ingredienteList[0];
    await service.addIngredienteToReceta(receta.id, ingrediente.id, cantidad.id);
    await service.deleteIngredienteFromReceta(receta.id, ingrediente.id);
    const storedCantidad: CantidadEntity = await cantidadRepository.findOne({where: {id: cantidad.id}});
    expect(storedCantidad).toBeNull;
  });

  it('delete should throw an exception if for an invalid cantidad', async () => {
    await expect( () => service.delete('0')).rejects.toHaveProperty('message', 'Cantidad no encontrada');
  });

  it ('addIngredienteReceta should add an ingrediente to a receta', async () => {
    const cantidad: CantidadEntity = cantidadList[0];
    const receta: RecetaEntity = recetaList[0];
    const ingrediente: IngredienteEntity = ingredienteList[0];
    await service.addIngredienteToReceta(receta.id, ingrediente.id, cantidad.id);
    const storedReceta: RecetaEntity = await recetaRepository.findOne({where: {id: receta.id}});
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.calTotales).toEqual(ingrediente.calorias * cantidad.cantidad);
    const storedCantidad = await cantidadRepository.findOne({where: {id: cantidad.id}, relations: ['receta', 'ingrediente']});
    expect(storedCantidad).not.toBeNull();
    expect(storedCantidad.receta.id).toEqual(receta.id);
    expect(storedCantidad.ingrediente.id).toEqual(ingrediente.id);
  });

  it ('addIngredienteReceta should throw an exception if for an invalid receta', async () => {
    const cantidad: CantidadEntity = cantidadList[0];
    const ingrediente: IngredienteEntity = ingredienteList[0];
    await expect( () => service.addIngredienteToReceta('0', ingrediente.id, cantidad.id)).rejects.toHaveProperty('message', 'Receta no encontrada');
  });

  it ('addIngredienteReceta should throw an exception if for an invalid ingrediente', async () => {
    const cantidad: CantidadEntity = cantidadList[0];
    const receta: RecetaEntity = recetaList[0];
    await expect( () => service.addIngredienteToReceta(receta.id, '0', cantidad.id)).rejects.toHaveProperty('message', 'Ingrediente no encontrado');
  });

  it ('addIngredienteReceta should throw an exception if for an invalid cantidad', async () => {
    const receta: RecetaEntity = recetaList[0];
    const ingrediente: IngredienteEntity = ingredienteList[0];
    await expect( () => service.addIngredienteToReceta(receta.id, ingrediente.id, '0')).rejects.toHaveProperty('message', 'Cantidad no encontrada');
  });

  it ('findIngrredienteByRecetaIdIngredienteId should return a Cantidad', async () => {
    const cantidad: CantidadEntity = cantidadList[0];
    const receta: RecetaEntity = recetaList[0];
    const ingrediente: IngredienteEntity = ingredienteList[0];
    await service.addIngredienteToReceta(receta.id, ingrediente.id, cantidad.id);
    const storedIngrediente: IngredienteEntity = await service.findIngrredienteByRecetaIdIngredienteId(receta.id, ingrediente.id);
    expect(storedIngrediente).not.toBeNull();
    expect(storedIngrediente.id).toEqual(ingrediente.id);
    
  });

  it ('findIngrredienteByRecetaIdIngredienteId should throw an exception if for an invalid receta', async () => {
    const ingrediente: IngredienteEntity = ingredienteList[0];
    await expect( () => service.findIngrredienteByRecetaIdIngredienteId('0', ingrediente.id)).rejects.toHaveProperty('message', 'Receta no encontrada');
  });

  it ('findIngrredienteByRecetaIdIngredienteId should throw an exception if for an invalid ingrediente', async () => {
    const receta: RecetaEntity = recetaList[0];
    await expect( () => service.findIngrredienteByRecetaIdIngredienteId(receta.id, '0')).rejects.toHaveProperty('message', 'Ingrediente no encontrado');
  });

  it ('findIngrredienteByRecetaIdIngredienteId should throw an exception if for an invalid cantidad', async () => {
    const receta: RecetaEntity = recetaList[0];
    const ingrediente: IngredienteEntity = ingredienteList[0];
    await expect( () => service.findIngrredienteByRecetaIdIngredienteId(receta.id, ingrediente.id)).rejects.toHaveProperty('message', 'Ingrediente no encontrado en la receta');
  });

  it ('findIngredientesByRecetaId should return a list of Cantidad', async () => {
    const cantidad: CantidadEntity = cantidadList[0];
    const receta: RecetaEntity = recetaList[0];
    const ingrediente: IngredienteEntity = ingredienteList[0];
    await service.addIngredienteToReceta(receta.id, ingrediente.id, cantidad.id);
    const storedIngredientes: IngredienteEntity[] = await service.findIngredientesByRecetaId(receta.id);
    expect(storedIngredientes).not.toBeNull();
    expect(storedIngredientes.length).toEqual(1);
    expect(storedIngredientes[0].id).toEqual(ingrediente.id);
  });

  it ('findIngredientesByRecetaId should throw an exception if for an invalid receta', async () => {
    await expect( () => service.findIngredientesByRecetaId('0')).rejects.toHaveProperty('message', 'Receta no encontrada');
  });

});
